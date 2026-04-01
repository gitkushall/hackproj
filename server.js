require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const path = require("path");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const { getDemoAdminAccount, getDemoCaseworkerAccounts, verifyAdminLogin } = require("./backend/auth/adminAuthStore");
const { generateAdminInsight } = require("./backend/services/openaiService");
const { getRuntimeStorageInfo, loadJsonArray, saveJsonArray } = require("./backend/storage/runtimeJsonStore");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || "";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "";
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || "";
const NJ_BIRTH_ORDER_URL = "https://www.nj.gov/health/vital/order-vital/";
const NJ_LOCAL_VITAL_RECORDS_URL = "https://www.nj.gov/health/vital/local-vital-records/";
const SSA_CARD_URL = "https://www.ssa.gov/number-card";
const SSA_OFFICE_LOCATOR_URL = "https://www.ssa.gov/locator/";
const NJ_MVC_ID_URL = "https://www.nj.gov/mvc/license/non-driverid.htm";
const NJ_MVC_APPOINTMENT_URL = "https://telegov.njportal.com/njmvc/AppointmentWizard";
const NJ_MVC_LOCATIONS_URL = "https://www.nj.gov/mvc/locations/liccenters.htm";

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const dataDirectory = path.join(__dirname, "data");
const clientAccountsFilePath = path.join(dataDirectory, "client-accounts.json");
const clientsFilePath = path.join(dataDirectory, "clients.json");
const workersFilePath = path.join(dataDirectory, "workers.json");
const notificationsFilePath = path.join(dataDirectory, "notifications.json");
const clientNotificationsFilePath = path.join(dataDirectory, "client-notifications.json");
const transportRequestsFilePath = path.join(dataDirectory, "transport-requests.json");
const messagesFilePath = path.join(dataDirectory, "messages.json");
const clientDocumentsFilePath = path.join(dataDirectory, "client-documents.json");

const systemData = {
  total_users: 284,
  completed: 61,
  stuck_state_id: 52,
  stuck_ssn: 28,
  stuck_birth: 20,
  transport_needed: 37
};

const defaultClients = [
  {
    id: "CL-1001",
    name: "Maria Lopez",
    city: "Paterson",
    missing_documents: ["birth_certificate", "state_id"],
    transportation_needed: true,
    status: "active",
    assigned_worker: "WK-01",
    worker_status: "active"
  },
  {
    id: "CL-1002",
    name: "James Carter",
    city: "Passaic",
    missing_documents: ["ssn"],
    transportation_needed: false,
    status: "active",
    assigned_worker: "WK-02",
    worker_status: "active"
  },
  {
    id: "CL-1003",
    name: "Aisha Brown",
    city: "Clifton",
    missing_documents: ["state_id"],
    transportation_needed: true,
    status: "active",
    assigned_worker: "WK-03",
    worker_status: "active"
  },
  {
    id: "CL-1004",
    name: "Luis Rivera",
    city: "Wayne",
    missing_documents: ["birth_certificate", "ssn", "state_id"],
    transportation_needed: true,
    status: "active",
    assigned_worker: "WK-04",
    worker_status: "active"
  },
  {
    id: "CL-1005",
    name: "Nina Patel",
    city: "Totowa",
    missing_documents: ["birth_certificate"],
    transportation_needed: false,
    status: "pending",
    assigned_worker: null,
    worker_status: null
  },
  {
    id: "CL-1006",
    name: "Robert Green",
    city: "Paterson",
    missing_documents: ["ssn", "state_id"],
    transportation_needed: false,
    status: "active",
    assigned_worker: "WK-03",
    worker_status: "active"
  }
];

const defaultWorkerProfiles = {
  "WK-01": {
    title: "Housing Documentation Specialist",
    phone: "(973) 555-0101",
    email: "sarah.ahmed@passaic.example.org",
    office: "Paterson Support Center",
    languages: ["English", "Arabic", "Spanish"],
    specialties: ["State ID", "Birth certificate recovery", "Court-ready document prep"],
    bio: "Sarah helps clients organize missing identity documents and keeps case steps easy to follow.",
    availability: "Mon-Fri, 9:00 AM - 5:00 PM",
    pronouns: "She/Her"
  },
  "WK-02": {
    title: "Benefits and Records Coordinator",
    phone: "(973) 555-0102",
    email: "daniel.kim@passaic.example.org",
    office: "Passaic Family Resource Office",
    languages: ["English", "Korean"],
    specialties: ["SSN replacement", "Agency coordination", "Document follow-ups"],
    bio: "Daniel focuses on benefits paperwork, replacement records, and keeping agency requests moving.",
    availability: "Mon-Fri, 8:30 AM - 4:30 PM",
    pronouns: "He/Him"
  },
  "WK-03": {
    title: "Lead Case Worker",
    phone: "(973) 555-0103",
    email: "priya.shah@passaic.example.org",
    office: "Clifton Community Support Hub",
    languages: ["English", "Hindi", "Gujarati"],
    specialties: ["State ID appointments", "Transportation planning", "Complex case support"],
    bio: "Priya coordinates appointments, transportation, and urgent next steps for clients with multiple barriers.",
    availability: "Mon-Sat, 9:00 AM - 6:00 PM",
    pronouns: "She/Her"
  },
  "WK-04": {
    title: "Client Intake and Outreach Worker",
    phone: "(973) 555-0104",
    email: "marcus.hill@passaic.example.org",
    office: "Wayne Housing Access Desk",
    languages: ["English", "Spanish"],
    specialties: ["New client intake", "Outreach", "Document collection"],
    bio: "Marcus helps new clients get started, collect missing files, and understand the next case milestone.",
    availability: "Mon-Fri, 10:00 AM - 6:00 PM",
    pronouns: "He/Him"
  }
};

function buildDefaultWorker(id, name, activeCases) {
  return {
    id,
    name,
    active_cases: activeCases,
    ...defaultWorkerProfiles[id]
  };
}

const defaultWorkers = [
  buildDefaultWorker("WK-01", "Sarah Ahmed", 1),
  buildDefaultWorker("WK-02", "Daniel Kim", 1),
  buildDefaultWorker("WK-03", "Priya Shah", 2),
  buildDefaultWorker("WK-04", "Marcus Hill", 1)
];

const njBirthOfficeDirectory = {
  paterson: {
    officeName: "Paterson Health Division Vital Records",
    address: "125 Ellison Street, Paterson, NJ 07505",
    detail: "Birth records for Paterson births are handled through the city health division.",
    links: [
      { label: "Office information", url: "https://www.patersonnj.gov/egov/apps/services/index.egov?action=i&fDD=9-9&id=39&path=details" },
      { label: "Order online", url: NJ_BIRTH_ORDER_URL }
    ]
  },
  passaic: {
    officeName: "Passaic Vital Statistics Office",
    address: "330 Passaic Street, Passaic, NJ 07055",
    detail: "Use the city vital statistics page for local certificate instructions.",
    links: [
      { label: "Office information", url: "https://www.cityofpassaic.com/304/Vital-Statistics" },
      { label: "Order online", url: NJ_BIRTH_ORDER_URL }
    ]
  },
  wayne: {
    officeName: "Wayne Township Vital Statistics",
    address: "475 Valley Road, Wayne, NJ 07470",
    detail: "Wayne Township posts vital records steps through its health department page.",
    links: [
      { label: "Office information", url: "https://waynetownship.com/health-home-page/vital-statistics/" },
      { label: "Order online", url: NJ_BIRTH_ORDER_URL }
    ]
  },
  clifton: {
    officeName: "Clifton City Clerk and Registrar",
    address: "900 Clifton Avenue, Clifton, NJ 07013",
    detail: "Clifton birth-record requests are typically coordinated through the city clerk/registrar office.",
    links: [
      { label: "Birth certificate form", url: "https://www.cliftonnj.org/DocumentCenter/View/25457" },
      { label: "Order online", url: NJ_BIRTH_ORDER_URL }
    ]
  },
  totowa: {
    officeName: "Totowa Borough Registrar of Vital Statistics",
    address: "537 Totowa Road, Totowa, NJ 07512",
    detail: "Totowa vital records are coordinated through the borough clerk and registrar.",
    links: [
      { label: "Local registrar notice", url: "https://www.totowanj.org/_files/ugd/3cc0e2_93e480e99ef64c12a239f274607bce29.pdf" },
      { label: "Order online", url: NJ_BIRTH_ORDER_URL }
    ]
  }
};

const njMvcOfficeDirectory = {
  paterson: {
    officeName: "Paterson Licensing Center",
    address: "125 Broadway, Suite 201, Paterson, NJ 07505"
  },
  passaic: {
    officeName: "Paterson Licensing Center",
    address: "125 Broadway, Suite 201, Paterson, NJ 07505"
  },
  clifton: {
    officeName: "Wayne Licensing Center",
    address: "481 Route 46 West, Wayne, NJ 07470"
  },
  wayne: {
    officeName: "Wayne Licensing Center",
    address: "481 Route 46 West, Wayne, NJ 07470"
  },
  totowa: {
    officeName: "Wayne Licensing Center",
    address: "481 Route 46 West, Wayne, NJ 07470"
  },
  default: {
    officeName: "Nearest NJ MVC Licensing Center",
    address: "Use the official MVC locations page to choose the closest office."
  }
};

const defaultNotifications = [
  {
    id: "NT-01",
    message: "Priya Shah assigned to Robert Green",
    worker_id: "WK-03",
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString()
  },
  {
    id: "NT-02",
    message: "County dashboard synced with latest request queue",
    worker_id: "system",
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  }
];

const defaultTransportRequests = [
  {
    id: "TR-01",
    client_id: "CL-1003",
    worker_id: "WK-03",
    message: "Priya Shah requested transportation for Aisha Brown",
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString()
  }
];

const defaultClientAccounts = [];
const defaultClientNotifications = [];

const defaultMessages = [
  {
    id: "MSG-00",
    client_id: "CL-1001",
    worker_id: "WK-01",
    sender: "worker",
    text: "Hi Maria, I can help with your birth certificate and State ID.",
    image_name: null,
    image_data: null,
    image_type: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: "MSG-00B",
    client_id: "CL-1002",
    worker_id: "WK-02",
    sender: "client",
    text: "I still need help with my SSN card.",
    image_name: null,
    image_data: null,
    image_type: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString()
  },
  {
    id: "MSG-01",
    client_id: "CL-1003",
    worker_id: "WK-03",
    sender: "client",
    text: "I need help getting my State ID appointment.",
    image_name: null,
    image_data: null,
    image_type: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    id: "MSG-02",
    client_id: "CL-1003",
    worker_id: "WK-03",
    sender: "worker",
    text: "I can help with that. I am checking MVC options for you.",
    image_name: null,
    image_data: null,
    image_type: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString()
  },
  {
    id: "MSG-03",
    client_id: "CL-1004",
    worker_id: "WK-04",
    sender: "worker",
    text: "Luis, I am reviewing your document list now.",
    image_name: null,
    image_data: null,
    image_type: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  }
];

const defaultClientDocuments = [];

function enrichWorkerProfile(worker) {
  const profileDefaults = defaultWorkerProfiles[worker.id] || {};

  return {
    ...profileDefaults,
    ...worker,
    languages: Array.isArray(worker.languages) && worker.languages.length
      ? worker.languages
      : (profileDefaults.languages || ["English"]),
    specialties: Array.isArray(worker.specialties) && worker.specialties.length
      ? worker.specialties
      : (profileDefaults.specialties || []),
    bio: worker.bio || profileDefaults.bio || "",
    availability: worker.availability || profileDefaults.availability || "Mon-Fri, 9:00 AM - 5:00 PM",
    office: worker.office || profileDefaults.office || "Passaic County Main Office",
    phone: worker.phone || profileDefaults.phone || "",
    email: worker.email || profileDefaults.email || "",
    title: worker.title || profileDefaults.title || "Case Worker",
    pronouns: worker.pronouns || profileDefaults.pronouns || ""
  };
}

function saveClientAccounts(accounts) {
  saveJsonArray(clientAccountsFilePath, accounts, { key: "client-accounts" });
}

function saveCountyState() {
  saveJsonArray(clientsFilePath, clients, { key: "clients" });
  saveJsonArray(workersFilePath, workers, { key: "workers" });
  saveJsonArray(notificationsFilePath, notifications, { key: "notifications" });
  saveJsonArray(transportRequestsFilePath, transportRequests, { key: "transport-requests" });
}

function saveClientNotifications() {
  saveJsonArray(clientNotificationsFilePath, clientNotifications, { key: "client-notifications" });
}

function saveMessages() {
  saveJsonArray(messagesFilePath, messages, { key: "messages" });
}

function saveClientDocuments() {
  saveJsonArray(clientDocumentsFilePath, clientDocuments, { key: "client-documents" });
}

const clients = loadJsonArray(clientsFilePath, defaultClients, { key: "clients" });
const workers = loadJsonArray(workersFilePath, defaultWorkers, { key: "workers" }).map(enrichWorkerProfile);
const notifications = loadJsonArray(notificationsFilePath, defaultNotifications, { key: "notifications" });
const clientNotifications = loadJsonArray(clientNotificationsFilePath, defaultClientNotifications, { key: "client-notifications" });
const transportRequests = loadJsonArray(transportRequestsFilePath, defaultTransportRequests, { key: "transport-requests" });
const clientAccounts = loadJsonArray(clientAccountsFilePath, defaultClientAccounts, { key: "client-accounts" });
const messages = loadJsonArray(messagesFilePath, defaultMessages, { key: "messages" });
const clientDocuments = loadJsonArray(clientDocumentsFilePath, defaultClientDocuments, { key: "client-documents" });
const phoneOtpStore = new Map();
const authSessions = new Map();
let mailTransporter = null;
let smsClient = null;

migrateClientAccounts();
migrateClientNotificationStore();
saveJsonArray(workersFilePath, workers, { key: "workers" });

const runtimeStorage = getRuntimeStorageInfo();
console.log(`Runtime storage mode: ${runtimeStorage.mode}. Writable target: ${runtimeStorage.writableRoot}.`);

function getRecommendedWorker() {
  return workers.reduce((lowest, worker) => (
    worker.active_cases < lowest.active_cases ? worker : lowest
  ), workers[0]);
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isSmtpConfigured() {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_FROM);
}

function isTwilioConfigured() {
  return Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER);
}

function getMailTransporter() {
  if (!isSmtpConfigured()) {
    return null;
  }

  if (!mailTransporter) {
    mailTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
  }

  return mailTransporter;
}

function getSmsClient() {
  if (!isTwilioConfigured()) {
    return null;
  }

  if (!smsClient) {
    smsClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  return smsClient;
}

function getClientNotificationChannel(account) {
  const methods = Array.isArray(account?.authMethods) ? account.authMethods : [];

  if (methods.includes("email") && account?.email) {
    return "email";
  }

  if (methods.includes("phone") && account?.phone) {
    return "sms";
  }

  if (account?.email) {
    return "email";
  }

  if (account?.phone) {
    return "sms";
  }

  return "in_app";
}

function getClientNotificationTarget(account) {
  const channel = getClientNotificationChannel(account);
  if (channel === "email") {
    return account?.email || "";
  }

  if (channel === "sms") {
    return account?.phone || "";
  }

  return "";
}

async function deliverClientNotification(account, notification) {
  const channel = getClientNotificationChannel(account);
  const recipient = getClientNotificationTarget(account);
  const body = `${notification.title}: ${notification.message}`;

  if (channel === "email" && recipient) {
    const transporter = getMailTransporter();

    if (!transporter) {
      console.log(`[notify:email:simulated] ${recipient} <- ${body}`);
      return { channel, recipient, provider: "console-simulated-email", status: "simulated" };
    }

    await transporter.sendMail({
      from: SMTP_FROM,
      to: recipient,
      subject: notification.title,
      text: body
    });

    return { channel, recipient, provider: "smtp", status: "sent" };
  }

  if (channel === "sms" && recipient) {
    const client = getSmsClient();

    if (!client) {
      console.log(`[notify:sms:simulated] ${recipient} <- ${body}`);
      return { channel, recipient, provider: "console-simulated-sms", status: "simulated" };
    }

    await client.messages.create({
      body,
      from: TWILIO_FROM_NUMBER,
      to: recipient
    });

    return { channel, recipient, provider: "twilio", status: "sent" };
  }

  return { channel: "in_app", recipient: "", provider: "in-app", status: "stored" };
}

async function createClientNotification(clientId, payload = {}) {
  const account = clientAccounts.find((item) => item.clientId === clientId);
  if (!account) {
    return null;
  }

  const notification = {
    id: `CNT-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    client_id: clientId,
    title: String(payload.title || "Case update").trim() || "Case update",
    message: String(payload.message || "").trim(),
    category: String(payload.category || "general").trim(),
    read: false,
    timestamp: new Date().toISOString(),
    delivery: {
      channel: getClientNotificationChannel(account),
      recipient: getClientNotificationTarget(account),
      provider: "pending",
      status: "pending"
    }
  };

  clientNotifications.unshift(notification);
  saveClientNotifications();

  try {
    notification.delivery = await deliverClientNotification(account, notification);
  } catch (error) {
    notification.delivery = {
      channel: getClientNotificationChannel(account),
      recipient: getClientNotificationTarget(account),
      provider: "delivery-error",
      status: "failed",
      error: error.message
    };
    console.error(`Client notification delivery failed for ${clientId}.`, error.message);
  }

  saveClientNotifications();
  return notification;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  if (!salt || !hash) {
    return false;
  }

  const nextHash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(nextHash, "hex"), Buffer.from(hash, "hex"));
}

function sanitizeClientAccount(account) {
  return {
    clientId: account.clientId,
    name: account.name,
    phone: account.phone || "",
    email: account.email || "",
    hasCompletedIntake: Boolean(account.hasCompletedIntake),
    documentAnswers: account.documentAnswers || null,
    intakeLocations: account.intakeLocations || null,
    roadmapPlan: account.roadmapPlan || null,
    intakeCompletedAt: account.intakeCompletedAt || null
  };
}

function parseCookies(header = "") {
  return header.split(";").reduce((cookies, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) {
      return cookies;
    }

    cookies[rawKey] = decodeURIComponent(rawValue.join("=") || "");
    return cookies;
  }, {});
}

function appendSetCookie(res, cookieValue) {
  const existing = res.getHeader("Set-Cookie");
  if (!existing) {
    res.setHeader("Set-Cookie", cookieValue);
    return;
  }

  const cookies = Array.isArray(existing) ? existing.concat(cookieValue) : [existing, cookieValue];
  res.setHeader("Set-Cookie", cookies);
}

function createAuthSession(res, account) {
  const sessionId = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + (1000 * 60 * 60 * 24 * 7);

  authSessions.set(sessionId, {
    clientId: account.clientId,
    expiresAt
  });

  appendSetCookie(
    res,
    `auth_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );
}

function clearAuthSession(req, res) {
  const cookies = parseCookies(req.headers.cookie || "");
  if (cookies.auth_session) {
    authSessions.delete(cookies.auth_session);
  }

  appendSetCookie(res, "auth_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
}

function getAuthenticatedAccount(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const sessionId = cookies.auth_session;

  if (!sessionId) {
    return null;
  }

  const session = authSessions.get(sessionId);
  if (!session || session.expiresAt < Date.now()) {
    authSessions.delete(sessionId);
    return null;
  }

  return clientAccounts.find((account) => account.clientId === session.clientId) || null;
}

function findClientAccountByPhone(phone) {
  const normalized = normalizePhone(phone);
  return clientAccounts.find((account) => normalizePhone(account.phone) === normalized) || null;
}

function findClientAccountByEmail(email) {
  const normalized = normalizeEmail(email);
  return clientAccounts.find((account) => normalizeEmail(account.email) === normalized) || null;
}

function ensureClientRecordForAccount(account, requestCaseWorker) {
  let client = clients.find((item) => item.id === account.clientId);

  if (!client) {
    client = {
      id: account.clientId,
      name: account.name,
      city: "Passaic",
      missing_documents: [],
      transportation_needed: false,
      status: requestCaseWorker ? "pending" : "active",
      assigned_worker: null,
      worker_status: null
    };
    clients.unshift(client);
  }
}

function getMissingDocumentsFromAnswers(answers = {}) {
  const missing = [];

  if (answers.hasBirth === false) {
    missing.push("birth_certificate");
  }
  if (answers.hasSSN === false) {
    missing.push("ssn");
  }
  if (answers.hasID === false) {
    missing.push("state_id");
  }

  return missing;
}

function getDocumentLabel(documentType) {
  const labels = {
    passport: "Passport",
    ssn: "Social Security card",
    state_id: "State ID",
    birth_certificate: "Birth certificate"
  };

  return labels[documentType] || "Document";
}

function normalizeLocationValue(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
}

function isNewJerseyLocation(location = {}) {
  return normalizeLocationValue(location.state) === "new jersey";
}

function getBirthCertificateRecommendation(account) {
  const birthLocation = account?.intakeLocations?.birth || {};
  const birthCityKey = normalizeLocationValue(birthLocation.city);
  const cityRecommendation = njBirthOfficeDirectory[birthCityKey] || null;

  if (isNewJerseyLocation(birthLocation)) {
    return {
      documentType: "birth_certificate",
      title: "Get your birth certificate",
      officeName: cityRecommendation?.officeName || `${birthLocation.city || "Local"} Registrar of Vital Statistics`,
      address: cityRecommendation?.address || `${birthLocation.city || "Birth city"}, ${birthLocation.county || "local county"} County, New Jersey`,
      detail: cityRecommendation?.detail || "Use the local registrar if you were born in this municipality, or order online through New Jersey Vital Records.",
      links: cityRecommendation?.links || [
        { label: "Find local registrar", url: NJ_LOCAL_VITAL_RECORDS_URL },
        { label: "Order online", url: NJ_BIRTH_ORDER_URL }
      ]
    };
  }

  return {
    documentType: "birth_certificate",
    title: "Get your birth certificate",
    officeName: birthLocation.city
      ? `${birthLocation.city}, ${birthLocation.state || "birth state"} records office`
      : "Birth records office",
    address: birthLocation.city
      ? `${birthLocation.city}, ${birthLocation.county || ""}${birthLocation.county ? " County, " : ""}${birthLocation.state || ""}`.trim()
      : "Use the records office in the state where you were born.",
    detail: "Birth certificates usually must be requested from the state or city where you were born.",
    links: [
      { label: "Start NJ online order", url: NJ_BIRTH_ORDER_URL }
    ]
  };
}

function getSsnRecommendation(account) {
  const currentLocation = account?.intakeLocations?.current || {};
  const city = currentLocation.city || "your area";
  const stateName = currentLocation.state || "";
  const replacementAvailableOnline = true;

  return {
    documentType: "ssn",
    title: "Request SSN card",
    officeName: `Social Security office near ${city}`,
    address: stateName ? `${city}, ${stateName}` : city,
    detail: replacementAvailableOnline
      ? "Start online if you qualify, or use the official SSA locator to find the office that serves your address."
      : "Use the official SSA locator to find the office that serves your address.",
    links: [
      { label: "Replace card online", url: SSA_CARD_URL },
      { label: "Find local SSA office", url: SSA_OFFICE_LOCATOR_URL }
    ]
  };
}

function getStateIdRecommendation(account) {
  const currentLocation = account?.intakeLocations?.current || {};
  const cityKey = normalizeLocationValue(currentLocation.city);
  const office = njMvcOfficeDirectory[cityKey] || njMvcOfficeDirectory.default;

  if (isNewJerseyLocation(currentLocation)) {
    return {
      documentType: "state_id",
      title: "Finish State ID step",
      officeName: office.officeName,
      address: office.address,
      detail: "New Jersey non-driver IDs are handled through MVC licensing centers and usually require an appointment.",
      links: [
        { label: "Book MVC appointment", url: NJ_MVC_APPOINTMENT_URL },
        { label: "State ID requirements", url: NJ_MVC_ID_URL },
        { label: "View MVC locations", url: NJ_MVC_LOCATIONS_URL }
      ]
    };
  }

  return {
    documentType: "state_id",
    title: "Finish State ID step",
    officeName: `${currentLocation.state || "State"} ID office`,
    address: currentLocation.city
      ? `${currentLocation.city}, ${currentLocation.state || ""}`.trim()
      : "Use your current state's motor vehicle or identification agency.",
    detail: "State ID rules depend on your current state, so use the local motor vehicle agency for the next appointment.",
    links: []
  };
}

function buildClientServiceRecommendations(account, client) {
  const missingDocuments = Array.isArray(client?.missing_documents) ? client.missing_documents : [];
  const recommendations = {};

  if (missingDocuments.includes("birth_certificate")) {
    recommendations.birth_certificate = getBirthCertificateRecommendation(account);
  }

  if (missingDocuments.includes("ssn")) {
    recommendations.ssn = getSsnRecommendation(account);
  }

  if (missingDocuments.includes("state_id")) {
    recommendations.state_id = getStateIdRecommendation(account);
  }

  return recommendations;
}

function saveClientIntake(account, payload = {}) {
  const documentAnswers = {
    hasBirth: Boolean(payload.documentAnswers?.hasBirth),
    hasSSN: Boolean(payload.documentAnswers?.hasSSN),
    hasID: Boolean(payload.documentAnswers?.hasID)
  };
  const intakeLocations = {
    birth: payload.intakeLocations?.birth || null,
    current: payload.intakeLocations?.current || null
  };
  const roadmapPlan = payload.roadmapPlan || null;

  account.hasCompletedIntake = true;
  account.documentAnswers = documentAnswers;
  account.intakeLocations = intakeLocations;
  account.roadmapPlan = roadmapPlan;
  account.intakeCompletedAt = new Date().toISOString();

  const client = clients.find((item) => item.id === account.clientId);
  if (client) {
    client.missing_documents = getMissingDocumentsFromAnswers(documentAnswers);
    client.transportation_needed = documentAnswers.hasID === false;
    client.city = intakeLocations.current?.city || client.city;
  }

  saveClientAccounts(clientAccounts);
  saveCountyState();
}

function migrateClientAccounts() {
  let changed = false;

  clientAccounts.forEach((account, index) => {
    if (account.password && !account.passwordHash) {
      const { salt, hash } = hashPassword(account.password);
      account.passwordSalt = salt;
      account.passwordHash = hash;
      delete account.password;
      changed = true;
    }

    if (!Array.isArray(account.authMethods)) {
      const methods = [];
      if (account.phone) methods.push("phone");
      if (account.email) methods.push("email");
      account.authMethods = methods;
      changed = true;
    }

    if (!account.clientId) {
      account.clientId = `CL-${String(getNextClientIdNumber() + index)}`;
      changed = true;
    }

    if (!("email" in account)) {
      account.email = "";
      changed = true;
    }

    if (!("hasCompletedIntake" in account)) {
      account.hasCompletedIntake = false;
      changed = true;
    }

    if (!("documentAnswers" in account)) {
      account.documentAnswers = null;
      changed = true;
    }

    if (!("intakeLocations" in account)) {
      account.intakeLocations = null;
      changed = true;
    }

    if (!("roadmapPlan" in account)) {
      account.roadmapPlan = null;
      changed = true;
    }

    if (!("intakeCompletedAt" in account)) {
      account.intakeCompletedAt = null;
      changed = true;
    }
  });

  if (changed) {
    saveClientAccounts(clientAccounts);
  }
}

function migrateClientNotificationStore() {
  let changed = false;

  clientNotifications.forEach((notification) => {
    if (!("read" in notification)) {
      notification.read = false;
      changed = true;
    }

    if (!notification.delivery || typeof notification.delivery !== "object") {
      notification.delivery = {
        channel: "in_app",
        recipient: "",
        provider: "in-app",
        status: "stored"
      };
      changed = true;
    }
  });

  if (changed) {
    saveClientNotifications();
  }
}

function addAccountCreationNotification(account, requestCaseWorker) {
  const message = requestCaseWorker
    ? `Client ${account.name} created an account and requested a case worker`
    : `New account created in Passaic County: client ${account.name}`;

  notifications.unshift({
    id: `NT-${Date.now()}`,
    message,
    worker_id: "system",
    timestamp: new Date().toISOString()
  });
}

function markClientNotificationsAsRead(clientId) {
  let changed = false;

  clientNotifications.forEach((notification) => {
    if (notification.client_id === clientId && !notification.read) {
      notification.read = true;
      changed = true;
    }
  });

  if (changed) {
    saveClientNotifications();
  }
}

async function translateWithGoogle(text, targetLang, sourceLang = "en") {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    const error = new Error("Google Translate API key is not configured.");
    error.statusCode = 503;
    throw error;
  }

  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(GOOGLE_TRANSLATE_API_KEY)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: "text"
    })
  });

  if (!response.ok) {
    let details = `Google Translate request failed with status ${response.status}.`;

    try {
      const errorData = await response.json();
      details = errorData?.error?.message || details;
    } catch (error) {
      // Keep the default status-based message when the response body is not JSON.
    }

    const requestError = new Error(details);
    requestError.statusCode = response.status;
    throw requestError;
  }

  const data = await response.json();
  return data?.data?.translations?.[0]?.translatedText || text;
}

function getNextClientIdNumber() {
  const allIds = [
    ...clientAccounts.map((account) => account.clientId),
    ...clients.map((client) => client.id)
  ];

  return allIds.reduce((maxId, rawId) => {
    const numericId = Number.parseInt(String(rawId).replace("CL-", ""), 10);
    return Number.isNaN(numericId) ? maxId : Math.max(maxId, numericId);
  }, 1000) + 1;
}

function createInsightResponse(questionRaw) {
  const question = String(questionRaw || "").toLowerCase();

  if (question.includes("stuck") || question.includes("problem")) {
    return "Most users are stuck at the State ID step. This happens because it needs in-person appointments. You should increase MVC availability and transportation support.";
  }

  if (question.includes("transport")) {
    return `Transportation is affecting ${systemData.transport_needed}% of users. This slows down office visits and document pickup. You should expand ride support and travel vouchers.`;
  }

  if (question.includes("how many") || question.includes("load") || question.includes("workload")) {
    const recommended = getRecommendedWorker();
    return `${systemData.total_users} users are active and ${systemData.completed} are complete. The lightest worker is ${recommended.name} with ${recommended.active_cases} active cases. You should route new clients there first.`;
  }

  if (question.includes("improve") || question.includes("solution")) {
    return "State ID delays are the biggest problem. They happen because of appointment bottlenecks and travel needs. You should add MVC coordination and faster transportation support.";
  }

  return "Most delays are happening at the State ID step. This is driven by appointments and transportation barriers. You should focus on faster scheduling and travel support.";
}

app.get("/api/clients", (_req, res) => {
  res.json({
    clients,
    recommended_worker_id: getRecommendedWorker().id
  });
});

app.get("/api/workers", (_req, res) => {
  res.json({
    workers,
    recommended_worker_id: getRecommendedWorker().id
  });
});

app.get("/api/notifications", (_req, res) => {
  res.json({
    notifications: notifications.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  });
});

app.get("/api/client-notifications", (req, res) => {
  const account = getAuthenticatedAccount(req);

  if (!account) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const items = clientNotifications
    .filter((notification) => notification.client_id === account.clientId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    notifications: items,
    unread_count: items.filter((notification) => !notification.read).length,
    delivery_method: getClientNotificationChannel(account),
    delivery_target: getClientNotificationTarget(account)
  });
});

app.post("/api/client-notifications/read-all", (req, res) => {
  const account = getAuthenticatedAccount(req);

  if (!account) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  markClientNotificationsAsRead(account.clientId);
  res.json({ success: true, unread_count: 0 });
});

app.get("/api/transport-requests", (_req, res) => {
  res.json({
    transport_requests: transportRequests.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  });
});

app.post("/api/auth/signup/phone", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const phone = String(req.body?.phone || "").trim();
  const requestCaseWorker = Boolean(req.body?.request_case_worker);

  if (!name || !phone) {
    res.status(400).json({ error: "Enter your name and phone number." });
    return;
  }

  if (findClientAccountByPhone(phone)) {
    res.status(400).json({ error: "That phone number is already in use." });
    return;
  }

  const account = {
    clientId: `CL-${String(getNextClientIdNumber())}`,
    name,
    phone,
    email: "",
    passwordHash: "",
    passwordSalt: "",
    authMethods: ["phone"],
    hasCompletedIntake: false,
    documentAnswers: null,
    intakeLocations: null,
    roadmapPlan: null,
    intakeCompletedAt: null,
    createdAt: new Date().toISOString()
  };

  clientAccounts.push(account);
  ensureClientRecordForAccount(account, requestCaseWorker);
  addAccountCreationNotification(account, requestCaseWorker);
  saveClientAccounts(clientAccounts);
  saveCountyState();
  await createClientNotification(account.clientId, {
    title: "Notifications are on",
    message: requestCaseWorker
      ? "Your case worker request was sent. Future updates will come here and by text."
      : "Your account is ready. Future updates will come here and by text.",
    category: "account"
  });

  res.json({
    success: true,
    user: sanitizeClientAccount(account)
  });
});

app.post("/api/auth/signup/email", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const password = String(req.body?.password || "").trim();
  const requestCaseWorker = Boolean(req.body?.request_case_worker);

  if (!name || !email || !password) {
    res.status(400).json({ error: "Enter your name, email, and password." });
    return;
  }

  if (findClientAccountByEmail(email)) {
    res.status(400).json({ error: "That email is already in use." });
    return;
  }

  const { salt, hash } = hashPassword(password);
  const account = {
    clientId: `CL-${String(getNextClientIdNumber())}`,
    name,
    phone: "",
    email,
    passwordHash: hash,
    passwordSalt: salt,
    authMethods: ["email"],
    hasCompletedIntake: false,
    documentAnswers: null,
    intakeLocations: null,
    roadmapPlan: null,
    intakeCompletedAt: null,
    createdAt: new Date().toISOString()
  };

  clientAccounts.push(account);
  ensureClientRecordForAccount(account, requestCaseWorker);
  addAccountCreationNotification(account, requestCaseWorker);
  saveClientAccounts(clientAccounts);
  saveCountyState();
  await createClientNotification(account.clientId, {
    title: "Notifications are on",
    message: requestCaseWorker
      ? "Your case worker request was sent. Future updates will come here and by email."
      : "Your account is ready. Future updates will come here and by email.",
    category: "account"
  });

  res.json({
    success: true,
    user: sanitizeClientAccount(account)
  });
});

app.post("/api/auth/login/phone/send-otp", (req, res) => {
  const phone = String(req.body?.phone || "").trim();

  if (!phone) {
    res.status(400).json({ error: "Enter your phone number." });
    return;
  }

  const account = findClientAccountByPhone(phone);
  if (!account) {
    res.status(404).json({ error: "Create account first." });
    return;
  }

  const code = String(Math.floor(1000 + Math.random() * 9000));
  const expiresAt = Date.now() + (1000 * 60 * 5);
  phoneOtpStore.set(normalizePhone(phone), {
    code,
    clientId: account.clientId,
    expiresAt
  });

  console.log(`[auth] OTP for ${phone}: ${code} (expires in 5 minutes)`);

  res.json({ success: true });
});

app.post("/api/auth/login/phone/verify-otp", (req, res) => {
  const phone = String(req.body?.phone || "").trim();
  const otp = String(req.body?.otp || "").trim();
  const normalizedPhone = normalizePhone(phone);
  const otpEntry = phoneOtpStore.get(normalizedPhone);

  if (!otpEntry) {
    res.status(400).json({ error: "Request a new OTP code." });
    return;
  }

  if (otpEntry.expiresAt < Date.now()) {
    phoneOtpStore.delete(normalizedPhone);
    res.status(400).json({ error: "The OTP code expired. Request a new one." });
    return;
  }

  if (otpEntry.code !== otp) {
    res.status(400).json({ error: "The OTP code is incorrect." });
    return;
  }

  const account = clientAccounts.find((item) => item.clientId === otpEntry.clientId);
  if (!account) {
    phoneOtpStore.delete(normalizedPhone);
    res.status(404).json({ error: "Create account first." });
    return;
  }

  phoneOtpStore.delete(normalizedPhone);
  createAuthSession(res, account);

  res.json({
    success: true,
    user: sanitizeClientAccount(account)
  });
});

app.post("/api/auth/login/email", (req, res) => {
  const email = String(req.body?.email || "").trim();
  const password = String(req.body?.password || "").trim();
  const account = findClientAccountByEmail(email);

  if (!account) {
    res.status(404).json({ error: "Create account first." });
    return;
  }

  if (!verifyPassword(password, account.passwordSalt, account.passwordHash)) {
    res.status(401).json({ error: "Wrong password." });
    return;
  }

  createAuthSession(res, account);

  res.json({
    success: true,
    user: sanitizeClientAccount(account)
  });
});

app.post("/api/admin/login", (req, res) => {
  const role = String(req.body?.role || "passaic").trim();
  const email = String(req.body?.email || "").trim();
  const password = String(req.body?.password || "").trim();

  if (!email || !password) {
    res.status(400).json({ success: false, error: "Missing credentials" });
    return;
  }

  const account = verifyAdminLogin(role, email, password);

  if (!account) {
    res.status(401).json({ success: false, error: "Invalid credentials" });
    return;
  }

  res.json({
    success: true,
    role: account.role,
    workerId: account.workerId || null,
    account
  });
});

app.get("/api/admin/demo-accounts", (req, res) => {
  const role = String(req.query.role || "caseworker").trim();

  if (role === "caseworker") {
    res.json({
      role,
      accounts: getDemoCaseworkerAccounts()
    });
    return;
  }

  const account = getDemoAdminAccount(role);
  res.json({
    role,
    accounts: account ? [account] : []
  });
});

app.post("/api/admin/demo-login", (req, res) => {
  const role = String(req.body?.role || "caseworker").trim();
  const workerId = String(req.body?.workerId || "").trim();
  const account = role === "caseworker" && workerId
    ? getDemoCaseworkerAccounts().find((item) => item.workerId === workerId) || null
    : getDemoAdminAccount(role);

  if (!account) {
    res.status(404).json({ success: false, error: "Demo account not found." });
    return;
  }

  res.json({
    success: true,
    role: account.role,
    workerId: account.workerId || null,
    account
  });
});

app.post("/api/auth/logout", (req, res) => {
  clearAuthSession(req, res);
  res.json({ success: true });
});

app.get("/api/auth/me", (req, res) => {
  const account = getAuthenticatedAccount(req);

  if (!account) {
    res.json({ authenticated: false });
    return;
  }

  res.json({
    authenticated: true,
    user: sanitizeClientAccount(account)
  });
});

app.get("/api/client-service-recommendations", (req, res) => {
  const account = getAuthenticatedAccount(req);

  if (!account) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const client = clients.find((item) => item.id === account.clientId);
  if (!client) {
    res.status(404).json({ error: "Client not found." });
    return;
  }

  res.json({
    recommendations: buildClientServiceRecommendations(account, client)
  });
});

app.post("/api/auth/intake", (req, res) => {
  const account = getAuthenticatedAccount(req);

  if (!account) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const documentAnswers = req.body?.documentAnswers || {};
  const intakeLocations = req.body?.intakeLocations || {};
  const roadmapPlan = req.body?.roadmapPlan || null;

  const hasValidAnswers =
    typeof documentAnswers.hasBirth === "boolean" &&
    typeof documentAnswers.hasSSN === "boolean" &&
    typeof documentAnswers.hasID === "boolean";

  const hasValidBirthLocation =
    intakeLocations.birth &&
    intakeLocations.birth.state &&
    intakeLocations.birth.county &&
    intakeLocations.birth.city;

  const hasValidCurrentLocation =
    intakeLocations.current &&
    intakeLocations.current.state &&
    intakeLocations.current.county &&
    intakeLocations.current.city;

  if (!hasValidAnswers || !hasValidBirthLocation || !hasValidCurrentLocation || !roadmapPlan) {
    res.status(400).json({ error: "Complete the intake form before saving." });
    return;
  }

  saveClientIntake(account, { documentAnswers, intakeLocations, roadmapPlan });

  res.json({
    success: true,
    user: sanitizeClientAccount(account)
  });
});

app.get("/api/client-documents", (req, res) => {
  const clientId = String(req.query.client_id || "").trim();

  if (!clientId) {
    res.status(400).json({ error: "client_id is required." });
    return;
  }

  const client = clients.find((item) => item.id === clientId);
  if (!client) {
    res.status(400).json({ error: "Client not found." });
    return;
  }

  res.json({
    documents: clientDocuments
      .filter((document) => document.client_id === clientId)
      .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))
  });
});

app.post("/api/translate", async (req, res) => {
  const text = String(req.body?.text || "").trim();
  const targetLang = String(req.body?.targetLang || "").trim().toLowerCase();
  const sourceLang = String(req.body?.sourceLang || "en").trim().toLowerCase();

  if (!text) {
    res.status(400).json({ error: "Text is required." });
    return;
  }

  if (!targetLang) {
    res.status(400).json({ error: "Target language is required." });
    return;
  }

  try {
    const translatedText = await translateWithGoogle(text, targetLang, sourceLang);
    res.json({ translatedText });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Translation request failed."
    });
  }
});

app.get("/api/worker-notifications", (req, res) => {
  const workerId = String(req.query.worker_id || "").trim();

  if (!workerId) {
    res.status(400).json({ error: "worker_id is required." });
    return;
  }

  const workerClients = clients.filter((client) => client.assigned_worker === workerId);
  const workerClientIds = new Set(workerClients.map((client) => client.id));

  const countyAlerts = notifications
    .filter((item) => item.worker_id === workerId)
    .map((item) => ({
      id: item.id,
      message: item.message,
      source: "county",
      timestamp: item.timestamp
    }));

  const clientAlerts = messages
    .filter((message) => message.sender === "client" && workerClientIds.has(message.client_id) && message.worker_id === workerId)
    .map((message) => {
      const client = clients.find((item) => item.id === message.client_id);
      const detail = message.text || (message.image_name ? `shared ${message.image_name}` : "sent a message");

      return {
        id: message.id,
        message: `${client ? client.name : message.client_id}: ${detail}`,
        source: "client",
        timestamp: message.timestamp
      };
    });

  res.json({
    notifications: [...countyAlerts, ...clientAlerts]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  });
});

app.post("/api/assign", async (req, res) => {
  const { client_id: clientId, worker_id: workerId } = req.body || {};
  const client = clients.find((item) => item.id === clientId);
  const worker = workers.find((item) => item.id === workerId);

  if (!client || !worker) {
    res.status(400).json({ error: "Client or worker not found." });
    return;
  }

  if (client.assigned_worker === workerId && client.worker_status === "pending_approval") {
    res.json({
      success: true,
      client,
      worker,
      recommended_worker_id: getRecommendedWorker().id
    });
    return;
  }

  if (client.assigned_worker && client.assigned_worker !== workerId) {
    const previousWorker = workers.find((item) => item.id === client.assigned_worker);
    if (previousWorker && previousWorker.active_cases > 0) {
      previousWorker.active_cases -= 1;
    }
  }

  client.assigned_worker = workerId;
  client.status = "pending";
  client.worker_status = "pending_approval";
  worker.active_cases += 1;

  notifications.unshift({
    id: `NT-${Date.now()}`,
    message: `${worker.name} assigned to ${client.name}`,
    worker_id: worker.id,
    timestamp: new Date().toISOString()
  });
  saveCountyState();
  await createClientNotification(client.id, {
    title: "Case worker assigned",
    message: `${worker.name} has been assigned to your case.`,
    category: "assignment"
  });

  res.json({
    success: true,
    client,
    worker,
    recommended_worker_id: getRecommendedWorker().id
  });
});

app.post("/api/case-status", async (req, res) => {
  const { client_id: clientId, worker_id: workerId, action } = req.body || {};
  const client = clients.find((item) => item.id === clientId);
  const worker = workers.find((item) => item.id === workerId);

  if (!client || !worker || client.assigned_worker !== workerId) {
    res.status(400).json({ error: "Client or worker not found." });
    return;
  }

  if (action === "accept") {
    client.status = "active";
    client.worker_status = "active";
    notifications.unshift({
      id: `NT-${Date.now()}`,
      message: `${worker.name} accepted ${client.name}`,
      worker_id: worker.id,
      timestamp: new Date().toISOString()
    });
    await createClientNotification(client.id, {
      title: "Case accepted",
      message: `${worker.name} accepted your case and started working on it.`,
      category: "status"
    });
  } else if (action === "complete") {
    client.status = "completed";
    client.worker_status = "completed";
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].client_id === clientId) {
        messages.splice(index, 1);
      }
    }
    saveMessages();
    notifications.unshift({
      id: `NT-${Date.now()}`,
      message: `${worker.name} completed ${client.name}`,
      worker_id: worker.id,
      timestamp: new Date().toISOString()
    });
    await createClientNotification(client.id, {
      title: "Case completed",
      message: `${worker.name} marked your case as completed.`,
      category: "status"
    });
  } else if (action === "reject") {
    client.worker_status = "rejected";
    client.status = "pending";
    client.assigned_worker = null;
    if (worker.active_cases > 0) {
      worker.active_cases -= 1;
    }
    notifications.unshift({
      id: `NT-${Date.now()}`,
      message: `${worker.name} rejected ${client.name}`,
      worker_id: worker.id,
      timestamp: new Date().toISOString()
    });
    await createClientNotification(client.id, {
      title: "Assignment changed",
      message: `${worker.name} declined this case. A new worker can be assigned next.`,
      category: "status"
    });
  } else {
    res.status(400).json({ error: "Invalid action." });
    return;
  }
  saveCountyState();

  res.json({
    success: true,
    client,
    worker,
    recommended_worker_id: getRecommendedWorker().id
  });
});

app.get("/api/messages", (req, res) => {
  const clientId = req.query.client_id;
  const workerId = req.query.worker_id;

  if (!clientId) {
    res.status(400).json({ error: "client_id is required." });
    return;
  }

  const client = clients.find((item) => item.id === clientId);
  const activeWorkerId = workerId || client?.assigned_worker || null;

  res.json({
    messages: messages
      .filter((message) => (
        message.client_id === clientId &&
        (!activeWorkerId || message.worker_id === activeWorkerId)
      ))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  });
});

app.post("/api/messages", async (req, res) => {
  const {
    client_id: clientId,
    worker_id: workerId,
    sender,
    text,
    image_name: imageName,
    image_data: imageData,
    image_type: imageType
  } = req.body || {};

  const client = clients.find((item) => item.id === clientId);

  if (!client) {
    res.status(400).json({ error: "Client not found." });
    return;
  }

  if (client.assigned_worker && workerId && client.assigned_worker !== workerId) {
    res.status(400).json({ error: "Message must match the assigned case worker." });
    return;
  }

  if (client.worker_status === "completed") {
    res.status(400).json({ error: "Case is completed. Chat is closed." });
    return;
  }

  const trimmedText = String(text || "").trim();
  const hasText = Boolean(trimmedText);
  const hasImage = Boolean(String(imageData || "").trim());

  if (!hasText && !hasImage) {
    res.status(400).json({ error: "Message text or image is required." });
    return;
  }

  const message = {
    id: `MSG-${Date.now()}`,
    client_id: clientId,
    worker_id: workerId || client.assigned_worker || null,
    sender: sender === "client" ? "client" : "worker",
    text: trimmedText,
    image_name: hasImage ? String(imageName || "shared-image").trim() || "shared-image" : null,
    image_data: hasImage ? String(imageData).trim() : null,
    image_type: hasImage ? String(imageType || "image/jpeg").trim() : null,
    timestamp: new Date().toISOString()
  };

  messages.push(message);
  saveMessages();
  if (message.sender === "worker") {
    await createClientNotification(clientId, {
      title: "New message",
      message: trimmedText
        ? `${message.text.slice(0, 120)}${message.text.length > 120 ? "..." : ""}`
        : "Your case worker sent an image update.",
      category: "message"
    });
  }

  res.json({
    success: true,
    message
  });
});

app.post("/api/client-documents", async (req, res) => {
  const {
    client_id: clientId,
    worker_id: workerId,
    document_type: documentType,
    file_name: fileName,
    file_data: fileData,
    file_type: fileType,
    uploaded_by: uploadedBy
  } = req.body || {};

  const client = clients.find((item) => item.id === clientId);
  const allowedTypes = new Set(["passport", "ssn", "state_id", "birth_certificate"]);

  if (!client) {
    res.status(400).json({ error: "Client not found." });
    return;
  }

  if (!allowedTypes.has(String(documentType || "").trim())) {
    res.status(400).json({ error: "Invalid document type." });
    return;
  }

  if (!String(fileData || "").trim()) {
    res.status(400).json({ error: "Document image is required." });
    return;
  }

  if (workerId && client.assigned_worker && workerId !== client.assigned_worker) {
    res.status(400).json({ error: "Document must match the assigned case worker." });
    return;
  }

  const documentRecord = {
    id: `DOC-${Date.now()}`,
    client_id: clientId,
    worker_id: workerId || client.assigned_worker || null,
    document_type: String(documentType).trim(),
    file_name: String(fileName || "document-image").trim() || "document-image",
    file_data: String(fileData).trim(),
    file_type: String(fileType || "image/jpeg").trim(),
    uploaded_by: uploadedBy === "client" ? "client" : "worker",
    uploaded_at: new Date().toISOString()
  };

  clientDocuments.unshift(documentRecord);
  saveClientDocuments();
  if (documentRecord.uploaded_by === "worker") {
    await createClientNotification(clientId, {
      title: "New document uploaded",
      message: `${getDocumentLabel(documentRecord.document_type)} was uploaded to your case.`,
      category: "document"
    });
  }

  res.json({
    success: true,
    document: documentRecord
  });
});

app.delete("/api/client-documents/:documentId", (req, res) => {
  const documentId = String(req.params.documentId || "").trim();
  const clientId = String(req.query.client_id || "").trim();

  if (!documentId || !clientId) {
    res.status(400).json({ error: "documentId and client_id are required." });
    return;
  }

  const documentIndex = clientDocuments.findIndex((item) => (
    item.id === documentId && item.client_id === clientId
  ));

  if (documentIndex === -1) {
    res.status(404).json({ error: "Document not found." });
    return;
  }

  const [removedDocument] = clientDocuments.splice(documentIndex, 1);
  saveClientDocuments();

  res.json({
    success: true,
    document: removedDocument
  });
});

app.post("/api/transport-request", async (req, res) => {
  const { client_id: clientId, worker_id: workerId } = req.body || {};
  const client = clients.find((item) => item.id === clientId);
  const worker = workers.find((item) => item.id === workerId);

  if (!client || !worker || client.assigned_worker !== workerId) {
    res.status(400).json({ error: "Client or worker not found." });
    return;
  }

  const request = {
    id: `TR-${Date.now()}`,
    client_id: clientId,
    worker_id: workerId,
    message: `${worker.name} requested transportation for ${client.name}`,
    timestamp: new Date().toISOString()
  };

  transportRequests.unshift(request);
  notifications.unshift({
    id: `NT-${Date.now() + 1}`,
    message: request.message,
    worker_id: worker.id,
    timestamp: request.timestamp
  });
  saveCountyState();
  await createClientNotification(client.id, {
    title: "Transportation requested",
    message: `${worker.name} requested transportation support for your case.`,
    category: "transport"
  });

  res.json({
    success: true,
    transport_request: request
  });
});

app.post("/api/admin-chat", async (req, res) => {
  const { question = "" } = req.body || {};
  const trimmedQuestion = String(question || "").trim();

  if (!trimmedQuestion) {
    res.status(400).json({ success: false, error: "Question is required." });
    return;
  }

  const recommended = getRecommendedWorker();
  const dashboard = {
    totalUsers: systemData.total_users,
    completed: systemData.completed,
    stuckStateId: systemData.stuck_state_id,
    stuckSsn: systemData.stuck_ssn,
    stuckBirth: systemData.stuck_birth,
    transportNeeded: systemData.transport_needed,
    recommendedWorker: recommended
      ? {
          id: recommended.id,
          name: recommended.name,
          activeCases: recommended.active_cases
        }
      : null
  };

  try {
    const response = await generateAdminInsight({
      question: trimmedQuestion,
      systemData,
      dashboard
    });

    res.json({
      success: true,
      provider: "openai",
      response: response || createInsightResponse(trimmedQuestion)
    });
    return;
  } catch (error) {
    console.error("OpenAI admin chat failed. Falling back to local insight response.", error.message);
  }

  res.json({
    success: true,
    provider: "local-fallback",
    response: createInsightResponse(trimmedQuestion)
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Passaic County Housing Coordination System running at http://${HOST}:${PORT}`);
});
