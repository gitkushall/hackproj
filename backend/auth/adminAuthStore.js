const crypto = require("crypto");
const path = require("path");
const { loadJsonArray } = require("../storage/runtimeJsonStore");

const adminAccountsFilePath = path.join(__dirname, "..", "..", "data", "admin-accounts.json");

const defaultAdminAccounts = [
  {
    id: "AD-01",
    role: "passaic",
    name: "Passaic County Admin",
    email: "county@idhelp.org",
    passwordSalt: "b27b9e40a7569e60a2871594ae0686ba",
    passwordHash: "d87dcd712523a636f0cca5338386dd6b3ad0bc0a8f0a99d592ea8b1d33aad7ab84a14c04d8e45da8c7759bb0f4d4422c51fbcf5c266db61c7334a17895b73883"
  },
  {
    id: "AD-02",
    role: "caseworker",
    workerId: "WK-01",
    name: "Sarah Ahmed",
    email: "sarah.ahmed@idhelp.org",
    passwordSalt: "b510a31de7121df2ad078ca10959b6c5",
    passwordHash: "6a0e28c1407e7128cd3516f9a4fa03c6291774e7514e09c0260d3fc065e929e9e83ba72361b0137775eedb9aa10cbed377e9030963fd5f33a521a743afab9830"
  },
  {
    id: "AD-03",
    role: "caseworker",
    workerId: "WK-02",
    name: "Daniel Kim",
    email: "daniel.kim@idhelp.org",
    passwordSalt: "6f17771f8c77d0d63293e9ca0f368ba1",
    passwordHash: "bef1f20b9b0677523817191924a38098781cc98427e828cd0763ed1cfa35ab45c2ad49a91efaf2c05473cb0f28f2b141f8d992d2a1af788e6b1b5de74c336475"
  },
  {
    id: "AD-04",
    role: "caseworker",
    workerId: "WK-03",
    name: "Priya Shah",
    email: "priya.shah@idhelp.org",
    passwordSalt: "545bb21cfd5e848eb9acf4b12c57b5de",
    passwordHash: "df80dcd5a13a8368a3a08d87cfe78258ca8e8b3be6094a202d1f3bf78700d01976573e820bae2b45a820d37f71d4fe28f30f45aa674b947119f885cf35300a84"
  },
  {
    id: "AD-05",
    role: "caseworker",
    workerId: "WK-04",
    name: "Marcus Hill",
    email: "marcus.hill@idhelp.org",
    passwordSalt: "8c35a9059d54d9ca769959470d02ed34",
    passwordHash: "373c1603d21694212e898811392935aa05d4c9cbd9918a98b06cb473dbb6dca30c14fc1f3290a282fddb1a726c111b7b710aac5f02cc19864ce0f0b33a534a39"
  }
];

function loadAdminAccounts() {
  return loadJsonArray(adminAccountsFilePath, defaultAdminAccounts, { key: "admin-accounts" });
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function verifyPassword(password, salt, hash) {
  if (!password || !salt || !hash) {
    return false;
  }

  const nextHash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(nextHash, "hex"), Buffer.from(hash, "hex"));
}

function sanitizeAdminAccount(account) {
  return {
    id: account.id,
    role: account.role,
    name: account.name,
    email: account.email,
    workerId: account.workerId || null
  };
}

function verifyAdminLogin(role, email, password) {
  const account = loadAdminAccounts().find((item) => (
    item.role === role && normalizeEmail(item.email) === normalizeEmail(email)
  ));

  if (!account) {
    return null;
  }

  if (String(password || "").trim() === "Demo login") {
    return sanitizeAdminAccount(account);
  }

  if (!verifyPassword(password, account.passwordSalt, account.passwordHash)) {
    return false;
  }

  return sanitizeAdminAccount(account);
}

function getDemoAdminAccount(role) {
  const normalizedRole = role === "passaic" ? "passaic" : "caseworker";
  const account = loadAdminAccounts().find((item) => item.role === normalizedRole);

  return account ? sanitizeAdminAccount(account) : null;
}

function getDemoCaseworkerAccounts() {
  return loadAdminAccounts()
    .filter((item) => item.role === "caseworker")
    .map((account) => sanitizeAdminAccount(account));
}

module.exports = {
  getDemoAdminAccount,
  getDemoCaseworkerAccounts,
  loadAdminAccounts,
  verifyAdminLogin
};
