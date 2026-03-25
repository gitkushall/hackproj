const state = {
  lang: "en",
  authView: "user",
  loginView: "phone",
  adminRole: "caseworker",
  otpSent: false,
  demoPhone: "",
  demoUsername: "",
  demoCode: "",
  demoAdminEmail: "idhelp.admin.portal@gmail.com",
  countyData: {
    clients: [],
    workers: [],
    notifications: [],
    transportRequests: [],
    recommendedWorkerId: null
  },
  clientPortalData: {
    currentClientId: "CL-1006"
  },
  caseWorkerData: {
    currentWorkerId: "WK-03",
    workers: [],
    clients: [],
    myCases: [],
    selectedClientId: null,
    fullCaseViewId: null,
    messagesByClient: {},
    archivedChats: {},
    chatNotices: {},
    notes: {},
    transportMessages: {},
    documentUploads: {},
    openUploadPanels: {}
  },
  answers: {
    hasBirth: null,
    hasSSN: null,
    hasID: null
  }
};

const CASE_WORKER_CREDENTIALS = {
  password: "1234"
};

const ADMIN_CREDENTIALS = {
  email: "idhelp.admin.portal@gmail.com",
  password: "Admin@1234"
};

const CASE_WORKER_ACCOUNTS = [
  { workerId: "WK-01", name: "Sarah Ahmed", email: "sarah.ahmed.caseworker@gmail.com", password: "Sarah@1234" },
  { workerId: "WK-02", name: "Daniel Kim", email: "daniel.kim.caseworker@gmail.com", password: "Daniel@1234" },
  { workerId: "WK-03", name: "Priya Shah", email: "priya.shah.caseworker@gmail.com", password: "Priya@1234" },
  { workerId: "WK-04", name: "Marcus Hill", email: "marcus.hill.caseworker@gmail.com", password: "Marcus@1234" }
];

const DEMO_CLIENT_ACCOUNTS = [
  { clientId: "CL-1001", name: "Maria Lopez", phone: "(973) 210-1101", username: "maria.lopez", password: "Maria@1234" },
  { clientId: "CL-1002", name: "James Carter", phone: "(973) 210-1102", username: "james.carter", password: "James@1234" },
  { clientId: "CL-1003", name: "Aisha Brown", phone: "(973) 210-1103", username: "aisha.brown", password: "Aisha@1234" },
  { clientId: "CL-1004", name: "Luis Rivera", phone: "(973) 210-1104", username: "luis.rivera", password: "Luis@1234" }
];

const adminCases = {
  caseworker: [
    { name: "Maria Lopez", detail: "ID and SSN", status: "Waiting for SSN" },
    { name: "James Carter", detail: "Birth certificate", status: "Need records" },
    { name: "Aisha Brown", detail: "State ID", status: "Ready for MVC" },
    { name: "Luis Rivera", detail: "Passport", status: "Photo missing" },
    { name: "Nina Patel", detail: "ID and birth certificate", status: "Review today" },
    { name: "Robert Green", detail: "SSN", status: "Office visit set" },
    { name: "Derek Hall", detail: "State ID", status: "Paperwork open" },
    { name: "Fatima Ali", detail: "Passport and ID", status: "Check forms" },
    { name: "Tony Young", detail: "Birth certificate", status: "County hold" },
    { name: "Emma Diaz", detail: "SSN and ID", status: "Call back needed" }
  ],
  passaic: [
    { name: "Passaic Intake 01", detail: "County review", status: "New referral" },
    { name: "Passaic Intake 02", detail: "Shelter document help", status: "Call today" },
    { name: "Passaic Intake 03", detail: "Birth certificate queue", status: "Pending county check" },
    { name: "Passaic Intake 04", detail: "ID recovery", status: "Waiting on worker" },
    { name: "Passaic Intake 05", detail: "Transportation request", status: "Needs county approval" },
    { name: "Passaic Intake 06", detail: "Passport review", status: "Meeting scheduled" }
  ]
};

const passaicCountyMetrics = {
  totalUsers: 284,
  housedUsers: 61,
  activeApplications: 93
};

const systemData = {
  total_users: 284,
  completed: 61,
  applications: 93,
  stuck_state_id: 52,
  stuck_ssn: 28,
  stuck_birth: 20,
  transport_needed: 37
};

const housingData = [
  { city: "Paterson", units: 12 },
  { city: "Clifton", units: 8 },
  { city: "Passaic", units: 5 }
];

const uiText = {
  en: {
    adminPortal: "Admin Portal",
    adminBack: "Back to login",
    adminMark: "Admin Login",
    adminEyebrow: "Staff access",
    adminTitle: "Admin sign in",
    adminSubtitle: "Use your admin Gmail and password to open the staff dashboard.",
    adminRoleCaseworker: "Case Worker",
    adminRolePassaic: "Passaic County",
    adminEmail: "Gmail",
    adminPassword: "Password",
    adminLogin: "Login with Gmail",
    adminDemo: "Admin demo",
    adminDemoPassword: "Demo password",
    adminError: "Wrong Gmail or password",
    adminDashboardEyebrow: "Staff cases",
    adminDashboardTitle: "Your case dashboard",
    adminDashboardSubtitle: "See the people and cases you are handling today.",
    adminSummaryCases: "Assigned cases",
    adminSummaryCounty: "County review queue",
    countyUsers: "Active Users (This Week)",
    countyHoused: "People housed",
    countyApplications: "Active applications",
    goBack: "Go Back",
    loginEyebrow: "Housing support access",
    loginTitle: "Log in to your housing portal",
    loginSubtitle: "Use your phone or username to enter the housing portal.",
    phoneOption: "Phone Login",
    workerOption: "Username Login",
    phone: "Enter your phone number",
    sendCode: "Send Code",
    code: "Enter code",
    verifyCode: "Verify Code",
    codeSent: "Code sent. Enter any 4-digit code.",
    demoPhone: "Demo phone",
    demoUsername: "Demo ID",
    demoPassword: "Demo password",
    demoCode: "Demo code",
    phoneError: "Enter your phone number",
    codeError: "Enter a 4-digit code",
    workerUsername: "Username",
    workerPassword: "Password",
    workerLogin: "Login",
    workerError: "Wrong username or password",
    dashboardEyebrow: "Your documents",
    dashboardTitle: "Choose what you need",
    dashboardSubtitle: "Tap a box to see the document you want help with.",
    docIdTitle: "Your ID",
    docIdText: "State ID help",
    docBirthTitle: "Birth Certificate",
    docBirthText: "Birth record help",
    docPassportTitle: "Passport",
    docPassportText: "Passport support",
    docSsnTitle: "SSN",
    docSsnText: "Social Security help",
    dashboardNote: "You can also continue to answer a few questions for a full plan.",
    dashboardContinue: "Continue",
    select: "Select",
    mainTitle: "Get your ID plan",
    mainSubtitle: "Answer each question.",
    qBirth: "Do you have a birth certificate?",
    qSSN: "Do you have a Social Security card?",
    qID: "Do you have a State ID?",
    qBorn: "Where were you born?",
    qNow: "Current city (Passaic County)",
    yes: "Yes",
    no: "No",
    getPlan: "Get My Plan",
    yourPlan: "Your plan",
    transport: "Get Transportation Help",
    startOver: "Start over",
    helpButton: "Need Help?",
    helpTitle: "Need Help?",
    helpPlaceholder: "Ask a basic question",
    helpSend: "Send",
    helpWelcome: "Hi. I can help with login, documents, transportation, and basic housing portal questions.",
    helpMessageDefault: "I can help with login, birth certificate, Social Security card, State ID, and transportation questions.",
    planError: "Please answer all 3 yes/no questions."
  },
  es: {
    adminPortal: "Portal Admin",
    adminBack: "Volver al inicio",
    adminMark: "Ingreso admin",
    adminEyebrow: "Acceso del personal",
    adminTitle: "Ingreso de admin",
    adminSubtitle: "Use su Gmail de admin y su contrasena para abrir el panel del personal.",
    adminRoleCaseworker: "Trabajador social",
    adminRolePassaic: "Passaic County",
    adminEmail: "Gmail",
    adminPassword: "Contrasena",
    adminLogin: "Entrar con Gmail",
    adminDemo: "Demo admin",
    adminDemoPassword: "Contrasena de prueba",
    adminError: "Gmail o contrasena incorrectos",
    adminDashboardEyebrow: "Casos del personal",
    adminDashboardTitle: "Su panel de casos",
    adminDashboardSubtitle: "Vea las personas y casos que esta manejando hoy.",
    adminSummaryCases: "Casos asignados",
    adminSummaryCounty: "Fila del condado",
    countyUsers: "Usuarios activos (esta semana)",
    countyHoused: "Personas con vivienda",
    countyApplications: "Solicitudes activas",
    goBack: "Volver",
    loginEyebrow: "Acceso a apoyo de vivienda",
    loginTitle: "Inicie sesion en su portal de vivienda",
    loginSubtitle: "Use su telefono o usuario para entrar al portal de vivienda.",
    phoneOption: "Ingreso con telefono",
    workerOption: "Ingreso con usuario",
    phone: "Ingrese su numero de telefono",
    sendCode: "Enviar codigo",
    code: "Ingrese el codigo",
    verifyCode: "Verificar codigo",
    codeSent: "Codigo enviado. Ingrese cualquier codigo de 4 digitos.",
    demoPhone: "Telefono de prueba",
    demoUsername: "ID de prueba",
    demoPassword: "Contrasena de prueba",
    demoCode: "Codigo de prueba",
    phoneError: "Ingrese su numero de telefono",
    codeError: "Ingrese un codigo de 4 digitos",
    workerUsername: "Usuario",
    workerPassword: "Contrasena",
    workerLogin: "Entrar",
    workerError: "Nombre de usuario o contrasena incorrectos",
    dashboardEyebrow: "Sus documentos",
    dashboardTitle: "Elija lo que necesita",
    dashboardSubtitle: "Toque un cuadro para ver el documento con el que necesita ayuda.",
    docIdTitle: "Su ID",
    docIdText: "Ayuda con ID estatal",
    docBirthTitle: "Acta de Nacimiento",
    docBirthText: "Ayuda con acta",
    docPassportTitle: "Pasaporte",
    docPassportText: "Ayuda con pasaporte",
    docSsnTitle: "SSN",
    docSsnText: "Ayuda con Seguro Social",
    dashboardNote: "Tambien puede continuar para responder unas preguntas y obtener un plan completo.",
    dashboardContinue: "Continuar",
    select: "Seleccione",
    mainTitle: "Obtenga su plan de ID",
    mainSubtitle: "Responda cada pregunta.",
    qBirth: "Tiene acta de nacimiento?",
    qSSN: "Tiene tarjeta de Seguro Social?",
    qID: "Tiene ID estatal?",
    qBorn: "Donde nacio?",
    qNow: "Ciudad actual (Passaic County)",
    yes: "Si",
    no: "No",
    getPlan: "Obtener mi plan",
    yourPlan: "Su plan",
    transport: "Obtener ayuda de transporte",
    startOver: "Empezar de nuevo",
    helpButton: "Necesita ayuda?",
    helpTitle: "Necesita ayuda?",
    helpPlaceholder: "Haga una pregunta basica",
    helpSend: "Enviar",
    helpWelcome: "Hola. Puedo ayudar con inicio de sesion, documentos, transporte y preguntas basicas del portal.",
    helpMessageDefault: "Puedo ayudar con inicio de sesion, acta de nacimiento, tarjeta de Seguro Social, ID estatal y transporte.",
    planError: "Responda las 3 preguntas de si o no."
  }
};

const birthCitiesByState = {
  "New Jersey": ["Paterson", "Passaic", "Clifton", "Newark"],
  "New York": ["New York City", "Albany", "Buffalo", "Yonkers"],
  Pennsylvania: ["Philadelphia", "Allentown", "Erie", "Reading"]
};

const passaicCountyCities = [
  "Paterson",
  "Passaic",
  "Clifton",
  "Wayne",
  "Little Falls",
  "Totowa",
  "Haledon",
  "Prospect Park"
];

async function translateText(text, targetLang) {
  if (targetLang === "en") return text;

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text"
      })
    });

    if (!response.ok) return text;
    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    return text;
  }
}

function generatePlan(answers, birthPlace, currentCity) {
  const steps = [];

  if (!answers.hasBirth) {
    steps.push("You need a birth certificate.");
    steps.push(`Go to the Vital Records Office in ${birthPlace}.`);
    steps.push("Ask for a copy.");
  }

  if (!answers.hasSSN) {
    steps.push("You need a Social Security card.");
    steps.push(`Go to SSA office in ${currentCity}.`);
  }

  if (!answers.hasID) {
    steps.push("You need a State ID.");
    steps.push(`Go to DMV/MVC in ${currentCity}.`);
  }

  if (steps.length === 0) {
    steps.push("You have all documents.");
  }

  return {
    steps,
    transportation_needed: !answers.hasID
  };
}

function fillSelect(selectId, values) {
  const select = document.getElementById(selectId);
  select.innerHTML = "";

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function setupLocationDropdowns() {
  const stateList = Object.keys(birthCitiesByState);
  fillSelect("birth-state", stateList);
  fillSelect("birth-city", birthCitiesByState[stateList[0]]);
  fillSelect("current-city", passaicCountyCities);

  document.getElementById("birth-state").addEventListener("change", (event) => {
    fillSelect("birth-city", birthCitiesByState[event.target.value]);
  });
}

function openScreen(screenId) {
  ["login-screen", "admin-dashboard-screen", "dashboard-screen", "questions-screen", "result-screen"].forEach((id) => {
    document.getElementById(id).classList.toggle("hidden", id !== screenId);
  });

  const isAdminScreen = screenId === "admin-dashboard-screen";
  const isAdminLogin = screenId === "login-screen" && state.authView === "admin";
  const postLogin = screenId !== "login-screen";
  const showHelp = postLogin && !isAdminScreen && !isAdminLogin;
  const adminPortalBtn = document.getElementById("admin-portal-btn");
  if (adminPortalBtn) {
    adminPortalBtn.classList.toggle("hidden", postLogin);
  }

  document.getElementById("skyline").classList.toggle("dimmed", postLogin);
  const helpButton = document.getElementById("help-float-btn");
  helpButton.classList.toggle("hidden", !showHelp);
  helpButton.hidden = !showHelp;

  if (!showHelp) {
    closeHelpChat();
  }

  syncAdminLayoutMode(screenId);
}

function syncAdminLayoutMode(screenId) {
  const onAdminDashboard = screenId === "admin-dashboard-screen";
  const adminDashboard = document.getElementById("admin-dashboard-screen");
  const appWrap = document.querySelector(".app-wrap");

  adminDashboard.classList.toggle("county-mode", onAdminDashboard && state.adminRole === "passaic");
  adminDashboard.classList.toggle("caseworker-mode", onAdminDashboard && state.adminRole === "caseworker");
  appWrap.classList.toggle("county-expanded", onAdminDashboard && state.adminRole === "passaic");
  appWrap.classList.toggle("caseworker-expanded", onAdminDashboard && state.adminRole === "caseworker");
}

function applyLanguage() {
  const t = uiText[state.lang];
  const isAdmin = state.authView === "admin";
  const selectedWorkerAccount = getCurrentCaseWorkerAccount() || CASE_WORKER_ACCOUNTS[0];
  const selectedClientAccount = getCurrentClientAccount();
  const clientFirstName = getFirstName(selectedClientAccount?.name);
  const workerFirstName = getFirstName(selectedWorkerAccount?.name);
  const clientPhoneList = DEMO_CLIENT_ACCOUNTS.map((account) => `${account.name} | ${account.phone}`);
  const clientUsernameList = DEMO_CLIENT_ACCOUNTS.map((account) => `${account.name} | ${account.username}`);
  const clientPasswordList = DEMO_CLIENT_ACCOUNTS.map((account) => `${account.name} | ${account.password}`);
  const caseWorkerEmailList = CASE_WORKER_ACCOUNTS.map((account) => `${account.name} | ${account.email}`);
  const caseWorkerPasswordList = CASE_WORKER_ACCOUNTS.map((account) => `${account.name} | ${account.password}`);

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === state.lang);
  });

  document.getElementById("login-eyebrow").textContent = isAdmin ? t.adminEyebrow : t.loginEyebrow;
  document.getElementById("login-title").textContent = isAdmin ? t.adminTitle : t.loginTitle;
  document.getElementById("login-subtitle").textContent = isAdmin ? t.adminSubtitle : t.loginSubtitle;
  document.getElementById("phone-option-btn").textContent = t.phoneOption;
  document.getElementById("worker-option-btn").textContent = t.workerOption;
  document.getElementById("phone-label").textContent = t.phone;
  document.getElementById("send-code-btn").textContent = t.sendCode;
  document.getElementById("code-label").textContent = t.code;
  document.getElementById("verify-code-btn").textContent = t.verifyCode;
  document.getElementById("worker-username-label").textContent = t.workerUsername;
  document.getElementById("worker-password-label").textContent = t.workerPassword;
  document.getElementById("worker-login-btn").textContent = t.workerLogin;
  document.getElementById("phone-demo-note").innerHTML = renderDemoList(t.demoPhone, clientPhoneList);
  document.getElementById("worker-demo-note").innerHTML = renderDemoList(t.demoUsername, clientUsernameList);
  document.getElementById("worker-password-demo-note").innerHTML = renderDemoList(t.demoPassword, clientPasswordList);
  document.getElementById("code-demo-note").textContent = `${t.demoCode}: ${state.demoCode}`;
  document.getElementById("admin-login-back-btn").textContent = t.adminBack;
  document.getElementById("admin-google-mark").textContent = t.adminMark;
  document.getElementById("caseworker-role-btn").textContent = t.adminRoleCaseworker;
  document.getElementById("passaic-role-btn").textContent = t.adminRolePassaic;
  document.getElementById("admin-email-label").textContent = t.adminEmail;
  document.getElementById("admin-password-label").textContent = t.adminPassword;
  document.getElementById("admin-login-btn").textContent = t.adminLogin;
  document.getElementById("admin-demo-note").innerHTML = state.adminRole === "caseworker"
    ? renderDemoList(t.adminDemo, caseWorkerEmailList)
    : renderDemoList(t.adminDemo, [state.demoAdminEmail]);
  document.getElementById("admin-password-demo-note").innerHTML = state.adminRole === "caseworker"
    ? renderDemoList(t.adminDemoPassword, caseWorkerPasswordList)
    : renderDemoList(t.adminDemoPassword, [ADMIN_CREDENTIALS.password]);

  const adminPortalBtn = document.getElementById("admin-portal-btn");
  if (adminPortalBtn) {
    adminPortalBtn.textContent = t.adminPortal;
  }
  document.getElementById("dashboard-back-btn").textContent = t.goBack;
  document.getElementById("admin-dashboard-back-btn").textContent = t.goBack;
  document.getElementById("questions-back-btn").textContent = t.goBack;
  document.getElementById("result-back-btn").textContent = t.goBack;

  document.getElementById("admin-dashboard-eyebrow").textContent = t.adminDashboardEyebrow;
  document.getElementById("admin-dashboard-title").textContent =
    state.adminRole === "caseworker" && workerFirstName ? `Hello ${workerFirstName}` : t.adminDashboardTitle;
  document.getElementById("admin-dashboard-subtitle").textContent = t.adminDashboardSubtitle;
  const currentWorker = getCurrentWorker ? getCurrentWorker() : null;
  document.getElementById("admin-role-title").textContent =
    state.adminRole === "caseworker" && currentWorker ? currentWorker.name : (
      state.adminRole === "caseworker" ? t.adminRoleCaseworker : t.adminRolePassaic
    );
  document.getElementById("admin-role-subtitle").textContent =
    state.adminRole === "caseworker" && currentWorker ? `${currentWorker.active_cases} active cases` : (
      state.adminRole === "caseworker" ? t.adminSummaryCases : t.adminSummaryCounty
    );
  document.getElementById("county-users-number").textContent = String(passaicCountyMetrics.totalUsers);
  document.getElementById("county-housed-number").textContent = String(passaicCountyMetrics.housedUsers);
  document.getElementById("county-apps-number").textContent = String(passaicCountyMetrics.activeApplications);
  document.getElementById("county-users-label").textContent = t.countyUsers;
  document.getElementById("county-housed-label").textContent = t.countyHoused;
  document.getElementById("county-apps-label").textContent = t.countyApplications;

  document.getElementById("dashboard-eyebrow").textContent = t.dashboardEyebrow;
  document.getElementById("dashboard-title").textContent = clientFirstName ? `Hi ${clientFirstName}` : t.dashboardTitle;
  document.getElementById("dashboard-subtitle").textContent = t.dashboardSubtitle;
  document.getElementById("doc-id-title").textContent = t.docIdTitle;
  document.getElementById("doc-id-text").textContent = t.docIdText;
  document.getElementById("doc-birth-title").textContent = t.docBirthTitle;
  document.getElementById("doc-birth-text").textContent = t.docBirthText;
  document.getElementById("doc-passport-title").textContent = t.docPassportTitle;
  document.getElementById("doc-passport-text").textContent = t.docPassportText;
  document.getElementById("doc-ssn-title").textContent = t.docSsnTitle;
  document.getElementById("doc-ssn-text").textContent = t.docSsnText;
  document.getElementById("dashboard-note").textContent = t.dashboardNote;
  document.getElementById("dashboard-continue-btn").textContent = t.dashboardContinue;

  document.getElementById("main-title").textContent = t.mainTitle;
  document.getElementById("main-subtitle").textContent = t.mainSubtitle;
  document.getElementById("q-birth").textContent = t.qBirth;
  document.getElementById("q-ssn").textContent = t.qSSN;
  document.getElementById("q-id").textContent = t.qID;
  document.getElementById("q-born").textContent = t.qBorn;
  document.getElementById("q-now").textContent = t.qNow;
  document.getElementById("birth-yes").textContent = t.yes;
  document.getElementById("birth-no").textContent = t.no;
  document.getElementById("ssn-yes").textContent = t.yes;
  document.getElementById("ssn-no").textContent = t.no;
  document.getElementById("id-yes").textContent = t.yes;
  document.getElementById("id-no").textContent = t.no;
  document.getElementById("plan-btn").textContent = t.getPlan;
  document.getElementById("result-page-title").textContent = t.yourPlan;
  document.getElementById("transport-btn").textContent = t.transport;
  document.getElementById("start-over-btn").textContent = t.startOver;
  document.getElementById("help-float-btn").textContent = t.helpButton;
  document.getElementById("chat-title").textContent = t.helpTitle;
  document.getElementById("chat-input").placeholder = t.helpPlaceholder;
  document.getElementById("chat-send-btn").textContent = t.helpSend;

}

function setAuthView(view) {
  state.authView = view;
  const showAdmin = view === "admin";

  document.getElementById("user-login-panel").classList.toggle("hidden", showAdmin);
  document.getElementById("admin-login-panel").classList.toggle("hidden", !showAdmin);
  document.getElementById("login-error").textContent = "";
  openScreen("login-screen");
}

function setAdminRole(role) {
  state.adminRole = role;
  if (role === "caseworker" && !CASE_WORKER_ACCOUNTS.some((account) => account.workerId === state.caseWorkerData.currentWorkerId)) {
    state.caseWorkerData.currentWorkerId = CASE_WORKER_ACCOUNTS[0].workerId;
  }
  document.getElementById("caseworker-role-btn").classList.toggle("active", role === "caseworker");
  document.getElementById("passaic-role-btn").classList.toggle("active", role === "passaic");
  document.getElementById("admin-case-view").classList.toggle("hidden", role !== "caseworker");
  document.getElementById("admin-county-view").classList.toggle("hidden", role !== "passaic");
  syncAdminLayoutMode(
    document.getElementById("admin-dashboard-screen").classList.contains("hidden")
      ? "login-screen"
      : "admin-dashboard-screen"
  );
  if (role === "passaic" && !document.getElementById("admin-dashboard-screen").classList.contains("hidden")) {
    loadCountyDashboard();
  }
  if (role === "caseworker" && !document.getElementById("admin-dashboard-screen").classList.contains("hidden")) {
    loadCaseWorkerDashboard();
  }
  if (state.authView === "admin") {
    const selectedWorkerAccount = CASE_WORKER_ACCOUNTS.find((account) => account.workerId === state.caseWorkerData.currentWorkerId) || CASE_WORKER_ACCOUNTS[0];
    document.getElementById("admin-email-input").value = role === "caseworker" ? selectedWorkerAccount.email : state.demoAdminEmail;
    document.getElementById("admin-password-input").value = "";
  }
  applyLanguage();
}

function setLoginView(view) {
  state.loginView = view;
  const showPhone = view === "phone";

  document.getElementById("phone-option-btn").classList.toggle("active", showPhone);
  document.getElementById("worker-option-btn").classList.toggle("active", !showPhone);
  document.getElementById("phone-login-form").classList.toggle("hidden", !showPhone);
  document.getElementById("worker-login-form").classList.toggle("hidden", showPhone);
  document.getElementById("login-error").textContent = "";
}

function formatDocumentLabel(value) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderDemoList(label, entries) {
  return `${label}: ${entries.map((entry) => `<span class="demo-line">${escapeHtml(entry)}</span>`).join("")}`;
}

async function fetchJson(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("SERVER_OFFLINE");
  }

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.status}`;

    try {
      const errorData = await response.json();
      if (errorData && typeof errorData.error === "string" && errorData.error.trim()) {
        errorMessage = errorData.error;
      }
    } catch (error) {
      // Ignore invalid JSON and keep the status-based fallback.
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

async function loadClientMessages(clientId, workerId = null) {
  try {
    const query = new URLSearchParams({ client_id: clientId });
    if (workerId) {
      query.set("worker_id", workerId);
    }
    const data = await fetchJson(`/api/messages?${query.toString()}`);
    state.caseWorkerData.messagesByClient[clientId] = data.messages || [];
  } catch (error) {
    state.caseWorkerData.messagesByClient[clientId] = [];
  }
}

function showServerOfflineMessage() {
  return "Server not running. Please start backend.";
}

function renderCountyMetrics() {
  const assignedCount = state.countyData.clients.filter((client) => client.status === "assigned").length;
  const openCount = state.countyData.clients.filter((client) => client.status !== "assigned").length;

  document.getElementById("county-users-number").textContent = String(systemData.total_users);
  document.getElementById("county-housed-number").textContent = String(assignedCount || systemData.completed);
  document.getElementById("county-apps-number").textContent = String(openCount || systemData.applications);

  const recommendedWorker = state.countyData.workers.find((worker) => worker.id === state.countyData.recommendedWorkerId);
  document.getElementById("county-recommended-worker").textContent = recommendedWorker
    ? recommendedWorker.name.split(" ")[0]
    : "-";
}

function renderWorkers() {
  const list = document.getElementById("worker-load-list");

  list.innerHTML = state.countyData.workers.map((worker) => {
    const isRecommended = worker.id === state.countyData.recommendedWorkerId;
    const loadState = worker.active_cases >= 7 ? "high" : worker.active_cases >= 5 ? "medium" : "low";

    return `
      <div class="worker-load-card ${isRecommended ? "recommended" : ""}">
        <div>
          <strong>${escapeHtml(worker.name)}</strong>
          <p class="small-text">Worker ID: ${escapeHtml(worker.id)}</p>
        </div>
        <div class="worker-load-meta">
          <span class="worker-load-badge ${loadState}">${worker.active_cases} active</span>
          ${isRecommended ? '<span class="worker-recommended-flag">Recommended</span>' : ""}
        </div>
      </div>
    `;
  }).join("");
}

function renderNotifications() {
  const list = document.getElementById("county-notification-list");

  list.innerHTML = state.countyData.notifications.map((item) => {
    const timestamp = new Date(item.timestamp);
    const formatted = Number.isNaN(timestamp.getTime())
      ? "Just now"
      : timestamp.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

    return `
      <div class="notification-card">
        <strong>${escapeHtml(item.message)}</strong>
        <span class="small-text">${escapeHtml(formatted)}</span>
      </div>
    `;
  }).join("");
}

function renderTransportRequests() {
  const list = document.getElementById("county-transport-request-list");

  list.innerHTML = state.countyData.transportRequests.length ? state.countyData.transportRequests.map((item) => {
    const timestamp = new Date(item.timestamp);
    const formatted = Number.isNaN(timestamp.getTime())
      ? "Just now"
      : timestamp.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

    return `
      <div class="notification-card">
        <strong>${escapeHtml(item.message)}</strong>
        <span class="small-text">${escapeHtml(formatted)}</span>
      </div>
    `;
  }).join("") : '<div class="county-empty-state">No transportation requests yet.</div>';
}

function renderClients() {
  const list = document.getElementById("client-request-list");
  const pendingCount = state.countyData.clients.filter((client) => client.status !== "assigned").length;
  document.getElementById("county-client-count").textContent = `${pendingCount} open`;
  const workerNameById = Object.fromEntries(state.countyData.workers.map((worker) => [worker.id, worker.name]));

  list.innerHTML = state.countyData.clients.map((client) => {
    const selectedWorkerId = client.assigned_worker || state.countyData.recommendedWorkerId || "";
    const workerOptions = state.countyData.workers.map((worker) => (
      `<option value="${escapeHtml(worker.id)}" ${worker.id === selectedWorkerId ? "selected" : ""}>${escapeHtml(worker.name)} (${worker.active_cases})</option>`
    )).join("");
    const tags = client.missing_documents.map((doc) => (
      `<span class="document-tag">${escapeHtml(formatDocumentLabel(doc))}</span>`
    )).join("");

    return `
      <article class="client-request-card">
        <div class="client-request-head">
          <div>
            <strong>${escapeHtml(client.name)}</strong>
            <p class="small-text">${escapeHtml(client.city)} • ${escapeHtml(client.id)}</p>
          </div>
          <span class="client-status-pill ${client.status}">${escapeHtml(client.status)}</span>
        </div>

        <div class="client-tag-row">${tags}</div>

        <div class="client-request-meta">
          <span class="transport-flag ${client.transportation_needed ? "needed" : "clear"}">
            ${client.transportation_needed ? "Transport needed" : "Transport clear"}
          </span>
          <span class="small-text">
            ${client.assigned_worker ? `Assigned to ${escapeHtml(workerNameById[client.assigned_worker] || client.assigned_worker)}` : "Not assigned yet"}
          </span>
        </div>

        <div class="assign-row">
          <select class="assign-worker-select" data-client-id="${escapeHtml(client.id)}">
            ${workerOptions}
          </select>
          <button class="secondary-btn assign-worker-btn" type="button" data-client-id="${escapeHtml(client.id)}">
            Assign
          </button>
        </div>
      </article>
    `;
  }).join("");

  list.querySelectorAll(".assign-worker-btn").forEach((button) => {
    button.addEventListener("click", () => {
      assignClient(button.dataset.clientId);
    });
  });
}

function renderCountyDashboard() {
  renderCountyMetrics();
  renderWorkers();
  renderNotifications();
  renderTransportRequests();
  renderClients();
}

async function loadCountyDashboard() {
  try {
    const [clientsData, workersData, notificationsData, transportRequestsData] = await Promise.all([
      fetchJson("/api/clients"),
      fetchJson("/api/workers"),
      fetchJson("/api/notifications"),
      fetchJson("/api/transport-requests")
    ]);

    state.countyData.clients = clientsData.clients;
    state.countyData.workers = workersData.workers;
    state.countyData.notifications = notificationsData.notifications;
    state.countyData.transportRequests = transportRequestsData.transport_requests;
    state.countyData.recommendedWorkerId =
      clientsData.recommended_worker_id || workersData.recommended_worker_id || null;

    renderCountyDashboard();
  } catch (error) {
    document.getElementById("client-request-list").innerHTML = `
      <div class="county-empty-state">
        ${showServerOfflineMessage()}
      </div>
    `;
    document.getElementById("worker-load-list").innerHTML = `
      <div class="county-empty-state">${showServerOfflineMessage()}</div>
    `;
    document.getElementById("county-notification-list").innerHTML = `
      <div class="county-empty-state">${showServerOfflineMessage()}</div>
    `;
    document.getElementById("county-transport-request-list").innerHTML = `
      <div class="county-empty-state">${showServerOfflineMessage()}</div>
    `;
    document.getElementById("ai-response").innerText = showServerOfflineMessage();
  }
}

async function submitTransportRequest(clientId) {
  try {
    await fetchJson("/api/transport-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        worker_id: state.caseWorkerData.currentWorkerId
      })
    });

    state.caseWorkerData.transportMessages[clientId] = "Transportation request sent to Passaic County";
    if (state.adminRole === "passaic") {
      await loadCountyDashboard();
    }
    renderCaseWorkerDashboard();
  } catch (error) {
    state.caseWorkerData.transportMessages[clientId] =
      error.message === "SERVER_OFFLINE" ? showServerOfflineMessage() : error.message;
    renderCaseWorkerDashboard();
  }
}

async function assignClient(clientId) {
  const select = document.querySelector(`.assign-worker-select[data-client-id="${clientId}"]`);
  if (!select) return;

  try {
    await fetchJson("/api/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        worker_id: select.value
      })
    });

    await loadCountyDashboard();
  } catch (error) {
    document.getElementById("ai-response").innerText =
      error.message === "SERVER_OFFLINE"
        ? showServerOfflineMessage()
        : "Assignment could not be completed. Please try again.";
  }
}

async function askAI() {
  const input = document.getElementById("ai-input");
  const responseBox = document.getElementById("ai-response");
  const question = input.value.trim();

  if (!question) return;

  try {
    const data = await fetchJson("/api/admin-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    responseBox.innerText = data.response;
  } catch (error) {
    responseBox.innerText =
      error.message === "SERVER_OFFLINE"
        ? showServerOfflineMessage()
        : "Most delays are happening at the State ID step. This is driven by appointments and transportation barriers. You should focus on faster scheduling and travel support.";
  }

  input.value = "";
}

function resetCodeEntry() {
  state.otpSent = false;
  document.getElementById("code-entry-block").classList.add("hidden");
  document.getElementById("code-input").value = "";
}

function generateDemoIdentity() {
  const defaultClient = DEMO_CLIENT_ACCOUNTS[0];

  state.demoUsername = defaultClient.username;
  state.demoPhone = defaultClient.phone;
  state.demoCode = "1234";

  document.getElementById("phone-input").value = state.demoPhone;
  document.getElementById("worker-username-input").value = state.demoUsername;
  document.getElementById("admin-email-input").value = state.demoAdminEmail;
}

// Keep login success separate from the screen implementation.
function showApp() {
  loadClientPortalChat();
  applyLanguage();
  openScreen("dashboard-screen");
}

function getClientAccountByPhone(phone) {
  return DEMO_CLIENT_ACCOUNTS.find((account) => account.phone === phone) || null;
}

function getClientAccountByUsername(username) {
  return DEMO_CLIENT_ACCOUNTS.find((account) => account.username === username) || null;
}

function getCurrentClientAccount() {
  return DEMO_CLIENT_ACCOUNTS.find((account) => account.clientId === state.clientPortalData.currentClientId) || null;
}

function getCurrentCaseWorkerAccount() {
  return CASE_WORKER_ACCOUNTS.find((account) => account.workerId === state.caseWorkerData.currentWorkerId) || null;
}

function getFirstName(name) {
  return name ? name.trim().split(/\s+/)[0] : "";
}

function renderClientPortalChat() {
  const client = state.caseWorkerData.clients.find((item) => item.id === state.clientPortalData.currentClientId);
  const messages = (state.caseWorkerData.messagesByClient[state.clientPortalData.currentClientId] || [])
    .filter((message) => (
      message.client_id === state.clientPortalData.currentClientId &&
      (!client?.assigned_worker || message.worker_id === client.assigned_worker)
    ));
  const isCompleted = client?.worker_status === "completed";
  const history = document.getElementById("client-chat-history");
  const status = document.getElementById("client-chat-status");
  const input = document.getElementById("client-chat-input");
  const send = document.getElementById("client-chat-send-btn");
  const note = document.getElementById("client-chat-note");

  history.innerHTML = messages.length ? messages.map((message) => `
    <div class="worker-chat-message ${message.sender}">
      <span class="worker-chat-sender">${message.sender === "worker" ? "Case Worker" : "You"}</span>
      <p>${escapeHtml(message.text)}</p>
    </div>
  `).join("") : '<div class="county-empty-state">No messages yet.</div>';

  status.textContent = isCompleted ? "🔒 Case Completed – Chat Closed" : "🟢 Case Active";
  status.classList.toggle("locked", isCompleted);
  status.classList.toggle("active", !isCompleted);
  input.disabled = Boolean(isCompleted);
  send.disabled = Boolean(isCompleted);
  input.placeholder = isCompleted ? "Case completed. Chat is closed." : "Type a message";
  note.textContent = isCompleted ? "Case completed. Chat is closed." : "";
}

async function loadClientPortalChat() {
  try {
    const clientsData = await fetchJson("/api/clients");
    state.caseWorkerData.clients = clientsData.clients;
    const currentClient = state.caseWorkerData.clients.find((item) => item.id === state.clientPortalData.currentClientId);

    await loadClientMessages(state.clientPortalData.currentClientId, currentClient?.assigned_worker || null);
    renderClientPortalChat();
  } catch (error) {
    document.getElementById("client-chat-history").innerHTML = `<div class="county-empty-state">${showServerOfflineMessage()}</div>`;
    document.getElementById("client-chat-note").textContent = showServerOfflineMessage();
  }
}

async function sendClientMessage() {
  const input = document.getElementById("client-chat-input");
  const clientId = state.clientPortalData.currentClientId;
  const client = state.caseWorkerData.clients.find((item) => item.id === clientId);

  if (!input || !client) return;
  if (!client.assigned_worker) {
    document.getElementById("client-chat-note").textContent = "No case worker is assigned to this case yet.";
    return;
  }
  if (client.worker_status === "completed") {
    renderClientPortalChat();
    return;
  }

  const text = input.value.trim();
  if (!text) return;

  try {
    state.caseWorkerData.chatNotices[clientId] = "";
    await fetchJson("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: state.clientPortalData.currentClientId,
        worker_id: client.assigned_worker,
        sender: "client",
        text
      })
    });
    input.value = "";
    await loadClientPortalChat();
  } catch (error) {
    document.getElementById("client-chat-note").textContent =
      error.message === "SERVER_OFFLINE" ? showServerOfflineMessage() : error.message;
  }
}

function renderAdminDashboard() {
  const list = document.getElementById("admin-case-list");
  if (list) {
    list.innerHTML = "";
  }
}

function getCurrentWorker() {
  return state.caseWorkerData.workers.find((worker) => worker.id === state.caseWorkerData.currentWorkerId) || null;
}

function isAssignedToCurrentWorker(client) {
  return client.assigned_worker === state.caseWorkerData.currentWorkerId;
}

function getPendingCases() {
  return state.caseWorkerData.clients.filter((client) => (
    isAssignedToCurrentWorker(client) && client.worker_status === "pending_approval"
  ));
}

function getCaseStatusLabel(client) {
  if (client.status === "completed") return "Completed";
  if (client.worker_status === "pending_approval" || client.status === "pending") return "Pending";
  return "Active";
}

function renderWorkerPendingList(clients) {
  const list = document.getElementById("worker-pending-list");

  if (!clients.length) {
    list.innerHTML = `<div class="county-empty-state">No new requests right now.</div>`;
    return;
  }

  list.innerHTML = clients.map((client) => `
    <article class="worker-client-card">
      <div class="worker-client-head">
        <div>
          <strong>${escapeHtml(client.name)}</strong>
          <p class="small-text">${escapeHtml(client.city)} • ${escapeHtml(client.id)}</p>
        </div>
        <span class="client-status-pill pending">Pending</span>
      </div>
      <div class="client-tag-row">
        ${client.missing_documents.map((doc) => `<span class="document-tag">${escapeHtml(formatDocumentLabel(doc))}</span>`).join("")}
      </div>
      <div class="worker-client-actions">
        <button class="secondary-btn worker-approve-btn accept" type="button" data-client-id="${escapeHtml(client.id)}">Accept Case</button>
        <button class="secondary-btn worker-approve-btn reject" type="button" data-client-id="${escapeHtml(client.id)}">Reject Case</button>
      </div>
    </article>
  `).join("");

  list.querySelectorAll(".worker-approve-btn.accept").forEach((button) => {
    button.addEventListener("click", () => {
      updateCaseApproval(button.dataset.clientId, "accept");
    });
  });

  list.querySelectorAll(".worker-approve-btn.reject").forEach((button) => {
    button.addEventListener("click", () => {
      updateCaseApproval(button.dataset.clientId, "reject");
    });
  });
}

function renderWorkerClientList(clients) {
  const list = document.getElementById("worker-case-list");

  if (!clients.length) {
    list.innerHTML = `<div class="county-empty-state">No active cases right now.</div>`;
    return;
  }

  list.innerHTML = clients.map((client) => `
    <article class="worker-client-card ${state.caseWorkerData.selectedClientId === client.id ? "selected" : ""}">
      <div class="worker-client-head">
        <div>
          <strong>${escapeHtml(client.name)}</strong>
          <p class="small-text">${escapeHtml(client.city)} • ${escapeHtml(client.id)}</p>
        </div>
        <span class="client-status-pill ${client.status === "completed" ? "completed" : "assigned"}">
          ${getCaseStatusLabel(client)}
        </span>
      </div>
      <div class="client-tag-row">
        ${client.missing_documents.map((doc) => `<span class="document-tag">${escapeHtml(formatDocumentLabel(doc))}</span>`).join("")}
      </div>
      <div class="worker-client-actions">
        <button class="secondary-btn worker-select-btn" type="button" data-client-id="${escapeHtml(client.id)}">Open</button>
      </div>
    </article>
  `).join("");

  list.querySelectorAll(".worker-select-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      await openCase(button.dataset.clientId);
    });
  });
}

function loadMyCases() {
  state.caseWorkerData.myCases = state.caseWorkerData.clients.filter((client) => (
    isAssignedToCurrentWorker(client) &&
    client.worker_status !== "pending_approval" &&
    client.worker_status !== "rejected"
  ));
  return state.caseWorkerData.myCases;
}

async function loadMessages(clientId) {
  await loadClientMessages(clientId, state.caseWorkerData.currentWorkerId);
  return state.caseWorkerData.messagesByClient[clientId] || [];
}

async function openCase(clientId) {
  state.caseWorkerData.selectedClientId = clientId;
  state.caseWorkerData.fullCaseViewId = clientId;
  await loadMessages(clientId);
  renderCaseWorkerDashboard();
}

function closeCaseFileView() {
  state.caseWorkerData.fullCaseViewId = null;
  renderCaseWorkerDashboard();
}

function renderHousingOpportunities() {
  const eligibleClients = state.caseWorkerData.clients.filter((client) => client.missing_documents.length === 0);
  document.getElementById("eligible-clients-count").textContent = `${eligibleClients.length} eligible`;
  document.getElementById("housing-opportunity-list").innerHTML = housingData.map((item) => `
    <div class="housing-opportunity-card">
      <strong>${escapeHtml(item.city)}</strong>
      <span class="small-text">${item.units} units</span>
    </div>
  `).join("");
}

function getDocumentStatus(client, documentKey) {
  if (client.missing_documents.includes(documentKey)) {
    if (documentKey === "ssn") return "⏳ In Progress";
    return "❌ Missing";
  }

  return "✅ Completed";
}

function getDocumentStatusClass(statusText) {
  if (statusText.includes("Completed")) return "completed";
  if (statusText.includes("In Progress")) return "progress";
  return "missing";
}

function toggleDocumentUploadPanel(clientId, documentKey) {
  const panelKey = `${clientId}:${documentKey}`;
  state.caseWorkerData.openUploadPanels[panelKey] = !state.caseWorkerData.openUploadPanels[panelKey];
  renderCaseWorkerDashboard();
}

function saveDocumentUpload(clientId, documentKey) {
  const input = document.getElementById(`upload-${clientId}-${documentKey}`);
  if (!input) return;

  const fileNames = Array.from(input.files || []).map((file) => file.name);
  state.caseWorkerData.documentUploads[`${clientId}:${documentKey}`] = fileNames;
  renderCaseWorkerDashboard();
}

function renderSelectedClientDetails() {
  const detail = document.getElementById("worker-client-detail");
  const selectedClient = state.caseWorkerData.clients.find((client) => client.id === state.caseWorkerData.selectedClientId);

  if (!selectedClient) {
    detail.innerHTML = `<div class="county-empty-state">Select a client to view details.</div>`;
    return;
  }

  const notes = state.caseWorkerData.notes[selectedClient.id] || "";
  const transportMessage = state.caseWorkerData.transportMessages[selectedClient.id] || "";
  const chatNotice = state.caseWorkerData.chatNotices[selectedClient.id] || "";
  const messages = (state.caseWorkerData.messagesByClient[selectedClient.id] || []).filter((message) => (
    message.client_id === selectedClient.id &&
    message.worker_id === state.caseWorkerData.currentWorkerId
  ));
  const isCompleted = selectedClient.worker_status === "completed";
  const chatLockedText = "Case completed. Chat is closed.";
  const chatStatusLabel = isCompleted ? "🔒 Case Completed – Chat Closed" : "🟢 Case Active";
  const isArchived = Boolean(state.caseWorkerData.archivedChats[selectedClient.id]);

  detail.innerHTML = `
    <div class="worker-detail-header">
      <div>
        <h3>${escapeHtml(selectedClient.name)}</h3>
        <p class="small-text">${escapeHtml(selectedClient.city)} • ${escapeHtml(selectedClient.id)}</p>
      </div>
      <span class="client-status-pill ${selectedClient.worker_status === "pending_approval" ? "pending" : "assigned"}">
        ${selectedClient.worker_status === "completed" ? "Completed" : (selectedClient.worker_status === "pending_approval" ? "Pending" : "Active")}
      </span>
    </div>

    <div class="document-tracker">
      <strong>📄 Document Tracker</strong>
      <div class="document-status-list">
        <div class="document-status-row"><span>Birth Certificate</span><span>${getDocumentStatus(selectedClient, "birth_certificate")}</span></div>
        <div class="document-status-row"><span>SSN</span><span>${getDocumentStatus(selectedClient, "ssn")}</span></div>
        <div class="document-status-row"><span>State ID</span><span>${getDocumentStatus(selectedClient, "state_id")}</span></div>
      </div>
    </div>

    <div class="worker-detail-block">
      <strong>🚗 Transportation Support</strong>
      <p class="small-text">Transportation Needed: ${selectedClient.transportation_needed ? "Yes" : "No"}</p>
      ${selectedClient.transportation_needed ? `
        <div class="worker-detail-actions">
          <a class="secondary-btn worker-link-btn" href="https://www.njtransit.com" target="_blank" rel="noreferrer">Open NJ Transit</a>
          <button class="secondary-btn worker-uber-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}">Request Uber (simulate)</button>
        </div>
        ${transportMessage ? `<p class="small-text worker-inline-message">${escapeHtml(transportMessage)}</p>` : ""}
      ` : `<p class="small-text worker-inline-message">No transportation support needed right now.</p>`}
    </div>

    <div class="worker-detail-block">
      <strong>📝 Notes</strong>
      <label for="worker-notes-input">Notes</label>
      <textarea id="worker-notes-input" rows="5" placeholder="Type notes here">${escapeHtml(notes)}</textarea>
      <button class="secondary-btn worker-save-notes-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}">Save Notes</button>
    </div>

    <div class="worker-detail-block">
      <div class="worker-chat-head">
        <strong>💬 Client Chat</strong>
        <span class="worker-chat-status ${isCompleted ? "locked" : "active"}">${chatStatusLabel}</span>
      </div>
      <div class="worker-chat-history">
        ${isArchived ? '<div class="county-empty-state">Chat archived. Full history remains saved for this client.</div>' : messages.length ? messages.map((message) => `
          <div class="worker-chat-message ${message.sender}">
            <span class="worker-chat-sender">${message.sender === "worker" ? "Case Worker" : "Client"}</span>
            <p>${escapeHtml(message.text)}</p>
          </div>
        `).join("") : '<div class="county-empty-state">No messages yet.</div>'}
      </div>
      <div class="worker-chat-compose">
        <input id="worker-chat-input" type="text" placeholder="${isCompleted ? chatLockedText : "Type a message"}" ${(isCompleted || isArchived) ? "disabled" : ""} />
        <button class="secondary-btn worker-chat-send-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}" ${(isCompleted || isArchived) ? "disabled" : ""}>Send</button>
      </div>
      ${chatNotice ? `<p class="small-text worker-inline-message">${escapeHtml(chatNotice)}</p>` : ""}
      ${isCompleted ? `<p class="small-text worker-inline-message">${chatLockedText}</p>` : ""}
      ${isCompleted && !isArchived ? `<button class="secondary-btn worker-archive-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}">Archive Chat</button>` : ""}
      ${isArchived ? `<button class="secondary-btn worker-reopen-chat-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}">Open Chat Again</button>` : ""}
      <button class="secondary-btn worker-complete-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}" ${isCompleted ? "disabled" : ""}>Mark Case Completed</button>
    </div>
  `;

  const saveButton = document.querySelector(".worker-save-notes-btn");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const textarea = document.getElementById("worker-notes-input");
      state.caseWorkerData.notes[selectedClient.id] = textarea.value;
      renderSelectedClientDetails();
    });
  }

  const uberButton = document.querySelector(".worker-uber-btn");
  if (uberButton) {
    uberButton.addEventListener("click", async () => {
      await submitTransportRequest(selectedClient.id);
    });
  }

  const sendButton = document.querySelector(".worker-chat-send-btn");
  if (sendButton) {
    sendButton.addEventListener("click", () => {
      sendMessage();
    });
  }

  const chatInput = document.getElementById("worker-chat-input");
  if (chatInput) {
    chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });
  }

  const notesInput = document.getElementById("worker-notes-input");
  if (notesInput) {
    notesInput.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        const textarea = document.getElementById("worker-notes-input");
        state.caseWorkerData.notes[selectedClient.id] = textarea.value;
        renderSelectedClientDetails();
      }
    });
  }

  const completeButton = document.querySelector(".worker-complete-btn");
  if (completeButton) {
    completeButton.addEventListener("click", () => {
      updateCaseApproval(selectedClient.id, "complete");
    });
  }

  const archiveButton = document.querySelector(".worker-archive-btn");
  if (archiveButton) {
    archiveButton.addEventListener("click", () => {
      state.caseWorkerData.archivedChats[selectedClient.id] = true;
      renderSelectedClientDetails();
    });
  }

  const reopenChatButton = document.querySelector(".worker-reopen-chat-btn");
  if (reopenChatButton) {
    reopenChatButton.addEventListener("click", () => {
      delete state.caseWorkerData.archivedChats[selectedClient.id];
      renderSelectedClientDetails();
    });
  }
}

function renderCaseFileView() {
  const container = document.getElementById("caseworker-full-view");
  const selectedClient = state.caseWorkerData.clients.find((client) => client.id === state.caseWorkerData.fullCaseViewId);

  if (!selectedClient) {
    container.innerHTML = `<div class="county-empty-state">Select a client to open the full file.</div>`;
    return;
  }

  const notes = state.caseWorkerData.notes[selectedClient.id] || "";
  const transportMessage = state.caseWorkerData.transportMessages[selectedClient.id] || "";
  const chatNotice = state.caseWorkerData.chatNotices[selectedClient.id] || "";
  const messages = (state.caseWorkerData.messagesByClient[selectedClient.id] || []).filter((message) => (
    message.client_id === selectedClient.id &&
    message.worker_id === state.caseWorkerData.currentWorkerId
  ));
  const isCompleted = selectedClient.worker_status === "completed";
  const isArchived = Boolean(state.caseWorkerData.archivedChats[selectedClient.id]);
  const chatLockedText = "Case completed. Chat is closed.";
  const chatStatusLabel = isCompleted ? "🔒 Case Completed – Chat Closed" : "🟢 Case Active";
  const documentCards = [
    { key: "birth_certificate", title: "Birth Certificate", art: "birth-art" },
    { key: "ssn", title: "SSN", art: "ssn-art" },
    { key: "state_id", title: "State ID", art: "id-art" },
    { key: "passport", title: "Passport", art: "passport-art" }
  ];

  container.innerHTML = `
    <div class="caseworker-file-shell">
      <div class="screen-top-row caseworker-file-top">
        <button class="back-link-btn screen-back-btn" type="button" id="caseworker-file-back-btn">Go Back</button>
      </div>

      <div class="caseworker-file-hero">
        <div>
          <p class="eyebrow">Client file</p>
          <h2>${escapeHtml(selectedClient.name)}</h2>
          <p class="small-text">${escapeHtml(selectedClient.city)} • ${escapeHtml(selectedClient.id)}</p>
        </div>
        <div class="caseworker-file-meta">
          <span class="client-status-pill ${selectedClient.worker_status === "completed" ? "completed" : (selectedClient.worker_status === "pending_approval" ? "pending" : "assigned")}">
            ${selectedClient.worker_status === "completed" ? "Completed" : (selectedClient.worker_status === "pending_approval" ? "Pending" : "Active")}
          </span>
          <span class="worker-chat-status ${isCompleted ? "locked" : "active"}">${chatStatusLabel}</span>
        </div>
      </div>

      <div class="caseworker-file-grid">
        <div class="caseworker-file-main">
          <div class="caseworker-panel">
            <div class="county-section-head">
              <div>
                <strong>📁 Full Client File</strong>
                <p class="small-text">View all document areas and open upload only when needed.</p>
              </div>
            </div>

            <div class="worker-document-card-grid">
              ${documentCards.map((item) => {
                const status = getDocumentStatus(selectedClient, item.key);
                const statusClass = getDocumentStatusClass(status);
                const panelKey = `${selectedClient.id}:${item.key}`;
                const uploads = state.caseWorkerData.documentUploads[panelKey] || [];
                const isOpen = Boolean(state.caseWorkerData.openUploadPanels[panelKey]);

                return `
                  <div class="worker-document-card">
                    <div class="worker-document-top">
                      <span class="doc-art ${item.art}" aria-hidden="true"></span>
                      <div>
                        <strong>${item.title}</strong>
                        <p class="small-text">Status: <span class="document-status-pill ${statusClass}">${status}</span></p>
                      </div>
                    </div>
                    <div class="worker-document-actions">
                      <button class="secondary-btn worker-upload-toggle-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}" data-document-key="${item.key}">
                        ${isOpen ? "Hide Upload" : "Open Upload"}
                      </button>
                    </div>
                    ${isOpen ? `
                      <div class="worker-upload-panel">
                        <label for="upload-${selectedClient.id}-${item.key}">Upload ${item.title}</label>
                        <input id="upload-${selectedClient.id}-${item.key}" type="file" />
                        <button class="secondary-btn worker-save-upload-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}" data-document-key="${item.key}">Save File</button>
                        <p class="small-text worker-inline-message">${uploads.length ? `Saved: ${escapeHtml(uploads.join(", "))}` : "No file saved yet."}</p>
                      </div>
                    ` : ""}
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <div class="caseworker-panel">
            <div class="worker-chat-head">
              <strong>💬 Chat With Client</strong>
              <span class="worker-chat-status ${isCompleted ? "locked" : "active"}">${chatStatusLabel}</span>
            </div>
            <div class="worker-chat-history">
              ${isArchived ? '<div class="county-empty-state">Chat archived. Full history remains saved for this client.</div>' : messages.length ? messages.map((message) => `
                <div class="worker-chat-message ${message.sender}">
                  <span class="worker-chat-sender">${message.sender === "worker" ? "Case Worker" : "Client"}</span>
                  <p>${escapeHtml(message.text)}</p>
                </div>
              `).join("") : '<div class="county-empty-state">No messages yet.</div>'}
            </div>
            <div class="worker-chat-compose">
              <input id="worker-chat-input" type="text" placeholder="${isCompleted ? chatLockedText : "Type a message"}" ${(isCompleted || isArchived) ? "disabled" : ""} />
              <button class="secondary-btn worker-chat-send-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}" ${(isCompleted || isArchived) ? "disabled" : ""}>Send</button>
            </div>
            ${chatNotice ? `<p class="small-text worker-inline-message">${escapeHtml(chatNotice)}</p>` : ""}
            ${isCompleted ? `<p class="small-text worker-inline-message">${chatLockedText}</p>` : ""}
            ${isCompleted && !isArchived ? `<button class="secondary-btn worker-archive-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}">Archive Chat</button>` : ""}
            ${isArchived ? `<button class="secondary-btn worker-reopen-chat-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}">Open Chat Again</button>` : ""}
            <button class="secondary-btn worker-complete-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}" ${isCompleted ? "disabled" : ""}>Mark Case Completed</button>
          </div>
        </div>

        <aside class="caseworker-file-side">
          <div class="caseworker-panel">
            <strong>🚗 Transportation Support</strong>
            <p class="small-text">Transportation Needed: ${selectedClient.transportation_needed ? "Yes" : "No"}</p>
            ${selectedClient.transportation_needed ? `
              <div class="worker-detail-actions">
                <a class="secondary-btn worker-link-btn" href="https://www.njtransit.com" target="_blank" rel="noreferrer">Open NJ Transit</a>
                <button class="secondary-btn worker-uber-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}">Request Uber (simulate)</button>
              </div>
              ${transportMessage ? `<p class="small-text worker-inline-message">${escapeHtml(transportMessage)}</p>` : ""}
            ` : `<p class="small-text worker-inline-message">No transportation support needed right now.</p>`}
          </div>

          <div class="caseworker-panel">
            <strong>📝 Notes</strong>
            <label for="worker-notes-input">Notes</label>
            <textarea id="worker-notes-input" rows="6" placeholder="Type notes here">${escapeHtml(notes)}</textarea>
            <button class="secondary-btn worker-save-notes-btn" type="button" data-client-id="${escapeHtml(selectedClient.id)}">Save Notes</button>
          </div>
        </aside>
      </div>
    </div>
  `;

  document.getElementById("caseworker-file-back-btn").addEventListener("click", () => {
    closeCaseFileView();
  });

  container.querySelectorAll(".worker-upload-toggle-btn").forEach((button) => {
    button.addEventListener("click", () => {
      toggleDocumentUploadPanel(button.dataset.clientId, button.dataset.documentKey);
    });
  });

  container.querySelectorAll(".worker-save-upload-btn").forEach((button) => {
    button.addEventListener("click", () => {
      saveDocumentUpload(button.dataset.clientId, button.dataset.documentKey);
    });
  });

  const saveButton = container.querySelector(".worker-save-notes-btn");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const textarea = document.getElementById("worker-notes-input");
      state.caseWorkerData.notes[selectedClient.id] = textarea.value;
      renderCaseWorkerDashboard();
    });
  }

  const uberButton = container.querySelector(".worker-uber-btn");
  if (uberButton) {
    uberButton.addEventListener("click", async () => {
      await submitTransportRequest(selectedClient.id);
    });
  }

  const sendButton = container.querySelector(".worker-chat-send-btn");
  if (sendButton) {
    sendButton.addEventListener("click", () => {
      sendMessage();
    });
  }

  const chatInput = document.getElementById("worker-chat-input");
  if (chatInput) {
    chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });
  }

  const notesInput = document.getElementById("worker-notes-input");
  if (notesInput) {
    notesInput.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        state.caseWorkerData.notes[selectedClient.id] = notesInput.value;
        renderCaseWorkerDashboard();
      }
    });
  }

  const completeButton = container.querySelector(".worker-complete-btn");
  if (completeButton) {
    completeButton.addEventListener("click", () => {
      updateCaseApproval(selectedClient.id, "complete");
    });
  }

  const archiveButton = container.querySelector(".worker-archive-btn");
  if (archiveButton) {
    archiveButton.addEventListener("click", () => {
      state.caseWorkerData.archivedChats[selectedClient.id] = true;
      renderCaseWorkerDashboard();
    });
  }

  const reopenChatButton = container.querySelector(".worker-reopen-chat-btn");
  if (reopenChatButton) {
    reopenChatButton.addEventListener("click", () => {
      delete state.caseWorkerData.archivedChats[selectedClient.id];
      renderCaseWorkerDashboard();
    });
  }
}

function renderCaseWorkerDashboard() {
  const pendingCases = getPendingCases();
  const myCases = loadMyCases();
  const currentWorker = getCurrentWorker();
  const grid = document.getElementById("caseworker-system-grid");
  const fullView = document.getElementById("caseworker-full-view");

  document.getElementById("worker-pending-count").textContent = `${pendingCases.length} requests`;
  document.getElementById("worker-case-count").textContent = `${myCases.length} cases`;

  if (!state.caseWorkerData.selectedClientId) {
    const firstClient = myCases[0];
    state.caseWorkerData.selectedClientId = firstClient ? firstClient.id : null;
  }

  if (currentWorker) {
    document.getElementById("admin-role-title").textContent = currentWorker.name;
    document.getElementById("admin-role-subtitle").textContent = `${currentWorker.active_cases} active cases`;
  }

  if (state.caseWorkerData.fullCaseViewId) {
    grid.classList.add("hidden");
    fullView.classList.remove("hidden");
    renderCaseFileView();
  } else {
    fullView.classList.add("hidden");
    grid.classList.remove("hidden");
    renderWorkerPendingList(pendingCases);
    renderWorkerClientList(myCases);
    renderSelectedClientDetails();
    renderHousingOpportunities();
  }
}

async function loadCaseWorkerDashboard() {
  try {
    const [clientsData, workersData] = await Promise.all([
      fetchJson("/api/clients"),
      fetchJson("/api/workers")
    ]);

    state.caseWorkerData.clients = clientsData.clients;
    state.caseWorkerData.workers = workersData.workers;

    const selectedStillExists = state.caseWorkerData.clients.some((client) => client.id === state.caseWorkerData.selectedClientId);
    if (!selectedStillExists) {
      state.caseWorkerData.selectedClientId = null;
    }

    const myCases = loadMyCases();
    if (!state.caseWorkerData.selectedClientId && myCases.length) {
      state.caseWorkerData.selectedClientId = myCases[0].id;
    }

    if (state.caseWorkerData.selectedClientId) {
      await loadMessages(state.caseWorkerData.selectedClientId);
    }

    applyLanguage();
    renderCaseWorkerDashboard();
  } catch (error) {
    document.getElementById("worker-case-list").innerHTML = `<div class="county-empty-state">${showServerOfflineMessage()}</div>`;
    document.getElementById("worker-client-detail").innerHTML = `<div class="county-empty-state">${showServerOfflineMessage()}</div>`;
  }
}

async function updateCaseApproval(clientId, action) {
  try {
    await fetchJson("/api/case-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        worker_id: state.caseWorkerData.currentWorkerId,
        action
      })
    });

    await loadCaseWorkerDashboard();
  } catch (error) {
    document.getElementById("worker-client-detail").innerHTML = `<div class="county-empty-state">${showServerOfflineMessage()}</div>`;
  }
}

async function sendWorkerMessage(clientId) {
  const selectedClient = state.caseWorkerData.clients.find((client) => client.id === clientId);
  const input = document.getElementById("worker-chat-input");
  if (!selectedClient || !input) return;

  if (selectedClient.worker_status === "completed") {
    input.disabled = true;
    const sendButton = document.querySelector(".worker-chat-send-btn");
    if (sendButton) sendButton.disabled = true;
    document.getElementById("worker-client-detail").querySelector(".worker-inline-message:last-of-type")?.remove();
    renderSelectedClientDetails();
    return;
  }

  const text = input.value.trim();
  if (!text) return;

  try {
    await fetchJson("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        worker_id: state.caseWorkerData.currentWorkerId,
        sender: "worker",
        text
      })
    });

    input.value = "";
    await loadMessages(clientId);
    renderSelectedClientDetails();
  } catch (error) {
    if (error.message === "SERVER_OFFLINE") {
      document.getElementById("worker-client-detail").innerHTML = `<div class="county-empty-state">${showServerOfflineMessage()}</div>`;
    } else {
      state.caseWorkerData.chatNotices[clientId] = error.message;
      renderSelectedClientDetails();
    }
  }
}

async function sendMessage() {
  const selectedClient = state.caseWorkerData.clients.find((client) => client.id === state.caseWorkerData.selectedClientId);
  if (!selectedClient) return;
  await sendWorkerMessage(selectedClient.id);
}

function showQuestionScreen() {
  document.getElementById("plan-error-box").textContent = "";
  openScreen("questions-screen");
}

function showResultScreen() {
  openScreen("result-screen");
}

function startOver() {
  state.answers.hasBirth = null;
  state.answers.hasSSN = null;
  state.answers.hasID = null;

  document.querySelectorAll(".choice-btn").forEach((button) => {
    if (button.closest("[data-group]")) {
      button.classList.remove("active");
    }
  });

  document.getElementById("plan-steps").innerHTML = "";
  document.getElementById("transport-btn").classList.add("hidden");
  document.getElementById("plan-error-box").textContent = "";
  openScreen("questions-screen");
}

function attachChoiceHandlers() {
  document.querySelectorAll(".choice-row").forEach((row) => {
    const key = row.dataset.group;
    if (!key) return;

    row.querySelectorAll(".choice-btn").forEach((button) => {
      button.addEventListener("click", () => {
        state.answers[key] = button.dataset.value === "true";
        row.querySelectorAll(".choice-btn").forEach((innerBtn) => innerBtn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  });
}

async function showPlan() {
  const errorBox = document.getElementById("plan-error-box");
  errorBox.textContent = "";

  if (
    state.answers.hasBirth === null ||
    state.answers.hasSSN === null ||
    state.answers.hasID === null
  ) {
    errorBox.textContent = uiText[state.lang].planError;
    return;
  }

  const birthState = document.getElementById("birth-state").value;
  const birthCity = document.getElementById("birth-city").value;
  const currentCity = document.getElementById("current-city").value;
  const birthPlace = `${birthCity}, ${birthState}`;

  const plan = generatePlan(state.answers, birthPlace, currentCity);
  const translatedSteps = [];

  for (const step of plan.steps) {
    translatedSteps.push(await translateText(step, state.lang));
  }

  const list = document.getElementById("plan-steps");
  list.innerHTML = "";

  translatedSteps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    list.appendChild(li);
  });

  const transportButton = document.getElementById("transport-btn");
  transportButton.classList.toggle("hidden", !plan.transportation_needed);
  transportButton.onclick = () => {
    window.location.href = "https://www.njtransit.com";
  };

  showResultScreen();
}

function addChatMessage(role, text) {
  const body = document.getElementById("chat-body");
  const msg = document.createElement("div");
  msg.className = `chat-msg ${role}`;
  msg.textContent = text;
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
}

function getBotReply(userTextRaw) {
  const userText = userTextRaw.toLowerCase();

  if (userText.includes("login") || userText.includes("sign")) {
    return "Use phone login first. If needed, staff can use username login.";
  }

  if (userText.includes("birth") || userText.includes("acta")) {
    return "If you do not have a birth certificate, your plan will tell you to visit Vital Records and request a copy.";
  }

  if (userText.includes("ssn") || userText.includes("social")) {
    return "If you need a Social Security card, your plan will point you to the SSA office.";
  }

  if (userText.includes("id") || userText.includes("dmv") || userText.includes("mvc")) {
    return "If you need a State ID, your plan will direct you to the DMV or MVC and list the needed steps.";
  }

  if (userText.includes("bus") || userText.includes("ride") || userText.includes("transport")) {
    return "Use the transportation button in your plan if you need travel help.";
  }

  return uiText.en.helpMessageDefault;
}

function openHelpChat() {
  const panel = document.getElementById("help-chat-panel");
  panel.classList.remove("hidden");
  panel.hidden = false;

  const body = document.getElementById("chat-body");
  if (!body.dataset.hasWelcome) {
    body.dataset.hasWelcome = "true";
    addChatMessage("bot", uiText[state.lang].helpWelcome);
  }
}

function closeHelpChat() {
  const panel = document.getElementById("help-chat-panel");
  panel.classList.add("hidden");
  panel.hidden = true;
}

async function handleUserChat() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  addChatMessage("user", text);
  input.value = "";

  const rawReply = getBotReply(text);
  const finalReply = state.lang === "en" ? rawReply : await translateText(rawReply, state.lang);
  addChatMessage("bot", finalReply);
}

function bindEvents() {
  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.lang;
      applyLanguage();
    });
  });

  document.getElementById("phone-option-btn").addEventListener("click", () => {
    setLoginView("phone");
  });

  document.getElementById("worker-option-btn").addEventListener("click", () => {
    setLoginView("worker");
  });

  const adminPortalBtn = document.getElementById("admin-portal-btn");
  if (adminPortalBtn) {
    adminPortalBtn.addEventListener("click", () => {
      setAuthView("admin");
      setAdminRole("caseworker");
      document.getElementById("admin-email-input").focus();
    });
  }

  document.getElementById("admin-login-back-btn").addEventListener("click", () => {
    setAuthView("user");
    setLoginView("phone");
  });

  document.getElementById("caseworker-role-btn").addEventListener("click", () => {
    setAdminRole("caseworker");
  });

  document.getElementById("passaic-role-btn").addEventListener("click", () => {
    setAdminRole("passaic");
  });

  document.getElementById("send-code-btn").addEventListener("click", () => {
    const t = uiText[state.lang];
    const phone = document.getElementById("phone-input").value.trim();
    const clientAccount = getClientAccountByPhone(phone);

    if (!clientAccount) {
      document.getElementById("login-error").textContent = t.phoneError;
      return;
    }

    // Demo-only OTP flow with no backend.
    state.otpSent = true;
    state.clientPortalData.currentClientId = clientAccount.clientId;
    document.getElementById("code-entry-block").classList.remove("hidden");
    document.getElementById("login-error").textContent = `${t.codeSent} ${state.demoCode}`;
    document.getElementById("code-demo-note").textContent = `${t.demoCode}: ${state.demoCode}`;
    document.getElementById("code-input").focus();
  });

  document.getElementById("phone-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("send-code-btn").click();
    }
  });

  document.getElementById("verify-code-btn").addEventListener("click", () => {
    const t = uiText[state.lang];
    const code = document.getElementById("code-input").value.trim();

    if (!state.otpSent || !/^\d{4}$/.test(code)) {
      document.getElementById("login-error").textContent = t.codeError;
      return;
    }

    showApp();
  });

  document.getElementById("code-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("verify-code-btn").click();
    }
  });

  document.getElementById("worker-login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const t = uiText[state.lang];
    const username = document.getElementById("worker-username-input").value.trim();
    const password = document.getElementById("worker-password-input").value.trim();
    const clientAccount = getClientAccountByUsername(username);

    if (
      !clientAccount ||
      password !== clientAccount.password
    ) {
      document.getElementById("login-error").textContent = t.workerError;
      return;
    }

    state.clientPortalData.currentClientId = clientAccount.clientId;
    showApp();
  });

  document.getElementById("admin-login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const t = uiText[state.lang];
    const email = document.getElementById("admin-email-input").value.trim();
    const password = document.getElementById("admin-password-input").value.trim();
    let workerAccount = null;

    if (state.adminRole === "caseworker") {
      workerAccount = CASE_WORKER_ACCOUNTS.find((account) => account.email === email && account.password === password) || null;
      if (!workerAccount) {
        document.getElementById("login-error").textContent = t.adminError;
        return;
      }
      state.caseWorkerData.currentWorkerId = workerAccount.workerId;
    } else if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      document.getElementById("login-error").textContent = t.adminError;
      return;
    }

    if (state.adminRole === "caseworker") {
      await loadCaseWorkerDashboard();
    }
    if (state.adminRole === "passaic") {
      await loadCountyDashboard();
    }
    openScreen("admin-dashboard-screen");
  });

  document.querySelectorAll(".doc-card").forEach((card) => {
    card.addEventListener("click", () => {
      showQuestionScreen();
    });
  });

  document.getElementById("dashboard-continue-btn").addEventListener("click", () => {
    showQuestionScreen();
  });

  document.getElementById("dashboard-back-btn").addEventListener("click", () => {
    openScreen("login-screen");
  });

  document.getElementById("admin-dashboard-back-btn").addEventListener("click", () => {
    openScreen("login-screen");
  });

  document.getElementById("questions-back-btn").addEventListener("click", () => {
    openScreen("dashboard-screen");
  });

  document.getElementById("result-back-btn").addEventListener("click", () => {
    showQuestionScreen();
  });

  document.getElementById("plan-btn").addEventListener("click", showPlan);
  document.getElementById("start-over-btn").addEventListener("click", startOver);
  document.getElementById("help-float-btn").addEventListener("click", openHelpChat);
  document.getElementById("chat-close-btn").addEventListener("click", closeHelpChat);
  document.getElementById("chat-send-btn").addEventListener("click", handleUserChat);
  document.getElementById("chat-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleUserChat();
    }
  });

  document.getElementById("ai-ask-btn").addEventListener("click", askAI);
  document.getElementById("ai-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      askAI();
    }
  });

  document.getElementById("client-chat-send-btn").addEventListener("click", sendClientMessage);
  document.getElementById("client-chat-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendClientMessage();
    }
  });

  document.getElementById("county-refresh-btn").addEventListener("click", () => {
    loadCountyDashboard();
  });
}

setupLocationDropdowns();
attachChoiceHandlers();
bindEvents();
generateDemoIdentity();
resetCodeEntry();
setAuthView("user");
setAdminRole("caseworker");
setLoginView("phone");
applyLanguage();
openScreen("login-screen");
