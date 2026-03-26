const systemData = {
  total_users: 284,
  completed: 61,
  applications: 93,
  stuck_state_id: 52,
  stuck_ssn: 28,
  stuck_birth: 20,
  transport_needed: 37
};

const requests = [
  {
    id: "CL-1001",
    name: "Maria Lopez",
    location: "Paterson",
    county: "Passaic",
    neededDocs: ["birth_certificate", "state_id"],
    transportNeeded: true,
    status: "pending",
    assignedWorkerId: null,
    workerStatus: null,
    recommendedWorkerId: null
  },
  {
    id: "CL-1002",
    name: "James Carter",
    location: "Passaic",
    county: "Passaic",
    neededDocs: ["ssn"],
    transportNeeded: false,
    status: "pending",
    assignedWorkerId: null,
    workerStatus: null,
    recommendedWorkerId: null
  },
  {
    id: "CL-1003",
    name: "Aisha Brown",
    location: "Clifton",
    county: "Passaic",
    neededDocs: ["state_id"],
    transportNeeded: true,
    status: "pending",
    assignedWorkerId: null,
    workerStatus: null,
    recommendedWorkerId: null
  },
  {
    id: "CL-1004",
    name: "Luis Rivera",
    location: "Wayne",
    county: "Passaic",
    neededDocs: ["birth_certificate", "ssn", "state_id"],
    transportNeeded: true,
    status: "pending",
    assignedWorkerId: null,
    workerStatus: null,
    recommendedWorkerId: null
  },
  {
    id: "CL-1005",
    name: "Nina Patel",
    location: "Totowa",
    county: "Passaic",
    neededDocs: ["birth_certificate"],
    transportNeeded: false,
    status: "pending",
    assignedWorkerId: null,
    workerStatus: null,
    recommendedWorkerId: null
  },
  {
    id: "CL-1006",
    name: "Robert Green",
    location: "Paterson",
    county: "Passaic",
    neededDocs: ["ssn", "state_id"],
    transportNeeded: false,
    status: "assigned",
    assignedWorkerId: "WK-03",
    workerStatus: "active",
    recommendedWorkerId: null
  }
];

const workers = [
  { id: "WK-01", name: "Sarah Ahmed", county: "Passaic", activeCount: 4 },
  { id: "WK-02", name: "Daniel Kim", county: "Passaic", activeCount: 6 },
  { id: "WK-03", name: "Priya Shah", county: "Passaic", activeCount: 3 },
  { id: "WK-04", name: "Marcus Hill", county: "Passaic", activeCount: 7 }
];

const notifications = [
  {
    id: "NT-01",
    message: "Priya Shah assigned to Robert Green",
    workerId: "WK-03",
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString()
  },
  {
    id: "NT-02",
    message: "County dashboard synced with latest request queue",
    workerId: "system",
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getWorkers() {
  return workers;
}

function getRequests() {
  return requests;
}

function getNotifications() {
  return notifications;
}

function getSystemData() {
  return systemData;
}

function findWorkerById(workerId) {
  return workers.find((worker) => worker.id === workerId) || null;
}

function findRequestById(requestId) {
  return requests.find((request) => request.id === requestId) || null;
}

function findRecommendedWorkerForRequest(request) {
  const sameCountyWorkers = workers.filter((worker) => worker.county === request.county);
  const pool = sameCountyWorkers.length ? sameCountyWorkers : workers;

  return pool.reduce((best, worker) => {
    if (!best) return worker;
    return worker.activeCount < best.activeCount ? worker : best;
  }, null);
}

function getBestWorkerMatch() {
  return workers.reduce((best, worker) => {
    if (!best) return worker;
    return worker.activeCount < best.activeCount ? worker : best;
  }, null);
}

function refreshRecommendations() {
  requests.forEach((request) => {
    const recommendedWorker = findRecommendedWorkerForRequest(request);
    request.recommendedWorkerId = recommendedWorker ? recommendedWorker.id : null;
  });
}

function getDashboardStats() {
  const bestWorkerMatch = getBestWorkerMatch();

  return {
    activeUsersThisWeek: systemData.total_users,
    peopleHoused: requests.filter((request) => request.status === "assigned").length,
    activeApplications: requests.filter((request) => request.status !== "closed").length,
    bestWorkerMatch: bestWorkerMatch
      ? { id: bestWorkerMatch.id, name: bestWorkerMatch.name }
      : null
  };
}

function addNotification(message, workerId = "system") {
  notifications.unshift({
    id: `NT-${Date.now()}`,
    message,
    workerId,
    timestamp: new Date().toISOString()
  });
}

function assignRequest(requestId, workerId) {
  const request = findRequestById(requestId);
  const worker = findWorkerById(workerId);

  if (!request || !worker) {
    return null;
  }

  if (request.assignedWorkerId === worker.id) {
    refreshRecommendations();
    return { request, worker };
  }

  if (request.assignedWorkerId) {
    const previousWorker = findWorkerById(request.assignedWorkerId);
    if (previousWorker && previousWorker.activeCount > 0) {
      previousWorker.activeCount -= 1;
    }
  }

  request.assignedWorkerId = worker.id;
  request.status = "assigned";
  request.workerStatus = "pending_approval";
  worker.activeCount += 1;

  addNotification(`${worker.name} assigned to ${request.name}`, worker.id);
  refreshRecommendations();

  return { request, worker };
}

function updateCaseApproval(requestId, workerId, action) {
  const request = findRequestById(requestId);
  const worker = findWorkerById(workerId);

  if (!request || !worker || request.assignedWorkerId !== workerId) {
    return null;
  }

  if (action === "accept") {
    request.workerStatus = "active";
    addNotification(`${worker.name} accepted ${request.name}`, worker.id);
    refreshRecommendations();
    return { request, worker };
  }

  if (action === "reject") {
    request.workerStatus = null;
    request.status = "pending";
    request.assignedWorkerId = null;
    if (worker.activeCount > 0) {
      worker.activeCount -= 1;
    }
    addNotification(`${worker.name} rejected ${request.name}`, worker.id);
    refreshRecommendations();
    return { request, worker };
  }

  return false;
}

function getRequestsResponse() {
  refreshRecommendations();
  return clone(requests);
}

function getWorkersResponse() {
  return clone(workers);
}

function getNotificationsResponse() {
  return clone(notifications).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

refreshRecommendations();

module.exports = {
  getDashboardStats,
  getNotifications,
  getNotificationsResponse,
  getRequests,
  getRequestsResponse,
  getSystemData,
  getWorkers,
  getWorkersResponse,
  assignRequest,
  findRecommendedWorkerForRequest,
  updateCaseApproval
};
