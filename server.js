require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const path = require("path");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const { getDemoAdminAccount, getDemoCaseworkerAccounts, getOrganizationAdminAccounts, loadAdminAccounts, saveAdminAccounts, verifyAdminLogin } = require("./backend/auth/adminAuthStore");
const { generateAdminInsight, generatePortalHelpReply } = require("./backend/services/openaiService");
const { getRuntimeStorageInfo, loadJsonArray, saveJsonArray } = require("./backend/storage/runtimeJsonStore");
const { DOCUMENT_GUIDANCE, MVC_OFFICES, PASSAIC_LOCAL_BIRTH_OFFICES, PRIMARY_RESOURCES, SSA_OFFICES } = require("./data/documentGuidance");

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
const workerCaseHistoryFilePath = path.join(dataDirectory, "worker-case-history.json");
const agenciesFilePath = path.join(dataDirectory, "agencies.json");
const agencyTicketsFilePath = path.join(dataDirectory, "agency-tickets.json");
const COUNTY_ADMIN_ID = "PASSAIC-COUNTY";
const COUNTY_ADMIN_NAME = "Passaic County";
const COUNTY_ORGANIZATION_ID = "ORG-COUNTY";
const COUNTY_ORGANIZATION_NAME = "Passaic County Housing Coordination";

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
    pronouns: "She/Her",
    organization_id: COUNTY_ORGANIZATION_ID,
    organization_name: COUNTY_ORGANIZATION_NAME
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
    pronouns: "He/Him",
    organization_id: "ORG-SHELTER",
    organization_name: "Paterson Shelter Navigation Team"
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
    pronouns: "She/Her",
    organization_id: "ORG-HOSPITAL",
    organization_name: "St. Joseph Hospital Support Team"
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
    pronouns: "He/Him",
    organization_id: "ORG-NONPROFIT",
    organization_name: "Community Document Access Network"
  }
};

const defaultAgencies = [
  {
    id: COUNTY_ORGANIZATION_ID,
    name: COUNTY_ORGANIZATION_NAME,
    type: "county",
    status: "active",
    contact_email: "county@idhelp.org",
    contact_phone: "(973) 555-0199"
  },
  {
    id: "ORG-SHELTER",
    name: "Paterson Shelter Navigation Team",
    type: "shelter",
    status: "active",
    contact_email: "shelter@idhelp.org",
    contact_phone: "(973) 555-0181"
  },
  {
    id: "ORG-HOSPITAL",
    name: "St. Joseph Hospital Support Team",
    type: "hospital",
    status: "active",
    contact_email: "hospital@idhelp.org",
    contact_phone: "(973) 555-0182"
  },
  {
    id: "ORG-NONPROFIT",
    name: "Community Document Access Network",
    type: "nonprofit",
    status: "active",
    contact_email: "community@idhelp.org",
    contact_phone: "(973) 555-0183"
  }
];

const defaultAgencyTickets = [];

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

const defaultWorkerCaseHistory = [];

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
    pronouns: worker.pronouns || profileDefaults.pronouns || "",
    organization_id: worker.organization_id || profileDefaults.organization_id || COUNTY_ORGANIZATION_ID,
    organization_name: worker.organization_name || profileDefaults.organization_name || COUNTY_ORGANIZATION_NAME
  };
}

function saveClientAccounts(accounts) {
  saveJsonArray(clientAccountsFilePath, accounts, { key: "client-accounts" });
}

function getTimestamp() {
  return new Date().toISOString();
}

function getOrganizationIdFromWorker(workerId) {
  const worker = workers.find((item) => item.id === workerId);
  return worker?.organization_id || null;
}

function getClientOrganizationIds(client) {
  return new Set([
    client?.requested_agency_id,
    client?.accepted_agency_id,
    client?.assigned_worker_organization_id,
    getOrganizationIdFromWorker(client?.assigned_worker)
  ].filter(Boolean));
}

function clientBelongsToOrganization(client, organizationId) {
  return !organizationId || getClientOrganizationIds(client).has(organizationId);
}

function pushCountyNotification(message, workerId = "system", timestamp = getTimestamp(), options = {}) {
  const organizationId = options.organization_id || getOrganizationIdFromWorker(workerId) || null;

  notifications.unshift({
    id: `NT-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    message,
    worker_id: workerId,
    organization_id: organizationId,
    timestamp
  });
}

function resolveAgencyRequestStatus(client, requestedAgencyId, wantsCaseWorker) {
  if (!wantsCaseWorker || !requestedAgencyId) {
    return "not_started";
  }

  if (requestedAgencyId === COUNTY_ORGANIZATION_ID) {
    return "accepted";
  }

  if (["accepted", "rejected", "pending_review"].includes(client?.agency_request_status)) {
    return client.agency_request_status;
  }

  return "pending_review";
}

function resolveAcceptedAgencyId(client, requestedAgencyId, agencyRequestStatus, assignedWorker) {
  if (!requestedAgencyId) {
    return assignedWorker?.organization_id || null;
  }

  if (assignedWorker?.organization_id) {
    return assignedWorker.organization_id;
  }

  if (requestedAgencyId === COUNTY_ORGANIZATION_ID) {
    return requestedAgencyId;
  }

  if (agencyRequestStatus === "accepted") {
    return client?.accepted_agency_id || requestedAgencyId;
  }

  return null;
}

function syncClientRelationships(client) {
  if (!client) {
    return null;
  }

  const linkedAccount = clientAccounts.find((account) => account.clientId === client.id) || null;
  const assignedWorker = workers.find((worker) => worker.id === client.assigned_worker) || null;
  const wantsCaseWorker = Boolean(client.case_worker_requested);
  const agencyRequestStatus = resolveAgencyRequestStatus(client, client.requested_agency_id, wantsCaseWorker);
  const acceptedAgencyId = resolveAcceptedAgencyId(client, client.requested_agency_id, agencyRequestStatus, assignedWorker);
  const assignedAgencyId = assignedWorker?.organization_id || acceptedAgencyId || null;
  const assignedAgency = agencies.find((agency) => agency.id === assignedAgencyId) || null;

  client.county_id = COUNTY_ADMIN_ID;
  client.county_name = COUNTY_ADMIN_NAME;
  client.requested_agency_id = client.requested_agency_id || null;
  client.requested_agency_name = client.requested_agency_name || "";
  client.agency_request_status = agencyRequestStatus;
  client.accepted_agency_id = acceptedAgencyId;
  client.accepted_agency_name = acceptedAgencyId ? (assignedAgency?.name || client.accepted_agency_name || "") : "";
  client.linked_account_id = linkedAccount?.clientId || client.linked_account_id || client.id;
  client.account_linked = Boolean(linkedAccount);
  client.account_name = linkedAccount?.name || client.name || "";
  client.assigned_worker_name = assignedWorker?.name || "";
  client.assigned_worker_email = assignedWorker?.email || "";
  client.assigned_worker_organization_id = assignedWorker?.organization_id || null;
  client.assigned_worker_organization_name = assignedWorker?.organization_name || "";
  client.updated_at = client.updated_at || getTimestamp();

  return client;
}

function isClientCompleted(client) {
  return client?.worker_status === "completed" || client?.status === "completed";
}

function getClientQueueState(client) {
  if (isClientCompleted(client)) {
    return "completed";
  }

  if (client?.case_worker_requested && client?.requested_agency_id && client?.agency_request_status === "pending_review") {
    return "awaiting_agency_response";
  }

  if (client?.case_worker_requested && client?.requested_agency_id && client?.agency_request_status === "rejected") {
    return "agency_declined";
  }

  if (client?.assigned_worker && client?.worker_status === "pending_approval") {
    return "awaiting_caseworker_response";
  }

  if (client?.assigned_worker && client?.worker_status === "active") {
    return "assigned_active";
  }

  if (client?.case_worker_requested) {
    return "awaiting_assignment";
  }

  return "working_individually";
}

function syncClientsFromAccounts() {
  clientAccounts.forEach((account) => {
    const existingClient = clients.find((item) => item.id === account.clientId) || null;

    if (!existingClient) {
      ensureClientRecordForAccount(account, Boolean(account.requestedCaseWorker));
      return;
    }

    existingClient.name = account.name || existingClient.name;
    existingClient.linked_account_id = account.clientId;

    if (typeof existingClient.case_worker_requested !== "boolean") {
      existingClient.case_worker_requested = Boolean(account.requestedCaseWorker);
    }

    syncClientRelationships(existingClient);
  });
}

function buildClientView(client) {
  const queueState = getClientQueueState(client);

  return {
    ...client,
    queue_state: queueState,
    case_worker_requested: Boolean(client.case_worker_requested),
    is_completed: queueState === "completed"
  };
}

function buildCompletedCaseRecord(client, worker) {
  return {
    id: `HC-${client.id}-${worker.id}`,
    client_id: client.id,
    client_name: client.name,
    city: client.city || "",
    worker_id: worker.id,
    worker_name: worker.name,
    completed_at: getTimestamp(),
    missing_documents: Array.isArray(client.missing_documents) ? [...client.missing_documents] : [],
    status: "completed"
  };
}

function getCompletedCasesForWorker(workerId) {
  return workerCaseHistory
    .filter((item) => item.worker_id === workerId)
    .slice()
    .sort((left, right) => new Date(right.completed_at) - new Date(left.completed_at));
}

function buildWorkerView(worker) {
  const completedCases = getCompletedCasesForWorker(worker.id);

  return {
    ...worker,
    completed_cases: completedCases,
    completed_cases_count: completedCases.length,
    handled_cases_count: worker.active_cases + completedCases.length,
    organization_id: worker.organization_id || COUNTY_ORGANIZATION_ID,
    organization_name: worker.organization_name || COUNTY_ORGANIZATION_NAME
  };
}

function buildAgencyView(agency) {
  return {
    ...agency,
    worker_count: workers.filter((worker) => worker.organization_id === agency.id).length,
    active_case_count: clients.filter((client) => (
      client.assigned_worker &&
      client.assigned_worker_organization_id === agency.id &&
      client.worker_status === "active"
    )).length
  };
}

function normalizeTicketPriority(priority) {
  const numericPriority = Number(priority);
  if ([1, 2, 3].includes(numericPriority)) {
    return numericPriority;
  }

  return 2;
}

function getTicketPriorityLabel(priority) {
  if (priority === 1) return "High";
  if (priority === 3) return "Low";
  return "Medium";
}

function getTicketAgeDays(ticket, nowMs = Date.now()) {
  const createdMs = new Date(ticket.created_at || ticket.updated_at || nowMs).getTime();
  if (Number.isNaN(createdMs)) {
    return 0;
  }

  return Math.max(0, Math.floor((nowMs - createdMs) / (1000 * 60 * 60 * 24)));
}

function getTicketSortScore(ticket, nowMs = Date.now()) {
  const priority = normalizeTicketPriority(ticket.priority);
  const ageDays = getTicketAgeDays(ticket, nowMs);
  const isOpen = ticket.status !== "closed";
  const isOverdue = isOpen && ageDays >= 2;

  return {
    effective_priority: isOverdue ? 0 : priority,
    age_days: ageDays,
    escalated_by_age: isOverdue,
    priority_label: getTicketPriorityLabel(priority)
  };
}

function buildTicketView(ticket) {
  const agency = agencies.find((item) => item.id === ticket.organization_id) || null;
  const score = getTicketSortScore(ticket);

  return {
    ...ticket,
    organization_name: ticket.organization_name || agency?.name || "Organization",
    ...score,
    messages: Array.isArray(ticket.messages) ? ticket.messages : []
  };
}

function sortTicketViews(tickets) {
  return tickets
    .map(buildTicketView)
    .sort((left, right) => {
      if (left.status !== right.status) {
        if (left.status === "closed") return 1;
        if (right.status === "closed") return -1;
      }

      if (left.effective_priority !== right.effective_priority) {
        return left.effective_priority - right.effective_priority;
      }

      if (left.escalated_by_age !== right.escalated_by_age) {
        return left.escalated_by_age ? -1 : 1;
      }

      const leftDate = new Date(left.last_message_at || left.updated_at || left.created_at).getTime();
      const rightDate = new Date(right.last_message_at || right.updated_at || right.created_at).getTime();
      return (Number.isNaN(rightDate) ? 0 : rightDate) - (Number.isNaN(leftDate) ? 0 : leftDate);
    });
}

function createTicketMessage({ sender, senderRole, text }) {
  return {
    id: `TM-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    sender,
    sender_role: senderRole,
    text,
    timestamp: getTimestamp()
  };
}

function recordCompletedWorkerCase(client, worker) {
  if (!client || !worker) {
    return;
  }

  const recordId = `HC-${client.id}-${worker.id}`;
  const existingIndex = workerCaseHistory.findIndex((item) => item.id === recordId);
  const nextRecord = buildCompletedCaseRecord(client, worker);

  if (existingIndex >= 0) {
    workerCaseHistory[existingIndex] = nextRecord;
    return;
  }

  workerCaseHistory.unshift(nextRecord);
}

function touchClientRelationship(client, actor) {
  if (!client) {
    return;
  }

  client.last_updated_by = actor;
  client.updated_at = getTimestamp();
  syncClientRelationships(client);
}

function syncAllClientRelationships() {
  clients.forEach((client) => {
    syncClientRelationships(client);
  });
}

function saveCountyState() {
  syncClientsFromAccounts();
  syncAllClientRelationships();
  syncWorkerActiveCaseCounts();
  saveJsonArray(clientsFilePath, clients, { key: "clients" });
  saveJsonArray(workersFilePath, workers, { key: "workers" });
  saveJsonArray(agenciesFilePath, agencies, { key: "agencies" });
  saveJsonArray(notificationsFilePath, notifications, { key: "notifications" });
  saveJsonArray(transportRequestsFilePath, transportRequests, { key: "transport-requests" });
  saveJsonArray(workerCaseHistoryFilePath, workerCaseHistory, { key: "worker-case-history" });
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

function saveAgencyTickets() {
  saveJsonArray(agencyTicketsFilePath, agencyTickets, { key: "agency-tickets" });
}

function removeItemsInPlace(items, predicate) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (predicate(items[index], index)) {
      items.splice(index, 1);
    }
  }
}

const clients = loadJsonArray(clientsFilePath, defaultClients, { key: "clients" });
const agencies = loadJsonArray(agenciesFilePath, defaultAgencies, { key: "agencies" });
const workers = loadJsonArray(workersFilePath, defaultWorkers, { key: "workers" }).map(enrichWorkerProfile);
const notifications = loadJsonArray(notificationsFilePath, defaultNotifications, { key: "notifications" });
const clientNotifications = loadJsonArray(clientNotificationsFilePath, defaultClientNotifications, { key: "client-notifications" });
const transportRequests = loadJsonArray(transportRequestsFilePath, defaultTransportRequests, { key: "transport-requests" });
const workerCaseHistory = loadJsonArray(workerCaseHistoryFilePath, defaultWorkerCaseHistory, { key: "worker-case-history" });
const clientAccounts = loadJsonArray(clientAccountsFilePath, defaultClientAccounts, { key: "client-accounts" });
const messages = loadJsonArray(messagesFilePath, defaultMessages, { key: "messages" });
const clientDocuments = loadJsonArray(clientDocumentsFilePath, defaultClientDocuments, { key: "client-documents" });
const agencyTickets = loadJsonArray(agencyTicketsFilePath, defaultAgencyTickets, { key: "agency-tickets" });
const phoneOtpStore = new Map();
const authSessions = new Map();
let mailTransporter = null;
let smsClient = null;

function syncWorkerActiveCaseCounts() {
  workers.forEach((worker) => {
    worker.active_cases = clients.filter((client) => (
      client.assigned_worker === worker.id && client.worker_status === "active"
    )).length;
  });
}

migrateClientAccounts();
migrateClientNotificationStore();
migrateClientStore();
syncAllClientRelationships();
syncWorkerActiveCaseCounts();
saveCountyState();

const runtimeStorage = getRuntimeStorageInfo();
console.log(`Runtime storage mode: ${runtimeStorage.mode}. Writable target: ${runtimeStorage.writableRoot}.`);

function getRecommendedWorker() {
  syncWorkerActiveCaseCounts();
  return workers.reduce((lowest, worker) => (
    worker.active_cases < lowest.active_cases ? worker : lowest
  ), workers[0]);
}

function getNextWorkerIdNumber() {
  return workers.reduce((maxId, worker) => {
    const numericId = Number.parseInt(String(worker.id || "").replace("WK-", ""), 10);
    return Number.isNaN(numericId) ? maxId : Math.max(maxId, numericId);
  }, 0) + 1;
}

function formatWorkerId(value) {
  const raw = String(value || "").trim().toUpperCase();
  if (!raw) {
    return `WK-${String(getNextWorkerIdNumber()).padStart(2, "0")}`;
  }

  return raw.startsWith("WK-") ? raw : `WK-${raw}`;
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
    requestedCaseWorker: Boolean(account.requestedCaseWorker),
    requestedAgencyId: account.requestedAgencyId || null,
    requestedAgencyName: account.requestedAgencyName || "",
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

function getSessionSigningSecret() {
  return process.env.SESSION_SECRET || process.env.OPENAI_API_KEY || "passaic-session-secret";
}

function base64UrlEncode(value) {
  return Buffer.from(String(value))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const normalized = String(value || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding ? normalized + "=".repeat(4 - padding) : normalized;
  return Buffer.from(padded, "base64").toString("utf8");
}

function signSessionPayload(payload) {
  return crypto
    .createHmac("sha256", getSessionSigningSecret())
    .update(payload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createSignedSessionToken(account, expiresAt) {
  const payload = base64UrlEncode(JSON.stringify({
    clientId: account.clientId,
    expiresAt
  }));
  const signature = signSessionPayload(payload);
  return `${payload}.${signature}`;
}

function readSignedSessionToken(sessionToken) {
  const [payload = "", signature = ""] = String(sessionToken || "").split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (providedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(payload));
    if (!parsed?.clientId || !parsed?.expiresAt || parsed.expiresAt < Date.now()) {
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
}

function createAuthSession(res, account) {
  const expiresAt = Date.now() + (1000 * 60 * 60 * 24 * 7);
  const sessionId = createSignedSessionToken(account, expiresAt);

  authSessions.set(sessionId, {
    clientId: account.clientId,
    expiresAt
  });

  appendSetCookie(
    res,
    `auth_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );

  return sessionId;
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
  const headerSessionId = String(req.headers["x-session-id"] || "").trim();
  const sessionId = headerSessionId || cookies.auth_session;

  if (!sessionId) {
    return null;
  }

  const signedSession = readSignedSessionToken(sessionId);
  if (signedSession) {
    return clientAccounts.find((account) => account.clientId === signedSession.clientId) || null;
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
  const wantsCaseWorker = Boolean(requestCaseWorker ?? account?.requestedCaseWorker);
  const requestedAgencyId = account?.requestedAgencyId || null;
  const requestedAgency = agencies.find((agency) => agency.id === requestedAgencyId) || null;
  const isCountyRequest = requestedAgencyId === COUNTY_ORGANIZATION_ID;

  if (!client) {
    client = {
      id: account.clientId,
      name: account.name,
      city: "Passaic",
      missing_documents: [],
      transportation_needed: false,
      status: wantsCaseWorker ? "pending" : "active",
      assigned_worker: null,
      worker_status: null,
      created_at: getTimestamp(),
      case_worker_requested: wantsCaseWorker,
      requested_agency_id: requestedAgencyId,
      requested_agency_name: requestedAgency?.name || "",
      agency_request_status: wantsCaseWorker && requestedAgencyId ? (isCountyRequest ? "accepted" : "pending_review") : "not_started",
      accepted_agency_id: isCountyRequest ? requestedAgencyId : null,
      accepted_agency_name: isCountyRequest ? (requestedAgency?.name || "") : "",
      assigned_worker_organization_id: null,
      assigned_worker_organization_name: ""
    };
    clients.unshift(client);
  }

  client.name = account.name || client.name;
  client.linked_account_id = account.clientId;
  client.case_worker_requested = wantsCaseWorker;
  client.requested_agency_id = requestedAgencyId;
  client.requested_agency_name = requestedAgency?.name || "";
  client.agency_request_status = resolveAgencyRequestStatus(client, requestedAgencyId, wantsCaseWorker);
  client.accepted_agency_id = resolveAcceptedAgencyId(
    client,
    requestedAgencyId,
    client.agency_request_status,
    workers.find((worker) => worker.id === client.assigned_worker) || null
  );
  client.accepted_agency_name = client.accepted_agency_id
    ? (agencies.find((agency) => agency.id === client.accepted_agency_id)?.name || client.accepted_agency_name || "")
    : "";
  touchClientRelationship(client, wantsCaseWorker ? "client_signup_request" : "client_signup");
}

function removeClientFromSystem(clientId) {
  removeItemsInPlace(clients, (item) => item.id === clientId);
  removeItemsInPlace(clientAccounts, (item) => item.clientId === clientId);
  removeItemsInPlace(clientNotifications, (item) => item.client_id === clientId);
  removeItemsInPlace(messages, (item) => item.client_id === clientId);
  removeItemsInPlace(clientDocuments, (item) => item.client_id === clientId);
  removeItemsInPlace(transportRequests, (item) => item.client_id === clientId);

  for (const [sessionId, session] of authSessions.entries()) {
    if (session?.clientId === clientId) {
      authSessions.delete(sessionId);
    }
  }

  syncWorkerActiveCaseCounts();
  saveClientAccounts(clientAccounts);
  saveClientNotifications();
  saveMessages();
  saveClientDocuments();
  saveCountyState();
}

function markClientCaseCompleted(client, worker) {
  if (!client || !worker) {
    return;
  }

  client.status = "completed";
  client.worker_status = "completed";
  client.case_worker_requested = true;
  client.completed_at = getTimestamp();
  client.completed_by_worker_id = worker.id;
  client.completed_by_worker_name = worker.name;
  touchClientRelationship(client, "caseworker_complete");
  syncWorkerActiveCaseCounts();
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

function createGuideLinkItems(items = []) {
  return items
    .filter(Boolean)
    .map((item) => ({
      label: item.label || "",
      detail: item.detail || "",
      phone: item.phone || "",
      url: item.url || ""
    }));
}

function createOfficeOption(option = {}, overrides = {}) {
  return {
    label: overrides.label || option.label || "",
    address: overrides.address || option.address || "",
    phone: overrides.phone || option.phone || "",
    note: overrides.note || option.note || ""
  };
}

function buildRecommendationPayload(documentType, extras = {}) {
  const guide = DOCUMENT_GUIDANCE[documentType] || {};

  return {
    documentType,
    title: extras.title || guide.title || "Document step",
    summary: extras.summary || guide.summary || "",
    officeName: extras.primaryOption?.label || "",
    address: extras.primaryOption?.address || "",
    detail: extras.detail || guide.summary || "",
    applicationSteps: Array.isArray(guide.applicationSteps) ? guide.applicationSteps : [],
    timeline: guide.timeline || "",
    appointment: guide.appointment || { required: false, note: "" },
    requiredItems: Array.isArray(guide.requiredItems) ? guide.requiredItems : [],
    alternateProof: Array.isArray(guide.alternateProof) ? guide.alternateProof : [],
    feeWaiver: guide.feeWaiver || "",
    supportNote: guide.supportNote || "",
    primaryOption: extras.primaryOption || null,
    alternateOptions: Array.isArray(extras.alternateOptions) ? extras.alternateOptions : [],
    supportResources: Array.isArray(extras.supportResources) ? extras.supportResources : [],
    links: Array.isArray(extras.links) ? extras.links : []
  };
}

function getBirthCertificateRecommendation(account) {
  const birthLocation = account?.intakeLocations?.birth || {};
  const birthCityKey = normalizeLocationValue(birthLocation.city);
  const localOffice = PASSAIC_LOCAL_BIRTH_OFFICES[birthCityKey] || null;

  if (isNewJerseyLocation(birthLocation)) {
    const primaryOption = createOfficeOption({
      label: "New Jersey State Walk-In Vital Records Office",
      address: "140 E. Front Street, Trenton, NJ",
      phone: "1-866-649-8726",
      note: "Best default option for most New Jersey births. It handles records for births anywhere in New Jersey and often supports same-day service without an appointment."
    });

    const alternateOptions = [
      localOffice ? createOfficeOption(localOffice) : null,
      createOfficeOption({
        label: "VitalChek online order",
        address: "Online ordering",
        phone: "1-888-434-2587",
        note: "Use this if mailing or online ordering is easier than travel."
      })
    ].filter(Boolean);

    return buildRecommendationPayload("birth_certificate", {
      title: "Get your birth certificate",
      detail: "Start with your birth certificate first. For most New Jersey births, the Trenton state office is the strongest default option.",
      primaryOption,
      alternateOptions,
      supportResources: createGuideLinkItems([
        PRIMARY_RESOURCES.helpline211,
        PRIMARY_RESOURCES.njVitalRecords
      ]),
      links: createGuideLinkItems([
        PRIMARY_RESOURCES.njVitalRecords,
        PRIMARY_RESOURCES.vitalChek
      ])
    });
  }

  return buildRecommendationPayload("birth_certificate", {
    title: "Get your birth certificate",
    detail: "Birth certificates usually must be requested from the state or city where you were born. Start with that state's vital records office.",
    primaryOption: createOfficeOption({
      label: birthLocation.city
        ? `${birthLocation.city}, ${birthLocation.state || "birth state"} records office`
        : "Birth records office",
      address: birthLocation.city
        ? `${birthLocation.city}, ${birthLocation.county || ""}${birthLocation.county ? " County, " : ""}${birthLocation.state || ""}`.trim()
        : "Use the records office in the state where you were born.",
      phone: "",
      note: "If you were not born in New Jersey, start with the official vital records office in your birth state."
    }),
    alternateOptions: [
      createOfficeOption({
        label: "VitalChek online order",
        address: "Online ordering",
        phone: "1-888-434-2587",
        note: "Helpful for many states when you need a mailed request option."
      })
    ],
    supportResources: createGuideLinkItems([
      PRIMARY_RESOURCES.helpline211
    ]),
    links: createGuideLinkItems([
      PRIMARY_RESOURCES.vitalChek
    ])
  });
}

function getSsnRecommendation(account) {
  const currentLocation = account?.intakeLocations?.current || {};
  const cityKey = normalizeLocationValue(currentLocation.city);
  const preferredOffice = SSA_OFFICES[cityKey] || SSA_OFFICES.passaic_default;

  return buildRecommendationPayload("ssn", {
    title: "Request your Social Security card",
    detail: "After your birth certificate, use SSA to request or replace your Social Security card. Start online if you can, then visit the office if SSA asks you to.",
    primaryOption: createOfficeOption(preferredOffice),
    alternateOptions: [
      createOfficeOption(SSA_OFFICES.clifton),
      createOfficeOption({
        label: "SSA online replacement flow",
        address: "Online service",
        phone: "1-800-772-1213",
        note: "Useful if you qualify to start the card replacement online before visiting an office."
      })
    ],
    supportResources: createGuideLinkItems([
      PRIMARY_RESOURCES.helpline211,
      PRIMARY_RESOURCES.ssaMain
    ]),
    links: createGuideLinkItems([
      PRIMARY_RESOURCES.ssaMain,
      PRIMARY_RESOURCES.ssaLocator
    ])
  });
}

function getStateIdRecommendation(account) {
  const currentLocation = account?.intakeLocations?.current || {};
  const cityKey = normalizeLocationValue(currentLocation.city);
  const office = cityKey === "paterson" || cityKey === "passaic"
    ? MVC_OFFICES.paterson
    : (cityKey === "wayne" || cityKey === "clifton" || cityKey === "totowa"
        ? MVC_OFFICES.wayne
        : MVC_OFFICES.oakland);

  if (isNewJerseyLocation(currentLocation)) {
    return buildRecommendationPayload("state_id", {
      title: "Finish your State ID step",
      detail: "New Jersey non-driver IDs usually require an MVC appointment. Bring your birth certificate and supporting identity information before you go.",
      primaryOption: createOfficeOption(office),
      alternateOptions: [
        createOfficeOption(MVC_OFFICES.paterson),
        createOfficeOption(MVC_OFFICES.wayne),
        createOfficeOption(MVC_OFFICES.oakland)
      ].filter((item, index, items) => item.label && items.findIndex((entry) => entry.label === item.label) === index),
      supportResources: createGuideLinkItems([
        PRIMARY_RESOURCES.helpline211,
        PRIMARY_RESOURCES.njMvc
      ]),
      links: createGuideLinkItems([
        PRIMARY_RESOURCES.njMvcAppointment,
        PRIMARY_RESOURCES.njMvc
      ])
    });
  }

  return buildRecommendationPayload("state_id", {
    title: "Finish your State ID step",
    detail: "State ID rules depend on your current state, so use your local motor vehicle or identification agency for the next appointment.",
    primaryOption: createOfficeOption({
      label: `${currentLocation.state || "State"} ID office`,
      address: currentLocation.city
        ? `${currentLocation.city}, ${currentLocation.state || ""}`.trim()
        : "Use your current state's motor vehicle or identification agency.",
      phone: "",
      note: "Look for your state's official non-driver ID or identification card process."
    }),
    alternateOptions: [],
    supportResources: createGuideLinkItems([
      PRIMARY_RESOURCES.helpline211
    ]),
    links: []
  });
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
    touchClientRelationship(client, "client_intake");
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

    if (!("requestedCaseWorker" in account)) {
      account.requestedCaseWorker = false;
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

function migrateClientStore() {
  let changed = false;

  clients.forEach((client) => {
    const snapshot = JSON.stringify(client);

    if (!client.created_at) {
      client.created_at = getTimestamp();
    }

    if (!client.linked_account_id) {
      client.linked_account_id = client.id;
    }

    if (!("case_worker_requested" in client)) {
      client.case_worker_requested = client.status === "pending" && !client.assigned_worker;
    }

    syncClientRelationships(client);

    if (JSON.stringify(client) !== snapshot) {
      changed = true;
    }
  });

  if (changed) {
    saveCountyState();
  }
}

function addAccountCreationNotification(account, requestCaseWorker) {
  const organizationLabel = account.requestedAgencyName
    ? ` Organization selected: ${account.requestedAgencyName}.`
    : "";
  const message = `New portal account: ${account.name}. Case worker requested: ${requestCaseWorker ? "Yes" : "No"}.${organizationLabel}`;

  pushCountyNotification(message, "system", getTimestamp(), {
    organization_id: account.requestedAgencyId || null
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

function createPortalHelpFallback(questionRaw, language = "en") {
  const question = String(questionRaw || "").toLowerCase();
  const isSpanish = language === "es";

  if (question.includes("login") || question.includes("sign") || question.includes("code") || question.includes("otp")) {
    return isSpanish
      ? "Puedo ayudar con el acceso al portal. Si usa telefono, primero solicite el codigo y luego ingreselo para entrar. Si su pregunta es sobre su caso, escriba a su trabajador social."
      : "I can help with portal login. If you use phone login, request the code first and then enter it to sign in. For questions about your case, message your case worker.";
  }

  if (question.includes("birth") || question.includes("acta") || question.includes("ssn") || question.includes("social") || question.includes("id") || question.includes("mvc") || question.includes("dmv")) {
    return isSpanish
      ? "Puedo explicar los pasos generales para documentos y donde encontrar los enlaces oficiales del portal. Para saber que falta en su caso, use el chat con su trabajador social."
      : "I can explain general document steps and point you to the portal's official links. If you need to know what is missing in your case, use the case worker chat.";
  }

  if (question.includes("transport") || question.includes("ride") || question.includes("bus")) {
    return isSpanish
      ? "Puedo ayudar con preguntas generales sobre transporte. Si necesita apoyo para una cita concreta, hable con su trabajador social para que envie la solicitud correcta."
      : "I can help with general transportation questions. If you need help for a specific appointment, ask your case worker so they can send the right request.";
  }

  return isSpanish
    ? "Soy Ayuda del Portal. Puedo ayudar con acceso, documentos, transporte, notificaciones y pasos del portal. Para preguntas o cambios sobre su caso, use el chat con su trabajador social."
    : "I'm Portal Help. I can help with login, documents, transportation, notifications, and portal steps. For questions or changes about your case, use the case worker chat.";
}

function normalizeOrganizationFilter(req) {
  return String(req.query.organization_id || "").trim();
}

function getRecommendedWorkerForOrganization(organizationId) {
  syncWorkerActiveCaseCounts();
  const eligibleWorkers = organizationId
    ? workers.filter((worker) => worker.organization_id === organizationId)
    : workers;

  if (!eligibleWorkers.length) {
    return null;
  }

  return eligibleWorkers.reduce((lowest, worker) => (
    worker.active_cases < lowest.active_cases ? worker : lowest
  ), eligibleWorkers[0]);
}

function notificationBelongsToOrganization(notification, organizationId) {
  if (!organizationId) {
    return true;
  }

  if (notification.organization_id === organizationId) {
    return true;
  }

  const workerOrganizationId = getOrganizationIdFromWorker(notification.worker_id);
  if (workerOrganizationId === organizationId) {
    return true;
  }

  const organization = agencies.find((agency) => agency.id === organizationId) || null;
  if (
    notification.message &&
    notification.message.includes("Organization selected:") &&
    organization?.name &&
    !notification.message.includes(organization.name)
  ) {
    return false;
  }

  const matchingClient = clients.find((client) => (
    notification.message &&
    (notification.message.includes(client.name) || notification.message.includes(client.id))
  ));

  return matchingClient ? clientBelongsToOrganization(matchingClient, organizationId) : false;
}

function transportRequestBelongsToOrganization(request, organizationId) {
  if (!organizationId) {
    return true;
  }

  const workerOrganizationId = getOrganizationIdFromWorker(request.worker_id);
  if (workerOrganizationId === organizationId) {
    return true;
  }

  const client = clients.find((item) => item.id === request.client_id);
  return clientBelongsToOrganization(client, organizationId);
}

app.get("/api/clients", (req, res) => {
  const organizationId = normalizeOrganizationFilter(req);
  syncClientsFromAccounts();
  syncAllClientRelationships();
  syncWorkerActiveCaseCounts();
  const visibleClients = organizationId
    ? clients.filter((client) => clientBelongsToOrganization(client, organizationId))
    : clients;
  const recommendedWorker = getRecommendedWorkerForOrganization(organizationId) || getRecommendedWorker();

  res.json({
    clients: visibleClients.map(buildClientView),
    recommended_worker_id: recommendedWorker?.id || null
  });
});

app.get("/api/workers", (req, res) => {
  const organizationId = normalizeOrganizationFilter(req);
  syncClientsFromAccounts();
  syncWorkerActiveCaseCounts();
  const visibleWorkers = organizationId
    ? workers.filter((worker) => worker.organization_id === organizationId)
    : workers;
  const recommendedWorker = getRecommendedWorkerForOrganization(organizationId);

  res.json({
    workers: visibleWorkers.map(buildWorkerView),
    recommended_worker_id: recommendedWorker?.id || getRecommendedWorker().id
  });
});

app.get("/api/agencies", (req, res) => {
  const organizationId = normalizeOrganizationFilter(req);
  syncClientsFromAccounts();
  const visibleAgencies = organizationId
    ? agencies.filter((agency) => agency.id === organizationId)
    : agencies;

  res.json({
    agencies: visibleAgencies.map(buildAgencyView)
  });
});

app.get("/api/notifications", (req, res) => {
  const organizationId = normalizeOrganizationFilter(req);
  res.json({
    notifications: notifications
      .filter((notification) => notificationBelongsToOrganization(notification, organizationId))
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
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

app.get("/api/transport-requests", (req, res) => {
  const organizationId = normalizeOrganizationFilter(req);
  res.json({
    transport_requests: transportRequests
      .filter((request) => transportRequestBelongsToOrganization(request, organizationId))
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  });
});

app.get("/api/agency-tickets", (req, res) => {
  const organizationId = normalizeOrganizationFilter(req);
  const includeClosed = String(req.query.include_closed || "").trim() === "true";
  const visibleTickets = organizationId
    ? agencyTickets.filter((ticket) => ticket.organization_id === organizationId)
    : agencyTickets;
  const tickets = sortTicketViews(
    includeClosed
      ? visibleTickets
      : visibleTickets.filter((ticket) => ticket.status !== "closed")
  );

  res.json({
    tickets,
    open_count: tickets.filter((ticket) => ticket.status !== "closed").length,
    urgent_count: tickets.filter((ticket) => ticket.status !== "closed" && ticket.effective_priority <= 1).length
  });
});

app.post("/api/agency-tickets", (req, res) => {
  const organizationId = String(req.body?.organization_id || "").trim();
  const subject = String(req.body?.subject || "").trim();
  const messageText = String(req.body?.message || "").trim();
  const senderRole = String(req.body?.sender_role || "organization").trim() === "county" ? "county" : "organization";
  const priority = normalizeTicketPriority(req.body?.priority);
  const agency = agencies.find((item) => item.id === organizationId) || null;

  if (!agency) {
    res.status(400).json({ error: "Select a valid organization." });
    return;
  }

  if (!subject || !messageText) {
    res.status(400).json({ error: "Subject and message are required." });
    return;
  }

  if (subject.length > 120 || messageText.length > 1200) {
    res.status(400).json({ error: "Ticket subject or message is too long." });
    return;
  }

  const timestamp = getTimestamp();
  const ticket = {
    id: `TK-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    organization_id: agency.id,
    organization_name: agency.name,
    subject,
    priority,
    status: "open",
    created_by: senderRole,
    created_at: timestamp,
    updated_at: timestamp,
    last_message_at: timestamp,
    messages: [
      createTicketMessage({
        sender: senderRole === "county" ? COUNTY_ADMIN_NAME : agency.name,
        senderRole,
        text: messageText
      })
    ]
  };

  agencyTickets.unshift(ticket);
  saveAgencyTickets();

  if (senderRole === "organization") {
    pushCountyNotification(`${agency.name} opened a county support ticket: ${subject}`, "system", timestamp, {
      organization_id: agency.id
    });
    saveCountyState();
  }

  res.json({ success: true, ticket: buildTicketView(ticket) });
});

app.post("/api/agency-tickets/:ticketId/messages", (req, res) => {
  const ticketId = String(req.params.ticketId || "").trim();
  const messageText = String(req.body?.message || "").trim();
  const senderRole = String(req.body?.sender_role || "").trim() === "county" ? "county" : "organization";
  const ticket = agencyTickets.find((item) => item.id === ticketId) || null;

  if (!ticket) {
    res.status(404).json({ error: "Ticket not found." });
    return;
  }

  if (!messageText) {
    res.status(400).json({ error: "Message is required." });
    return;
  }

  if (messageText.length > 1200) {
    res.status(400).json({ error: "Message is too long." });
    return;
  }

  if (ticket.status === "closed") {
    res.status(400).json({ error: "This ticket is closed." });
    return;
  }

  const timestamp = getTimestamp();
  const sender = senderRole === "county"
    ? COUNTY_ADMIN_NAME
    : (ticket.organization_name || "Organization");

  ticket.messages = Array.isArray(ticket.messages) ? ticket.messages : [];
  ticket.messages.push(createTicketMessage({ sender, senderRole, text: messageText }));
  ticket.updated_at = timestamp;
  ticket.last_message_at = timestamp;
  ticket.status = "open";
  saveAgencyTickets();

  if (senderRole === "organization") {
    pushCountyNotification(`${ticket.organization_name} updated county ticket: ${ticket.subject}`, "system", timestamp, {
      organization_id: ticket.organization_id
    });
    saveCountyState();
  }

  res.json({ success: true, ticket: buildTicketView(ticket) });
});

app.post("/api/agency-tickets/:ticketId/status", (req, res) => {
  const ticketId = String(req.params.ticketId || "").trim();
  const status = String(req.body?.status || "").trim();
  const ticket = agencyTickets.find((item) => item.id === ticketId) || null;

  if (!ticket) {
    res.status(404).json({ error: "Ticket not found." });
    return;
  }

  if (!["open", "closed"].includes(status)) {
    res.status(400).json({ error: "Invalid ticket status." });
    return;
  }

  ticket.status = status;
  ticket.updated_at = getTimestamp();
  saveAgencyTickets();

  res.json({ success: true, ticket: buildTicketView(ticket) });
});

app.post("/api/auth/signup/phone", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const phone = String(req.body?.phone || "").trim();
  const requestCaseWorker = Boolean(req.body?.request_case_worker);
  const requestedAgencyId = String(req.body?.requested_agency_id || "").trim();
  const requestedAgency = agencies.find((agency) => agency.id === requestedAgencyId) || null;
  const isCountyRequest = requestedAgency?.id === COUNTY_ORGANIZATION_ID;

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
    requestedCaseWorker: requestCaseWorker,
    requestedAgencyId: requestedAgency?.id || null,
    requestedAgencyName: requestedAgency?.name || "",
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
  const signupMessage = requestCaseWorker && requestedAgency
    ? (isCountyRequest
        ? `Your request is with ${requestedAgency.name}. Caseworker assignment can begin right away. Future updates will come here and by text.`
        : `Your request was sent to ${requestedAgency.name}. That agency must accept before caseworker assignment can begin. Future updates will come here and by text.`)
    : requestCaseWorker
      ? "Your case worker request was sent. Future updates will come here and by text."
      : "Your account is ready. Future updates will come here and by text.";
  await createClientNotification(account.clientId, {
    title: "Notifications are on",
    message: signupMessage,
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
  const requestedAgencyId = String(req.body?.requested_agency_id || "").trim();
  const requestedAgency = agencies.find((agency) => agency.id === requestedAgencyId) || null;
  const isCountyRequest = requestedAgency?.id === COUNTY_ORGANIZATION_ID;

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
    requestedCaseWorker: requestCaseWorker,
    requestedAgencyId: requestedAgency?.id || null,
    requestedAgencyName: requestedAgency?.name || "",
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
  const signupMessage = requestCaseWorker && requestedAgency
    ? (isCountyRequest
        ? `Your request is with ${requestedAgency.name}. Caseworker assignment can begin right away. Future updates will come here and by email.`
        : `Your request was sent to ${requestedAgency.name}. That agency must accept before caseworker assignment can begin. Future updates will come here and by email.`)
    : requestCaseWorker
      ? "Your case worker request was sent. Future updates will come here and by email."
      : "Your account is ready. Future updates will come here and by email.";
  await createClientNotification(account.clientId, {
    title: "Notifications are on",
    message: signupMessage,
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
  const sessionToken = createAuthSession(res, account);

  res.json({
    success: true,
    user: sanitizeClientAccount(account),
    sessionToken
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

  const sessionToken = createAuthSession(res, account);

  res.json({
    success: true,
    user: sanitizeClientAccount(account),
    sessionToken
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

  if (role === "organization") {
    res.json({
      role,
      accounts: getOrganizationAdminAccounts()
    });
    return;
  }

  const account = getDemoAdminAccount(role);
  res.json({
    role,
    accounts: account ? [account] : []
  });
});

app.post("/api/admin/caseworkers", (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const password = String(req.body?.password || "").trim();
  const requestedWorkerId = String(req.body?.workerId || "").trim();
  const requestedOrganizationId = String(req.body?.organization_id || COUNTY_ORGANIZATION_ID).trim();
  const workerId = formatWorkerId(requestedWorkerId);
  const organization = agencies.find((agency) => agency.id === requestedOrganizationId) || agencies.find((agency) => agency.id === COUNTY_ORGANIZATION_ID);
  const organizationId = organization?.id || COUNTY_ORGANIZATION_ID;
  const organizationName = organization?.name || COUNTY_ORGANIZATION_NAME;

  if (!name || !email || !password || !workerId) {
    res.status(400).json({ success: false, error: "Name, email, password, and caseworker number are required." });
    return;
  }

  if (workers.some((worker) => String(worker.id).toUpperCase() === workerId)) {
    res.status(400).json({ success: false, error: "That caseworker number already exists." });
    return;
  }

  const normalizedEmail = normalizeEmail(email);
  const adminAccounts = loadAdminAccounts();
  if (adminAccounts.some((account) => normalizeEmail(account.email) === normalizedEmail)) {
    res.status(400).json({ success: false, error: "That login email is already in use." });
    return;
  }

  const { salt, hash } = hashPassword(password);
  const newWorker = enrichWorkerProfile({
    id: workerId,
    name,
    active_cases: 0,
    title: "Case Worker",
    phone: "",
    email: normalizedEmail,
    office: "Passaic County Main Office",
    languages: ["English"],
    specialties: ["Case management"],
    bio: `${name} supports ${organizationName} clients and case follow-up.`,
    availability: "Mon-Fri, 9:00 AM - 5:00 PM",
    pronouns: "",
    organization_id: organizationId,
    organization_name: organizationName
  });

  workers.push(newWorker);
  adminAccounts.push({
    id: `AD-${String(adminAccounts.length + 1).padStart(2, "0")}`,
    role: "caseworker",
    workerId,
    name,
    email: normalizedEmail,
    organization_id: organizationId,
    organization_name: organizationName,
    passwordSalt: salt,
    passwordHash: hash
  });

  saveAdminAccounts(adminAccounts);
  pushCountyNotification(`New caseworker account created for ${name} (${workerId}) at ${organizationName}`, workerId, getTimestamp(), {
    organization_id: organizationId
  });
  saveCountyState();

  res.json({
    success: true,
    worker: buildWorkerView(newWorker),
    account: {
      role: "caseworker",
      workerId,
      name,
      email: normalizedEmail,
      organization_id: organizationId,
      organization_name: organizationName
    }
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
  const client = clients.find((item) => item.id === account.clientId);
  if (client) {
    const missingCount = Array.isArray(client.missing_documents) ? client.missing_documents.length : 0;
    pushCountyNotification(
      `${client.name} updated intake. ${missingCount} document step${missingCount === 1 ? "" : "s"} still open.`,
      client.assigned_worker || "system"
    );
    saveCountyState();
  }

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

app.post("/api/help-chat", async (req, res) => {
  const question = String(req.body?.question || "").trim();
  const language = String(req.body?.language || "en").trim().toLowerCase() === "es" ? "es" : "en";

  if (!question) {
    res.status(400).json({ error: "Question is required." });
    return;
  }

  try {
    const response = await generatePortalHelpReply({
      question,
      language
    });

    res.json({
      success: true,
      provider: "openai",
      response: response || createPortalHelpFallback(question, language)
    });
    return;
  } catch (error) {
    console.error("Portal help chat failed. Falling back to local response.", error.message);
  }

  res.json({
    success: true,
    provider: "local-fallback",
    response: createPortalHelpFallback(question, language)
  });
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
  const { client_id: clientId, worker_id: workerId, organization_id: organizationId } = req.body || {};
  const client = clients.find((item) => item.id === clientId);
  const worker = workers.find((item) => item.id === workerId);

  if (!client || !worker) {
    res.status(400).json({ error: "Client or worker not found." });
    return;
  }

  if (client.requested_agency_id && client.requested_agency_id !== COUNTY_ORGANIZATION_ID && client.agency_request_status !== "accepted") {
    res.status(400).json({ error: "The requested agency must accept this client before a caseworker can be assigned." });
    return;
  }

  if (client.accepted_agency_id && client.accepted_agency_id !== COUNTY_ORGANIZATION_ID && client.accepted_agency_id !== String(organizationId || "").trim()) {
    res.status(400).json({ error: "This case must be assigned from the accepted organization portal." });
    return;
  }

  if (client.accepted_agency_id && worker.organization_id !== client.accepted_agency_id) {
    res.status(400).json({ error: "This worker does not belong to the accepted agency for this client." });
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

  client.assigned_worker = workerId;
  client.status = "pending";
  client.worker_status = "pending_approval";
  client.case_worker_requested = true;
  touchClientRelationship(client, "county_assignment");
  syncWorkerActiveCaseCounts();

  pushCountyNotification(`${worker.name} assigned to ${client.name}`, worker.id);
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

app.post("/api/agency-request-status", async (req, res) => {
  const { client_id: clientId, organization_id: organizationId, action } = req.body || {};
  syncClientsFromAccounts();
  syncAllClientRelationships();
  const client = clients.find((item) => item.id === clientId);
  const agency = agencies.find((item) => item.id === organizationId);

  if (!client || !agency) {
    res.status(400).json({ error: "Client or organization not found." });
    return;
  }

  if (client.requested_agency_id !== organizationId) {
    res.status(400).json({ error: "This client did not request this organization." });
    return;
  }

  if (!["accept", "reject"].includes(action)) {
    res.status(400).json({ error: "Invalid action." });
    return;
  }

  if (client.agency_request_status !== "pending_review") {
    res.status(400).json({ error: "This request is no longer waiting for agency review." });
    return;
  }

  if (action === "accept") {
    client.agency_request_status = "accepted";
    client.accepted_agency_id = organizationId;
    client.accepted_agency_name = agency.name;
    client.status = "pending";
    client.worker_status = null;
    client.assigned_worker = null;
    touchClientRelationship(client, "agency_accept");
    pushCountyNotification(`${agency.name} accepted ${client.name}'s request`, "system", getTimestamp(), {
      organization_id: organizationId
    });
    await createClientNotification(client.id, {
      title: "Agency request accepted",
      message: `${agency.name} accepted your request. They can now assign a caseworker.`,
      category: "status"
    });
  } else {
    client.agency_request_status = "rejected";
    client.accepted_agency_id = null;
    client.accepted_agency_name = "";
    client.assigned_worker = null;
    client.worker_status = null;
    client.status = "pending";
    touchClientRelationship(client, "agency_reject");
    pushCountyNotification(`${agency.name} declined ${client.name}'s request`, "system", getTimestamp(), {
      organization_id: organizationId
    });
    await createClientNotification(client.id, {
      title: "Agency request declined",
      message: `${agency.name} declined your request. Please choose another agency or contact the county.`,
      category: "status"
    });
  }

  saveCountyState();
  res.json({
    success: true,
    client: buildClientView(client)
  });
});

app.post("/api/case-status", async (req, res) => {
  const { client_id: clientId, worker_id: workerId, action } = req.body || {};
  syncClientsFromAccounts();
  syncAllClientRelationships();
  syncWorkerActiveCaseCounts();
  const client = clients.find((item) => item.id === clientId);
  const worker = workers.find((item) => item.id === workerId);

  if (!client || !worker || client.assigned_worker !== workerId) {
    res.status(400).json({ error: "Client or worker not found." });
    return;
  }

  if (action === "accept") {
    if (client.worker_status !== "pending_approval") {
      res.status(400).json({ error: "This case is not waiting for worker acceptance." });
      return;
    }

    client.status = "active";
    client.worker_status = "active";
    client.case_worker_requested = true;
    touchClientRelationship(client, "caseworker_accept");
    syncWorkerActiveCaseCounts();
    pushCountyNotification(`${worker.name} accepted ${client.name}`, worker.id);
    await createClientNotification(client.id, {
      title: "Case accepted",
      message: `${worker.name} accepted your case and started working on it.`,
      category: "status"
    });
  } else if (action === "complete") {
    if (client.worker_status !== "active") {
      res.status(400).json({ error: "Only active cases can be completed." });
      return;
    }

    pushCountyNotification(`${worker.name} completed ${client.name}`, worker.id);
    recordCompletedWorkerCase(client, worker);
    markClientCaseCompleted(client, worker);
    await createClientNotification(client.id, {
      title: "Case completed",
      message: `${worker.name} marked your case as completed. You can still log in to review your documents and message history.`,
      category: "status"
    });
  } else if (action === "reject") {
    if (client.worker_status !== "pending_approval") {
      res.status(400).json({ error: "This case is not waiting for worker review." });
      return;
    }

    client.worker_status = "rejected";
    client.status = "pending";
    client.assigned_worker = null;
    client.case_worker_requested = true;
    touchClientRelationship(client, "caseworker_reject");
    syncWorkerActiveCaseCounts();
    pushCountyNotification(`${worker.name} rejected ${client.name}`, worker.id);
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
  touchClientRelationship(client, message.sender === "client" ? "client_message" : "caseworker_message");
  pushCountyNotification(
    message.sender === "client"
      ? `${client.name} sent a message${message.worker_id ? ` to ${client.assigned_worker_name || message.worker_id}` : ""}`
      : `${client.assigned_worker_name || "Case worker"} sent a case update to ${client.name}`,
    message.worker_id || "system"
  );
  saveCountyState();
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
  touchClientRelationship(client, documentRecord.uploaded_by === "client" ? "client_document" : "caseworker_document");
  pushCountyNotification(
    documentRecord.uploaded_by === "client"
      ? `${client.name} uploaded ${getDocumentLabel(documentRecord.document_type)}`
      : `${client.assigned_worker_name || "Case worker"} uploaded ${getDocumentLabel(documentRecord.document_type)} for ${client.name}`,
    documentRecord.worker_id || "system"
  );
  saveCountyState();
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
  touchClientRelationship(client, "caseworker_transport_request");
  pushCountyNotification(request.message, worker.id, request.timestamp);
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

app.get("*", (req, res) => {
  // Do not return HTML for missing asset files. Let missing CSS/JS/image requests fail clearly.
  if (path.extname(req.path)) {
    res.status(404).type("text/plain").send("Not found");
    return;
  }

  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Passaic County Housing Coordination System running at http://${HOST}:${PORT}`);
});
