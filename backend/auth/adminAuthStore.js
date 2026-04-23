const crypto = require("crypto");
const path = require("path");
const { loadJsonArray, saveJsonArray } = require("../storage/runtimeJsonStore");

const adminAccountsFilePath = path.join(__dirname, "..", "..", "data", "admin-accounts.json");

const defaultAdminAccounts = [
  {
    id: "AD-01",
    role: "passaic",
    name: "Passaic County Admin",
    email: "county@idhelp.org",
    organization_id: "ORG-COUNTY",
    organization_name: "Passaic County Housing Coordination",
    passwordSalt: "b27b9e40a7569e60a2871594ae0686ba",
    passwordHash: "d87dcd712523a636f0cca5338386dd6b3ad0bc0a8f0a99d592ea8b1d33aad7ab84a14c04d8e45da8c7759bb0f4d4422c51fbcf5c266db61c7334a17895b73883"
  },
  {
    id: "AD-02",
    role: "caseworker",
    workerId: "WK-01",
    name: "Sarah Ahmed",
    email: "sarah.ahmed@idhelp.org",
    organization_id: "ORG-COUNTY",
    organization_name: "Passaic County Housing Coordination",
    passwordSalt: "b510a31de7121df2ad078ca10959b6c5",
    passwordHash: "6a0e28c1407e7128cd3516f9a4fa03c6291774e7514e09c0260d3fc065e929e9e83ba72361b0137775eedb9aa10cbed377e9030963fd5f33a521a743afab9830"
  },
  {
    id: "AD-03",
    role: "caseworker",
    workerId: "WK-02",
    name: "Daniel Kim",
    email: "daniel.kim@idhelp.org",
    organization_id: "ORG-SHELTER",
    organization_name: "Paterson Shelter Navigation Team",
    passwordSalt: "6f17771f8c77d0d63293e9ca0f368ba1",
    passwordHash: "bef1f20b9b0677523817191924a38098781cc98427e828cd0763ed1cfa35ab45c2ad49a91efaf2c05473cb0f28f2b141f8d992d2a1af788e6b1b5de74c336475"
  },
  {
    id: "AD-04",
    role: "caseworker",
    workerId: "WK-03",
    name: "Priya Shah",
    email: "priya.shah@idhelp.org",
    organization_id: "ORG-HOSPITAL",
    organization_name: "St. Joseph Hospital Support Team",
    passwordSalt: "545bb21cfd5e848eb9acf4b12c57b5de",
    passwordHash: "df80dcd5a13a8368a3a08d87cfe78258ca8e8b3be6094a202d1f3bf78700d01976573e820bae2b45a820d37f71d4fe28f30f45aa674b947119f885cf35300a84"
  },
  {
    id: "AD-05",
    role: "caseworker",
    workerId: "WK-04",
    name: "Marcus Hill",
    email: "marcus.hill@idhelp.org",
    organization_id: "ORG-NONPROFIT",
    organization_name: "Community Document Access Network",
    passwordSalt: "8c35a9059d54d9ca769959470d02ed34",
    passwordHash: "373c1603d21694212e898811392935aa05d4c9cbd9918a98b06cb473dbb6dca30c14fc1f3290a282fddb1a726c111b7b710aac5f02cc19864ce0f0b33a534a39"
  },
  {
    id: "AD-ORG-SHELTER",
    role: "organization",
    name: "Shelter Organization Admin",
    email: "shelter@idhelp.org",
    organization_id: "ORG-SHELTER",
    organization_name: "Paterson Shelter Navigation Team",
    passwordSalt: "512f5094bf72677db57d32d45ad68d9a",
    passwordHash: "32c9db731734a2272cc1853b245479d6f7bdf962165877d0600f32b611a95bdfd692efbbca4d0a0a81112233a9950431d96b5b2f1d2c5a12ae9ad0cd65cd456e"
  },
  {
    id: "AD-07",
    role: "organization",
    name: "Hospital Organization Admin",
    email: "hospital@idhelp.org",
    organization_id: "ORG-HOSPITAL",
    organization_name: "St. Joseph Hospital Support Team",
    passwordSalt: "050f3f43ec6448b5dd6553c17b99829b",
    passwordHash: "a1dc1d98b064f3904bdf903f8e3134acb4aa8b2d146f671edfc7df12b419eb3c9a42c7ec9ce799cbfa85b159fb1be0fcf895b4d337ace5cf4b9030ff1b98b625"
  },
  {
    id: "AD-08",
    role: "organization",
    name: "Community Network Admin",
    email: "community@idhelp.org",
    organization_id: "ORG-NONPROFIT",
    organization_name: "Community Document Access Network",
    passwordSalt: "c72d437d2cae7e54589433aebfcb8820",
    passwordHash: "463512820421e2faa8dd670c5df6c22e4d67f2840d3ece785d352bd1d455e58f3211494fbcdcd1fc3c2ead2b5d6c7f9759d5e9173fe7f60cc9e8092c85c65164"
  }
];

function mergeDefaultAdminAccounts(accounts) {
  const defaultById = new Map(defaultAdminAccounts.map((account) => [account.id, account]));
  const seenIds = new Set();
  let changed = false;

  const mergedAccounts = accounts.map((account) => {
    seenIds.add(account.id);

    if (!defaultById.has(account.id)) {
      return account;
    }

    const mergedAccount = { ...defaultById.get(account.id), ...account };
    if (JSON.stringify(mergedAccount) !== JSON.stringify(account)) {
      changed = true;
    }

    return mergedAccount;
  });

  defaultAdminAccounts.forEach((account) => {
    if (!seenIds.has(account.id)) {
      mergedAccounts.push({ ...account });
      changed = true;
    }
  });

  return { accounts: mergedAccounts, changed };
}

function slugifyNamePart(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

function buildCaseworkerDemoEmail(account, accounts) {
  const nameSlug = slugifyNamePart(account.name) || slugifyNamePart(account.workerId) || "caseworker";
  const workerSlug = slugifyNamePart(account.workerId) || "worker";
  const baseLocalPart = [nameSlug, workerSlug].filter(Boolean).join(".");
  const takenEmails = new Set(accounts
    .filter((item) => item !== account)
    .flatMap((item) => [item.email, item.demo_email])
    .map((email) => normalizeEmail(email))
    .filter(Boolean));

  let candidate = `${baseLocalPart}@idhelp.org`;
  let suffix = 2;

  while (takenEmails.has(candidate)) {
    candidate = `${baseLocalPart}.${suffix}@idhelp.org`;
    suffix += 1;
  }

  return candidate;
}

function ensureCaseworkerDemoEmails(accounts) {
  let changed = false;

  accounts.forEach((account) => {
    if (account.role !== "caseworker") {
      return;
    }

    const normalizedPrimaryEmail = normalizeEmail(account.email);
    if (account.email !== normalizedPrimaryEmail) {
      account.email = normalizedPrimaryEmail;
      changed = true;
    }

    const shouldReusePrimaryForDemo = normalizedPrimaryEmail.endsWith("@idhelp.org");
    const normalizedStoredDemoEmail = normalizeEmail(account.demo_email);
    const shouldRebuildDemoEmail = !normalizedStoredDemoEmail || (
      normalizedStoredDemoEmail === normalizedPrimaryEmail && !shouldReusePrimaryForDemo
    );
    const targetDemoEmail = shouldRebuildDemoEmail
      ? (shouldReusePrimaryForDemo ? normalizedPrimaryEmail : buildCaseworkerDemoEmail(account, accounts))
      : normalizedStoredDemoEmail;

    if (account.demo_email !== targetDemoEmail) {
      account.demo_email = targetDemoEmail;
      changed = true;
    }
  });

  return changed;
}

function loadAdminAccounts() {
  const loadedAccounts = loadJsonArray(adminAccountsFilePath, defaultAdminAccounts, { key: "admin-accounts" });
  const { accounts, changed } = mergeDefaultAdminAccounts(loadedAccounts);
  const demoEmailsChanged = ensureCaseworkerDemoEmails(accounts);

  if (changed || demoEmailsChanged) {
    saveJsonArray(adminAccountsFilePath, accounts, { key: "admin-accounts" });
  }

  return accounts;
}

function saveAdminAccounts(accounts) {
  ensureCaseworkerDemoEmails(accounts);
  saveJsonArray(adminAccountsFilePath, accounts, { key: "admin-accounts" });
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

function getDefaultOrganizationForAccount(account) {
  if (account.role === "passaic") {
    return {
      organization_id: "ORG-COUNTY",
      organization_name: "Passaic County Housing Coordination"
    };
  }

  if (account.role === "organization") {
    return {
      organization_id: account.organization_id || "ORG-SHELTER",
      organization_name: account.organization_name || "Partner Organization"
    };
  }

  const workerOrganizations = {
    "WK-01": { organization_id: "ORG-COUNTY", organization_name: "Passaic County Housing Coordination" },
    "WK-02": { organization_id: "ORG-SHELTER", organization_name: "Paterson Shelter Navigation Team" },
    "WK-03": { organization_id: "ORG-HOSPITAL", organization_name: "St. Joseph Hospital Support Team" },
    "WK-04": { organization_id: "ORG-NONPROFIT", organization_name: "Community Document Access Network" }
  };

  return workerOrganizations[account.workerId] || {
    organization_id: "ORG-COUNTY",
    organization_name: "Passaic County Housing Coordination"
  };
}

function sanitizeAdminAccount(account) {
  const organization = getDefaultOrganizationForAccount(account);

  return {
    id: account.id,
    role: account.role,
    name: account.name,
    email: account.email,
    demo_email: account.demo_email || account.email || "",
    workerId: account.workerId || null,
    organization_id: account.organization_id || organization.organization_id,
    organization_name: account.organization_name || organization.organization_name
  };
}

function verifyAdminLogin(role, email, password) {
  const normalizedEmail = normalizeEmail(email);
  const account = loadAdminAccounts().find((item) => (
    item.role === role && (
      normalizeEmail(item.email) === normalizedEmail ||
      normalizeEmail(item.demo_email) === normalizedEmail
    )
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
  const normalizedRole = role === "passaic"
    ? "passaic"
    : (role === "organization" ? "organization" : "caseworker");
  const account = loadAdminAccounts().find((item) => item.role === normalizedRole);

  return account ? sanitizeAdminAccount(account) : null;
}

function getOrganizationAdminAccounts() {
  return loadAdminAccounts()
    .filter((item) => item.role === "organization")
    .map((account) => sanitizeAdminAccount(account));
}

function getDemoCaseworkerAccounts() {
  return loadAdminAccounts()
    .filter((item) => item.role === "caseworker")
    .map((account) => sanitizeAdminAccount(account));
}

module.exports = {
  getDemoAdminAccount,
  getDemoCaseworkerAccounts,
  getOrganizationAdminAccounts,
  loadAdminAccounts,
  saveAdminAccounts,
  verifyAdminLogin
};
