const fs = require("fs");
const path = require("path");

const TMP_ROOT = path.join("/tmp", "passaic-county-housing-portal");
const cache = new Map();
const warnedMessages = new Set();

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function warnOnce(message, error = null) {
  if (warnedMessages.has(message)) {
    return;
  }

  warnedMessages.add(message);
  if (error) {
    console.warn(message, error.message);
    return;
  }

  console.warn(message);
}

function getStorageMode() {
  const configured = String(process.env.RUNTIME_STORAGE_MODE || "").trim().toLowerCase();
  if (configured === "filesystem" || configured === "memory" || configured === "tmp") {
    return configured;
  }

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return "memory";
  }

  return "filesystem";
}

function getTmpFilePath(filePath) {
  return path.join(TMP_ROOT, path.basename(filePath));
}

function ensureDirectoryForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readArrayFromFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error("Storage file must contain an array.");
  }

  return parsed;
}

function writeArrayToFile(filePath, value) {
  ensureDirectoryForFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function loadJsonArray(filePath, fallbackValue, options = {}) {
  const key = options.key || filePath;
  const mode = getStorageMode();

  if (cache.has(key)) {
    return cache.get(key);
  }

  const fallbackClone = cloneValue(fallbackValue);

  if (mode === "filesystem") {
    try {
      if (!fs.existsSync(filePath)) {
        writeArrayToFile(filePath, fallbackClone);
      }

      const parsed = readArrayFromFile(filePath);
      cache.set(key, parsed);
      return parsed;
    } catch (error) {
      warnOnce(`Failed to load ${path.basename(filePath)} from the local filesystem. Using defaults instead.`, error);
      try {
        writeArrayToFile(filePath, fallbackClone);
      } catch (writeError) {
        warnOnce(`Failed to recreate ${path.basename(filePath)} on the local filesystem.`, writeError);
      }
      cache.set(key, fallbackClone);
      return fallbackClone;
    }
  }

  if (mode === "tmp") {
    const tmpFilePath = getTmpFilePath(filePath);

    try {
      if (fs.existsSync(tmpFilePath)) {
        const parsed = readArrayFromFile(tmpFilePath);
        cache.set(key, parsed);
        return parsed;
      }

      const seeded = fs.existsSync(filePath) ? readArrayFromFile(filePath) : fallbackClone;
      writeArrayToFile(tmpFilePath, seeded);
      cache.set(key, seeded);
      return seeded;
    } catch (error) {
      warnOnce(`Failed to load ${path.basename(filePath)} from /tmp storage. Falling back to in-memory data.`, error);
      cache.set(key, fallbackClone);
      return fallbackClone;
    }
  }

  try {
    const parsed = fs.existsSync(filePath) ? readArrayFromFile(filePath) : fallbackClone;
    cache.set(key, parsed);
    return parsed;
  } catch (error) {
    warnOnce(`Failed to read ${path.basename(filePath)} in read-only runtime. Falling back to in-memory data.`, error);
    cache.set(key, fallbackClone);
    return fallbackClone;
  }
}

function saveJsonArray(filePath, value, options = {}) {
  const key = options.key || filePath;
  const mode = getStorageMode();

  cache.set(key, value);

  if (mode === "filesystem") {
    try {
      writeArrayToFile(filePath, value);
    } catch (error) {
      warnOnce(`Failed to persist ${path.basename(filePath)} to the local filesystem. Changes remain in memory only.`, error);
    }
    return;
  }

  if (mode === "tmp") {
    try {
      writeArrayToFile(getTmpFilePath(filePath), value);
    } catch (error) {
      warnOnce(`Failed to persist ${path.basename(filePath)} to /tmp storage. Changes remain in memory only.`, error);
    }
    return;
  }

  warnOnce(`Runtime storage is read-only in this environment. ${path.basename(filePath)} updates will remain in memory for this instance only.`);
}

function getRuntimeStorageInfo() {
  const mode = getStorageMode();
  return {
    mode,
    writableRoot: mode === "filesystem" ? "project filesystem" : (mode === "tmp" ? TMP_ROOT : "memory only"),
    persistent: mode === "filesystem"
  };
}

module.exports = {
  getRuntimeStorageInfo,
  loadJsonArray,
  saveJsonArray
};
