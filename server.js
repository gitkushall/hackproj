const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || "";

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const dataDirectory = path.join(__dirname, "data");
const clientAccountsFilePath = path.join(dataDirectory, "client-accounts.json");
const clientsFilePath = path.join(dataDirectory, "clients.json");
const workersFilePath = path.join(dataDirectory, "workers.json");
const notificationsFilePath = path.join(dataDirectory, "notifications.json");
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

const defaultWorkers = [
  { id: "WK-01", name: "Sarah Ahmed", active_cases: 1 },
  { id: "WK-02", name: "Daniel Kim", active_cases: 1 },
  { id: "WK-03", name: "Priya Shah", active_cases: 2 },
  { id: "WK-04", name: "Marcus Hill", active_cases: 1 }
];

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

const defaultClientAccounts = [
  { clientId: "CL-1001", name: "Maria Lopez", phone: "(973) 210-1101", username: "maria.lopez", password: "Maria@1234" },
  { clientId: "CL-1002", name: "James Carter", phone: "(973) 210-1102", username: "james.carter", password: "James@1234" },
  { clientId: "CL-1003", name: "Aisha Brown", phone: "(973) 210-1103", username: "aisha.brown", password: "Aisha@1234" },
  { clientId: "CL-1004", name: "Luis Rivera", phone: "(973) 210-1104", username: "luis.rivera", password: "Luis@1234" }
];

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

function ensureDataDirectory() {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

function saveJsonFile(filePath, value) {
  ensureDataDirectory();
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function loadJsonFile(filePath, fallbackValue) {
  ensureDataDirectory();

  if (!fs.existsSync(filePath)) {
    saveJsonFile(filePath, fallbackValue);
    return fallbackValue.slice();
  }

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error("Storage file must contain an array.");
    }

    return parsed;
  } catch (error) {
    console.error(`Failed to load storage file ${path.basename(filePath)}. Recreating defaults.`, error);
    saveJsonFile(filePath, fallbackValue);
    return fallbackValue.slice();
  }
}

function saveClientAccounts(accounts) {
  saveJsonFile(clientAccountsFilePath, accounts);
}

function saveCountyState() {
  saveJsonFile(clientsFilePath, clients);
  saveJsonFile(workersFilePath, workers);
  saveJsonFile(notificationsFilePath, notifications);
  saveJsonFile(transportRequestsFilePath, transportRequests);
}

function saveMessages() {
  saveJsonFile(messagesFilePath, messages);
}

function saveClientDocuments() {
  saveJsonFile(clientDocumentsFilePath, clientDocuments);
}

const clients = loadJsonFile(clientsFilePath, defaultClients);
const workers = loadJsonFile(workersFilePath, defaultWorkers);
const notifications = loadJsonFile(notificationsFilePath, defaultNotifications);
const transportRequests = loadJsonFile(transportRequestsFilePath, defaultTransportRequests);
const clientAccounts = loadJsonFile(clientAccountsFilePath, defaultClientAccounts);
const messages = loadJsonFile(messagesFilePath, defaultMessages);
const clientDocuments = loadJsonFile(clientDocumentsFilePath, defaultClientDocuments);

function getRecommendedWorker() {
  return workers.reduce((lowest, worker) => (
    worker.active_cases < lowest.active_cases ? worker : lowest
  ), workers[0]);
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
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

app.get("/api/transport-requests", (_req, res) => {
  res.json({
    transport_requests: transportRequests.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  });
});

app.get("/api/client-accounts", (_req, res) => {
  res.json({
    accounts: clientAccounts
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

app.post("/api/assign", (req, res) => {
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

  res.json({
    success: true,
    client,
    worker,
    recommended_worker_id: getRecommendedWorker().id
  });
});

app.post("/api/case-status", (req, res) => {
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

app.post("/api/messages", (req, res) => {
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

  res.json({
    success: true,
    message
  });
});

app.post("/api/client-documents", (req, res) => {
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

app.post("/api/transport-request", (req, res) => {
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

  res.json({
    success: true,
    transport_request: request
  });
});

app.post("/api/admin-chat", (req, res) => {
  const { question = "" } = req.body || {};
  res.json({
    response: createInsightResponse(question)
  });
});

app.post("/api/client-accounts", (req, res) => {
  const {
    name = "",
    phone = "",
    username = "",
    password = "",
    request_case_worker: requestCaseWorker = false
  } = req.body || {};

  const trimmedName = String(name).trim();
  const trimmedPhone = String(phone).trim();
  const trimmedUsername = String(username).trim();
  const trimmedPassword = String(password).trim();

  if (!trimmedName || !trimmedPhone || !trimmedUsername || !trimmedPassword) {
    res.status(400).json({ error: "Enter your name, phone number, username, and password." });
    return;
  }

  const duplicateAccount = clientAccounts.some((account) => (
    account.username.toLowerCase() === trimmedUsername.toLowerCase() ||
    normalizePhone(account.phone) === normalizePhone(trimmedPhone)
  ));

  if (duplicateAccount) {
    res.status(400).json({ error: "That username or phone number is already in use." });
    return;
  }

  const account = {
    clientId: `CL-${String(getNextClientIdNumber())}`,
    name: trimmedName,
    phone: trimmedPhone,
    username: trimmedUsername,
    password: trimmedPassword
  };

  clientAccounts.push(account);
  saveClientAccounts(clientAccounts);

  const notificationPrefix = requestCaseWorker
    ? `Client ${account.name} created an account and requested a case worker`
    : `New account created in Passaic County: client ${account.name}, username ${account.username}`;

  notifications.unshift({
    id: `NT-${Date.now()}`,
    message: notificationPrefix,
    worker_id: "system",
    timestamp: new Date().toISOString()
  });

  if (requestCaseWorker) {
    const existingCountyClient = clients.find((client) => client.id === account.clientId);

    if (!existingCountyClient) {
      clients.unshift({
        id: account.clientId,
        name: account.name,
        city: "Passaic",
        missing_documents: [],
        transportation_needed: false,
        status: "pending",
        assigned_worker: null,
        worker_status: null
      });
    }
  }
  saveCountyState();

  res.json({
    success: true,
    account
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Passaic County Housing Coordination System running at http://${HOST}:${PORT}`);
});
