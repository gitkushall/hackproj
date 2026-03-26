const {
  assignRequest,
  getDashboardStats,
  getNotificationsResponse,
  getRequestsResponse,
  getSystemData,
  getWorkersResponse,
  updateCaseApproval
} = require("./caseStore");

const ADMIN_CREDENTIALS = {
  email: "idhelp.admin.portal@gmail.com",
  password: "Admin@1234"
};

function createInsightResponse(questionRaw) {
  const systemData = getSystemData();
  const question = String(questionRaw || "").toLowerCase();
  const dashboard = getDashboardStats();

  if (question.includes("stuck") || question.includes("problem")) {
    return "Most users are stuck at the State ID step. This happens because it needs in-person appointments. You should increase MVC availability and transportation support.";
  }

  if (question.includes("transport")) {
    return `Transportation is affecting ${systemData.transport_needed}% of users. This slows down office visits and document pickup. You should expand ride support and travel vouchers.`;
  }

  if (question.includes("how many") || question.includes("load") || question.includes("workload")) {
    return `${dashboard.activeUsersThisWeek} users are active and ${dashboard.peopleHoused} are assigned. The lightest worker is ${dashboard.bestWorkerMatch.name} with the best current workload.`;
  }

  if (question.includes("improve") || question.includes("solution")) {
    return "State ID delays are the biggest problem. They happen because of appointment bottlenecks and travel needs. You should add MVC coordination and faster transportation support.";
  }

  return "Most delays are happening at the State ID step. This is driven by appointments and transportation barriers. You should focus on faster scheduling and travel support.";
}

function handleAdminLogin(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(400).json({ success: false, error: "Missing credentials" });
    return;
  }

  if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
    res.status(401).json({ success: false, error: "Invalid credentials" });
    return;
  }

  res.json({ success: true });
}

function getAdminDashboard(_req, res) {
  res.json(getDashboardStats());
}

function getAdminRequests(_req, res) {
  res.json({ requests: getRequestsResponse() });
}

function getAdminWorkers(_req, res) {
  res.json({ workers: getWorkersResponse() });
}

function postAdminAssign(req, res) {
  const { request_id: requestId, worker_id: workerId } = req.body || {};
  const result = assignRequest(requestId, workerId);

  if (!result) {
    res.status(400).json({ success: false, error: "Request or worker not found." });
    return;
  }

  res.json({ success: true, ...result });
}

function postCaseStatus(req, res) {
  const { client_id: requestId, worker_id: workerId, action } = req.body || {};
  const result = updateCaseApproval(requestId, workerId, action);

  if (result === false) {
    res.status(400).json({ success: false, error: "Invalid action." });
    return;
  }

  if (!result) {
    res.status(400).json({ success: false, error: "Client or worker not found." });
    return;
  }

  res.json({ success: true, ...result });
}

function getNotifications(_req, res) {
  res.json({ notifications: getNotificationsResponse() });
}

function postAdminChat(req, res) {
  const { question = "" } = req.body || {};
  res.json({ response: createInsightResponse(question) });
}

module.exports = {
  getAdminDashboard,
  getAdminRequests,
  getAdminWorkers,
  getNotifications,
  handleAdminLogin,
  postAdminAssign,
  postAdminChat,
  postCaseStatus
};
