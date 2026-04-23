const fs = require("fs");
const path = require("path");

const TMP_ROOT = path.join("/tmp", "passaic-county-housing-portal");
const cache = new Map();
const warnedMessages = new Set();
const dbCache = new Map();
let DatabaseSync = null;
let databaseSupportChecked = false;
let databaseSupportError = null;

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

function getDatabaseSync() {
  if (databaseSupportChecked) {
    return DatabaseSync;
  }

  databaseSupportChecked = true;

  try {
    ({ DatabaseSync } = require("node:sqlite"));
  } catch (error) {
    databaseSupportError = error;
    DatabaseSync = null;
  }

  return DatabaseSync;
}

function getStorageMode() {
  const configured = String(process.env.RUNTIME_STORAGE_MODE || "").trim().toLowerCase();
  if (configured === "filesystem" || configured === "memory" || configured === "tmp") {
    return configured;
  }

  if (process.env.VERCEL) {
    return "tmp";
  }

  if (process.env.NODE_ENV === "production") {
    return getDatabaseSync() ? "filesystem" : "memory";
  }

  return "filesystem";
}

function shouldUseSQLite(mode) {
  if (String(process.env.RUNTIME_DISABLE_SQLITE || "").trim() === "1") {
    return false;
  }

  if (mode === "tmp") {
    return false;
  }

  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  return Boolean(getDatabaseSync());
}

function getTmpFilePath(filePath) {
  return path.join(TMP_ROOT, path.basename(filePath));
}

function getLegacyFilePath(mode, filePath) {
  return mode === "tmp" ? getTmpFilePath(filePath) : filePath;
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

function saveArrayToLegacyFile(mode, filePath, value) {
  const targetPath = getLegacyFilePath(mode, filePath);
  writeArrayToFile(targetPath, value);
}

function getDatabasePath(mode, filePath) {
  if (mode === "tmp") {
    return path.join(TMP_ROOT, "runtime.sqlite");
  }

  return path.join(path.dirname(filePath), "runtime.sqlite");
}

function getDatabase(mode, filePath) {
  const Database = getDatabaseSync();

  if (!Database) {
    throw new Error(`SQLite runtime storage is unavailable: ${databaseSupportError ? databaseSupportError.message : "node:sqlite could not be loaded"}`);
  }

  const dbPath = getDatabasePath(mode, filePath);

  if (dbCache.has(dbPath)) {
    return dbCache.get(dbPath);
  }

  ensureDirectoryForFile(dbPath);
  const db = new Database(dbPath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    CREATE TABLE IF NOT EXISTS json_store (
      store_key TEXT PRIMARY KEY,
      source_file TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  dbCache.set(dbPath, db);
  return db;
}

function loadArrayFromDatabase(db, key) {
  const row = db.prepare(`
    SELECT payload
    FROM json_store
    WHERE store_key = ?
  `).get(key);

  if (!row) {
    return null;
  }

  const parsed = JSON.parse(row.payload);
  if (!Array.isArray(parsed)) {
    throw new Error("Database payload must contain an array.");
  }

  return parsed;
}

function saveArrayToDatabase(db, key, filePath, value) {
  db.prepare(`
    INSERT INTO json_store (store_key, source_file, payload, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(store_key) DO UPDATE SET
      source_file = excluded.source_file,
      payload = excluded.payload,
      updated_at = excluded.updated_at
  `).run(
    key,
    path.basename(filePath),
    JSON.stringify(value),
    new Date().toISOString()
  );
}

function loadJsonArray(filePath, fallbackValue, options = {}) {
  const key = options.key || filePath;
  const mode = getStorageMode();
  const sqliteEnabled = shouldUseSQLite(mode);

  if (cache.has(key)) {
    return cache.get(key);
  }

  const fallbackClone = cloneValue(fallbackValue);

  if (mode === "filesystem" || mode === "tmp") {
    const legacyFilePath = getLegacyFilePath(mode, filePath);

    if (mode === "tmp" && fs.existsSync(legacyFilePath)) {
      try {
        const persisted = readArrayFromFile(legacyFilePath);
        cache.set(key, persisted);
        return persisted;
      } catch (error) {
        warnOnce(`Failed to read ${path.basename(filePath)} from temporary JSON fallback.`, error);
      }
    }

    if (!sqliteEnabled) {
      try {
        const seeded = fs.existsSync(legacyFilePath)
          ? readArrayFromFile(legacyFilePath)
          : (fs.existsSync(filePath) ? readArrayFromFile(filePath) : fallbackClone);
        saveArrayToLegacyFile(mode, filePath, seeded);
        cache.set(key, seeded);
        return seeded;
      } catch (fileError) {
        warnOnce(`Failed to read legacy fallback ${path.basename(filePath)}. Using defaults instead.`, fileError);
        cache.set(key, fallbackClone);
        return fallbackClone;
      }
    }

    try {
      const db = getDatabase(mode, filePath);
      const persisted = loadArrayFromDatabase(db, key);
      if (persisted) {
        cache.set(key, persisted);
        return persisted;
      }

      const seeded = fs.existsSync(filePath) ? readArrayFromFile(filePath) : fallbackClone;
      saveArrayToDatabase(db, key, filePath, seeded);
      saveArrayToLegacyFile(mode, filePath, seeded);
      cache.set(key, seeded);
      return seeded;
    } catch (error) {
      const sourceLabel = mode === "tmp" ? "/tmp SQLite storage" : "SQLite storage";
      warnOnce(`Failed to load ${path.basename(filePath)} from ${sourceLabel}. Falling back to file or defaults.`, error);

      try {
        const seeded = fs.existsSync(legacyFilePath)
          ? readArrayFromFile(legacyFilePath)
          : (fs.existsSync(filePath) ? readArrayFromFile(filePath) : fallbackClone);
        cache.set(key, seeded);
        return seeded;
      } catch (fileError) {
        warnOnce(`Failed to read legacy fallback ${path.basename(filePath)}. Using defaults instead.`, fileError);
        cache.set(key, fallbackClone);
        return fallbackClone;
      }
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
  const sqliteEnabled = shouldUseSQLite(mode);

  cache.set(key, value);

  if (mode === "filesystem" || mode === "tmp") {
    try {
      saveArrayToLegacyFile(mode, filePath, value);
    } catch (error) {
      const targetLabel = mode === "tmp" ? "temporary JSON fallback" : "JSON fallback";
      warnOnce(`Failed to persist ${path.basename(filePath)} to ${targetLabel}.`, error);
    }

    if (!sqliteEnabled) {
      return;
    }

    try {
      const db = getDatabase(mode, filePath);
      saveArrayToDatabase(db, key, filePath, value);
    } catch (error) {
      const sourceLabel = mode === "tmp" ? "/tmp SQLite storage" : "SQLite storage";
      warnOnce(`Failed to persist ${path.basename(filePath)} to ${sourceLabel}. Changes remain in memory only.`, error);
    }
    return;
  }

  warnOnce(`Runtime storage is read-only in this environment. ${path.basename(filePath)} updates will remain in memory for this instance only.`);
}

function getRuntimeStorageInfo() {
  const mode = getStorageMode();
  const sqliteAvailable = shouldUseSQLite(mode);
  const sqliteTarget = mode === "filesystem"
    ? "SQLite database in project data/runtime.sqlite"
    : path.join(TMP_ROOT, "runtime.sqlite");
  const legacyTarget = mode === "tmp" ? path.join(TMP_ROOT, "*.json") : "project data/*.json";
  const writableRoot = mode === "filesystem" || mode === "tmp"
    ? (sqliteAvailable ? `${sqliteTarget} with ${legacyTarget} fallback` : legacyTarget)
    : "memory only";

  return {
    mode,
    writableRoot,
    persistent: mode === "filesystem" && sqliteAvailable
  };
}

module.exports = {
  getRuntimeStorageInfo,
  loadJsonArray,
  saveJsonArray
};
