const state = {
  lang: "en",
  authView: "user",
  loginView: "phone",
  createAccountMode: "phone",
  adminRole: "caseworker",
  otpSent: false,
  pendingPhoneNumber: "",
  countyData: {
    clients: [],
    workers: [],
    notifications: [],
    transportRequests: [],
    recommendedWorkerId: null,
    highlightNotificationId: null,
    refreshIntervalId: null,
    isLoading: false,
    isAiPanelOpen: false,
    selectedWorkerId: null
  },
  adminDemoWorkers: [],
  adminSelectedDemoWorkerId: "",
  clientPortalData: {
    currentClientId: null,
    currentUser: null,
    serviceRecommendations: {},
    notifications: [],
    unreadNotificationCount: 0,
    deliveryMethod: "in_app",
    deliveryTarget: "",
    pendingImage: null,
    documents: [],
    selectedDocumentType: null,
    pendingDocumentByType: {},
    chatRefreshIntervalId: null,
    notificationRefreshIntervalId: null,
    isChatPanelOpen: false,
    isNotificationPanelOpen: false,
    showWorkerProfile: true
  },
  caseWorkerData: {
    currentWorkerId: "WK-03",
    workers: [],
    clients: [],
    notifications: [],
    myCases: [],
    selectedClientId: null,
    fullCaseViewId: null,
    messagesByClient: {},
    archivedChats: {},
    chatNotices: {},
    notes: {},
    transportMessages: {},
    documentUploads: {},
    documents: [],
    pendingDocumentByType: {},
    openUploadPanels: {},
    pendingChatImage: null,
    activeWorkspacePanel: null,
    showChatImagesOnly: false
  },
  answers: {
    hasBirth: null,
    hasSSN: null,
    hasID: null
  },
  sameAsBirthLocation: false,
  lastPlan: null
};

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

const DOCUMENT_TYPES = [
  { key: "passport", labelKey: "docPassportTitle", fallback: "Passport" },
  { key: "ssn", labelKey: "docSsnTitle", fallback: "SSN" },
  { key: "state_id", labelKey: "docIdTitle", fallback: "State ID" },
  { key: "birth_certificate", labelKey: "docBirthTitle", fallback: "Birth Certificate" }
];

const NJ_BIRTH_CERTIFICATE_URL = "https://www.nj.gov/health/vital/order-vital/";
const SSA_CARD_URL = "https://www.ssa.gov/number-card";
const NJ_MVC_URL = "https://www.nj.gov/mvc/license/non-driverid.htm";
const DEFAULT_DEMO_CASEWORKERS = [
  { workerId: "WK-01", name: "Sarah Ahmed", email: "sarah.ahmed@idhelp.org" },
  { workerId: "WK-02", name: "Daniel Kim", email: "daniel.kim@idhelp.org" },
  { workerId: "WK-03", name: "Priya Shah", email: "priya.shah@idhelp.org" },
  { workerId: "WK-04", name: "Marcus Hill", email: "marcus.hill@idhelp.org" }
];

const uiText = {
  en: {
    adminPortal: "Admin Portal",
    adminBack: "Back to login",
    adminMark: "Admin Login",
    adminEyebrow: "Staff access",
    adminTitle: "Admin sign in",
    adminSubtitle: "Use your staff email and password to open the staff dashboard.",
    adminRoleCaseworker: "Case Worker",
    adminRolePassaic: "Passaic County",
    adminEmail: "Email",
    adminPassword: "Password",
    adminLogin: "Login",
    adminError: "Wrong email or password",
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
    loginSubtitle: "Use your phone or email to enter the housing portal.",
    phoneOption: "Phone Login",
    workerOption: "Email Login",
    phone: "Enter your phone number",
    sendCode: "Send Code",
    code: "Enter code",
    verifyCode: "Verify Code",
    codeSent: "OTP sent. Check the server console and enter the 4-digit code.",
    phoneError: "Enter your phone number.",
    phoneCreateFirst: "Create account first.",
    codeError: "Enter the 4-digit OTP code.",
    otpInvalid: "The OTP code is incorrect.",
    otpExpired: "The OTP code expired. Request a new one.",
    workerUsername: "Email",
    workerPassword: "Password",
    workerPasswordWrong: "Wrong password.",
    createAccountToggle: "Create your account",
    createAccountScreenEyebrow: "Create account",
    createAccountScreenTitle: "Set up your housing portal account",
    createAccountScreenSubtitle: "Create a phone account for OTP login or an email account with password.",
    createAccountBack: "Go Back",
    createAccountPhoneMode: "Phone Account",
    createAccountEmailMode: "Email Account",
    createAccountName: "Full name",
    createAccountPhone: "Phone number",
    createAccountEmail: "Email",
    createAccountPassword: "Create password",
    createAccountRequestWorker: "Request a case worker",
    createAccountSubmit: "Create Account",
    createAccountNamePlaceholder: "Jordan Lee",
    createAccountPhonePlaceholder: "(973) 555-0100",
    createAccountEmailPlaceholder: "name@example.com",
    createAccountPasswordPlaceholder: "Create password",
    createAccountPhoneSuccess: "Phone account created. You can now log in with your phone number.",
    createAccountEmailSuccess: "Email account created. You can now log in with your email and password.",
    createAccountSuccessRequested: "Account created and your case worker request was sent to Passaic County.",
    createAccountPhoneExists: "That phone number is already in use.",
    createAccountEmailExists: "That email is already in use.",
    createAccountErrorPhone: "Enter your name and phone number.",
    createAccountErrorEmail: "Enter your name, email, and password.",
    countyAiButton: "AI Chat Bot",
    countyAiTitle: "AI Chat Bot",
    countyAiSubtitle: "Ask about county workload, delays, assignments, or trends.",
    countyAiPlaceholder: "Ask about system...",
    countyAiAsk: "Ask",
    workerLogin: "Login",
    workerError: "Create account first.",
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
    dashboardNote: "Need to update your answers? Edit your intake any time.",
    dashboardContinue: "Edit Intake",
    select: "Select",
    mainTitle: "Edit your intake",
    mainSubtitle: "Review and update your answers.",
    qBirth: "Do you have a birth certificate?",
    qSSN: "Do you have a Social Security card?",
    qID: "Do you have a State ID?",
    qBorn: "Where were you born?",
    qNow: "Current location",
    sameAsBorn: "Same as birthplace",
    selectState: "Select a state",
    selectCounty: "Select a county",
    selectCity: "Select a city",
    yes: "Yes",
    no: "No",
    getPlan: "Save Intake",
    yourPlan: "Your intake summary",
    transport: "Get Transportation Help",
    startOver: "Start over",
    helpButton: "Need Help?",
    helpTitle: "Need Help?",
    helpPlaceholder: "Ask a basic question",
    helpSend: "Send",
    helpWelcome: "Hi. I can help with login, documents, transportation, and basic housing portal questions.",
    helpMessageDefault: "I can help with login, birth certificate, Social Security card, State ID, and transportation questions.",
    planError: "Please answer all 3 yes/no questions.",
    locationError: "Please select a state, county, and city for both birthplace and current location."
  },
  es: {
    adminPortal: "Portal Admin",
    adminBack: "Volver al inicio",
    adminMark: "Ingreso admin",
    adminEyebrow: "Acceso del personal",
    adminTitle: "Ingreso de admin",
    adminSubtitle: "Use su correo del personal y su contrasena para abrir el panel del personal.",
    adminRoleCaseworker: "Trabajador social",
    adminRolePassaic: "Passaic County",
    adminEmail: "Correo",
    adminPassword: "Contrasena",
    adminLogin: "Entrar",
    adminError: "Correo o contrasena incorrectos",
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
    loginSubtitle: "Use su telefono o correo para entrar al portal de vivienda.",
    phoneOption: "Ingreso con telefono",
    workerOption: "Ingreso con correo",
    phone: "Ingrese su numero de telefono",
    sendCode: "Enviar codigo",
    code: "Ingrese el codigo",
    verifyCode: "Verificar codigo",
    codeSent: "OTP enviado. Revise la consola del servidor e ingrese el codigo de 4 digitos.",
    phoneError: "Ingrese su numero de telefono.",
    phoneCreateFirst: "Primero cree una cuenta.",
    codeError: "Ingrese el codigo OTP de 4 digitos.",
    otpInvalid: "El codigo OTP es incorrecto.",
    otpExpired: "El codigo OTP vencio. Solicite uno nuevo.",
    workerUsername: "Correo",
    workerPassword: "Contrasena",
    workerPasswordWrong: "Contrasena incorrecta.",
    createAccountToggle: "Crear su cuenta",
    createAccountScreenEyebrow: "Crear cuenta",
    createAccountScreenTitle: "Cree su cuenta del portal de vivienda",
    createAccountScreenSubtitle: "Cree una cuenta con telefono para OTP o una cuenta con correo y contrasena.",
    createAccountBack: "Volver",
    createAccountPhoneMode: "Cuenta con telefono",
    createAccountEmailMode: "Cuenta con correo",
    createAccountName: "Nombre completo",
    createAccountPhone: "Numero de telefono",
    createAccountEmail: "Correo",
    createAccountPassword: "Crear contrasena",
    createAccountRequestWorker: "Solicitar un trabajador social",
    createAccountSubmit: "Crear cuenta",
    createAccountNamePlaceholder: "Jordan Lee",
    createAccountPhonePlaceholder: "(973) 555-0100",
    createAccountEmailPlaceholder: "nombre@ejemplo.com",
    createAccountPasswordPlaceholder: "Crear contrasena",
    createAccountPhoneSuccess: "Cuenta con telefono creada. Ya puede entrar con su numero.",
    createAccountEmailSuccess: "Cuenta con correo creada. Ya puede entrar con su correo y contrasena.",
    createAccountSuccessRequested: "Cuenta creada y su solicitud de trabajador social fue enviada a Passaic County.",
    createAccountPhoneExists: "Ese numero de telefono ya esta en uso.",
    createAccountEmailExists: "Ese correo ya esta en uso.",
    createAccountErrorPhone: "Ingrese su nombre y numero de telefono.",
    createAccountErrorEmail: "Ingrese su nombre, correo y contrasena.",
    countyAiButton: "Chat Bot IA",
    countyAiTitle: "Chat Bot IA",
    countyAiSubtitle: "Pregunte sobre carga del condado, demoras, asignaciones o tendencias.",
    countyAiPlaceholder: "Pregunte sobre el sistema...",
    countyAiAsk: "Preguntar",
    workerLogin: "Entrar",
    workerError: "Primero cree una cuenta.",
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
    dashboardNote: "Necesita actualizar sus respuestas? Puede editar su ingreso cuando quiera.",
    dashboardContinue: "Editar ingreso",
    select: "Seleccione",
    mainTitle: "Edite su ingreso",
    mainSubtitle: "Revise y actualice sus respuestas.",
    qBirth: "Tiene acta de nacimiento?",
    qSSN: "Tiene tarjeta de Seguro Social?",
    qID: "Tiene ID estatal?",
    qBorn: "Donde nacio?",
    qNow: "Ubicacion actual",
    sameAsBorn: "Igual que lugar de nacimiento",
    selectState: "Seleccione un estado",
    selectCounty: "Seleccione un condado",
    selectCity: "Seleccione una ciudad",
    yes: "Si",
    no: "No",
    getPlan: "Guardar ingreso",
    yourPlan: "Resumen de su ingreso",
    transport: "Obtener ayuda de transporte",
    startOver: "Empezar de nuevo",
    helpButton: "Necesita ayuda?",
    helpTitle: "Necesita ayuda?",
    helpPlaceholder: "Haga una pregunta basica",
    helpSend: "Enviar",
    helpWelcome: "Hola. Puedo ayudar con inicio de sesion, documentos, transporte y preguntas basicas del portal.",
    helpMessageDefault: "Puedo ayudar con inicio de sesion, acta de nacimiento, tarjeta de Seguro Social, ID estatal y transporte.",
    planError: "Responda las 3 preguntas de si o no.",
    locationError: "Seleccione estado, condado y ciudad para el lugar de nacimiento y la ubicacion actual."
  }
};

async function translateText(text, targetLang) {
  if (targetLang === "en") return text;

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        sourceLang: "en",
        targetLang
      })
    });

    if (!response.ok) return text;
    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    return text;
  }
}

const staticTranslations = {
  es: {
    "Just now": "Justo ahora",
    "No county notifications yet.": "Todavia no hay notificaciones del condado.",
    "No transportation requests yet.": "Todavia no hay solicitudes de transporte.",
    "No housing availability data yet.": "Todavia no hay datos de vivienda disponibles.",
    "Passaic County housing network": "Red de vivienda de Passaic County",
    "Available now": "Disponible ahora",
    "Beds ready for placement now.": "Camas listas para asignacion ahora.",
    "Coming soon": "Proximamente",
    "Beds expected to open shortly.": "Camas que se abriran pronto.",
    "No current cases yet.": "Todavia no hay casos actuales.",
    "No notifications yet.": "Todavia no hay notificaciones.",
    "Client update": "Actualizacion del cliente",
    "County update": "Actualizacion del condado",
    "No uploaded files for this document yet.": "Todavia no hay archivos cargados para este documento.",
    "Select a client to manage documents.": "Seleccione un cliente para administrar documentos.",
    "Client documents": "Documentos del cliente",
    "Document Types": "Tipos de documentos",
    "All uploads here are linked directly to this client.": "Todas las cargas aqui estan vinculadas directamente a este cliente.",
    "Upload images for this document and review previously saved files.": "Suba imagenes para este documento y revise los archivos guardados anteriormente.",
    "Save Upload": "Guardar carga",
    "Remove": "Eliminar",
    "Select one of the 4 document cards.": "Seleccione una de las 4 tarjetas de documentos.",
    "Unopened documents stay blurred until clicked.": "Los documentos sin abrir permanecen borrosos hasta que haga clic.",
    "My documents": "Mis documentos",
    "Client Documents": "Documentos del cliente",
    "Files uploaded by your case worker for your case.": "Archivos cargados por su trabajador social para su caso.",
    "Click a card to reveal that document section.": "Haga clic en una tarjeta para mostrar esa seccion del documento.",
    "These are the files currently saved to your case.": "Estos son los archivos guardados actualmente en su caso.",
    "Documents stay hidden until you open them.": "Los documentos permanecen ocultos hasta que los abra.",
    "No messages yet.": "Todavia no hay mensajes.",
    "You": "Usted",
    "Case Worker": "Trabajador social",
    "Client": "Cliente",
    "Save image": "Guardar imagen",
    "Save file": "Guardar archivo",
    "Uploaded by case worker on": "Cargado por el trabajador social el",
    "Uploaded by client on": "Cargado por el cliente el",
    "Click to reveal this document area.": "Haga clic para mostrar esta area de documentos.",
    "No case worker is assigned to this case yet.": "Todavia no hay un trabajador social asignado a este caso.",
    "Type a message": "Escriba un mensaje",
    "Case completed. Chat is closed.": "Caso completado. El chat esta cerrado.",
    "Case completed. Chat history has been cleared.": "Caso completado. El historial del chat ha sido borrado.",
    "Could not read image.": "No se pudo leer la imagen.",
    "No clients assigned to this worker yet.": "Todavia no hay clientes asignados a este trabajador.",
    "Open": "Abrir",
    "eligible": "elegibles",
    "units": "unidades",
    "In Progress": "En progreso",
    "Missing": "Falta",
    "Completed": "Completado",
    "Client workspace": "Espacio de trabajo del cliente",
    "Client File": "Archivo del cliente",
    "Choose a workspace below. Each card opens a responsive panel for this client.": "Elija un espacio de trabajo abajo. Cada tarjeta abre un panel adaptable para este cliente.",
    "Document Uploads": "Carga de documentos",
    "Review required documents and attach image or file selections.": "Revise los documentos requeridos y adjunte imagenes o archivos.",
    "Client Chat": "Chat del cliente",
    "Open the live chat popup for saved messages and shared images.": "Abra el chat en vivo para ver mensajes guardados e imagenes compartidas.",
    "Case Notes": "Notas del caso",
    "Track internal notes, blockers, and next steps for this client.": "Registre notas internas, bloqueos y proximos pasos para este cliente.",
    "Case Activity": "Actividad del caso",
    "See recent movement across messages, transport, and status changes.": "Vea la actividad reciente en mensajes, transporte y cambios de estado.",
    "Client Summary": "Resumen del cliente",
    "Current status:": "Estado actual:",
    "Transportation needed:": "Transporte necesario:",
    "Missing documents:": "Documentos faltantes:",
    "None listed": "Ninguno",
    "Mark Case Completed": "Marcar caso como completado",
    "Live Chat Status": "Estado del chat en vivo",
    "The case is completed. Chat history is removed at completion.": "El caso esta completado. El historial del chat se elimina al completar el caso.",
    "saved messages currently linked to this client.": "mensajes guardados vinculados actualmente a este cliente.",
    "Open the chat card to continue the conversation or download the saved transcript.": "Abra la tarjeta de chat para continuar la conversacion o descargar la transcripcion guardada.",
    "Refresh": "Actualizar",
    "Save Chat": "Guardar chat",
    "Show All": "Mostrar todo",
    "Shared Images": "Imagenes compartidas",
    "No shared images yet.": "Todavia no hay imagenes compartidas.",
    "Upload Image": "Subir imagen",
    "Send": "Enviar",
    "Transportation request sent to Passaic County": "Solicitud de transporte enviada a Passaic County",
    "Assignment could not be completed. Please try again.": "No se pudo completar la asignacion. Intente de nuevo.",
    "Select a client to open the full file.": "Seleccione un cliente para abrir el archivo completo.",
    "Pending approval": "Pendiente de aprobacion",
    "Case status": "Estado del caso",
    "Case completed": "Caso completado",
    "Case active": "Caso activo",
    "Alert": "Alerta",
    "Worker message": "Mensaje del trabajador social",
    "Client message": "Mensaje del cliente",
    "Sent an update": "Envio una actualizacion",
    "Shared": "Compartio",
    "Recent case updates, transport alerts, and message activity.": "Actualizaciones recientes del caso, alertas de transporte y actividad de mensajes.",
    "No activity yet.": "Todavia no hay actividad.",
    "Keep notes for this client file. Notes stay on screen during this session.": "Guarde notas para este archivo del cliente. Las notas permanecen en pantalla durante esta sesion.",
    "Notes": "Notas",
    "Document barriers, next steps, appointment updates...": "Barreras de documentos, proximos pasos, actualizaciones de citas...",
    "Save Notes": "Guardar notas",
    "Live case conversation. History stays available until this case is marked complete.": "Conversacion en vivo del caso. El historial sigue disponible hasta que el caso se marque como completado.",
    "No files selected yet.": "Todavia no hay archivos seleccionados.",
    "Upload": "Subir"
  }
};

function getLocale() {
  return state.lang === "es" ? "es-US" : "en-US";
}

function localizeText(text) {
  if (state.lang === "en") {
    return text;
  }

  return staticTranslations.es[text] || text;
}

function getDocumentTypeLabel(key) {
  const item = DOCUMENT_TYPES.find((entry) => entry.key === key);
  if (!item) {
    return key
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  return uiText[state.lang][item.labelKey] || item.fallback;
}

function formatCountLabel(count, singularEn, pluralEn, singularEs, pluralEs) {
  const label = count === 1
    ? (state.lang === "es" ? singularEs : singularEn)
    : (state.lang === "es" ? pluralEs : pluralEn);

  return `${count} ${label}`;
}

function getStatusText(status) {
  if (status === "completed") {
    return state.lang === "es" ? "Completado" : "Completed";
  }
  if (status === "pending") {
    return state.lang === "es" ? "Pendiente" : "Pending";
  }
  if (status === "assigned" || status === "active") {
    return state.lang === "es" ? "Activo" : "Active";
  }

  return status;
}

function formatLocalizedTime(timestampRaw) {
  const timestamp = new Date(timestampRaw);
  if (Number.isNaN(timestamp.getTime())) {
    return localizeText("Just now");
  }

  return timestamp.toLocaleString(getLocale(), {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function getClientDeliveryMethodLabel(method, target = "") {
  if (method === "sms") {
    return state.lang === "es"
      ? `Texto${target ? ` a ${target}` : ""}`
      : `Text${target ? ` to ${target}` : ""}`;
  }

  if (method === "email") {
    return state.lang === "es"
      ? `Correo${target ? ` a ${target}` : ""}`
      : `Email${target ? ` to ${target}` : ""}`;
  }

  return state.lang === "es" ? "Solo en la aplicacion" : "In app only";
}

function getYesNoLabel(value) {
  return value ? (state.lang === "es" ? "Si" : "Yes") : (state.lang === "es" ? "No" : "No");
}

async function renderCurrentPlan() {
  if (!state.lastPlan) {
    return;
  }

  const translatedSteps = [];

  for (const step of state.lastPlan.steps) {
    translatedSteps.push(await translateText(step, state.lang));
  }

  const list = document.getElementById("plan-steps");
  list.innerHTML = "";

  translatedSteps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    list.appendChild(li);
  });

  document.getElementById("transport-btn").classList.toggle("hidden", !state.lastPlan.transportation_needed);
}

function generatePlan(answers, birthPlace, currentCity) {
  const steps = [];

  if (!answers.hasBirth) {
    steps.push({
      text: "You need a birth certificate.",
      description: "Use the official New Jersey Vital Statistics page to request a birth certificate online or find next steps.",
      actionLabel: "Request Birth Certificate",
      actionLink: NJ_BIRTH_CERTIFICATE_URL,
      actionExternal: true
    });
    steps.push({
      text: `Go to the Vital Records Office in ${birthPlace}.`
    });
    steps.push({
      text: "Ask for a copy."
    });
  }

  if (!answers.hasSSN) {
    steps.push({
      text: "You need a Social Security card.",
      description: "Visit the official Social Security website to apply for or replace your SSN card.",
      actionLabel: "Get Social Security Card",
      actionLink: SSA_CARD_URL,
      actionExternal: true
    });
    steps.push({
      text: `Go to SSA office in ${currentCity}.`
    });
  }

  if (!answers.hasID) {
    steps.push({
      text: "You need a State ID.",
      description: "Visit the official New Jersey MVC website to apply for a State ID or schedule an appointment.",
      actionLabel: "Apply for State ID",
      actionLink: NJ_MVC_URL,
      actionExternal: true
    });
    steps.push({
      text: `Go to DMV/MVC in ${currentCity}.`
    });
  }

  if (steps.length === 0) {
    steps.push({
      text: "You have all documents."
    });
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

function setSelectOptions(selectId, values, placeholder, disabled, selectedValue = "") {
  const select = document.getElementById(selectId);
  select.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholder;
  select.appendChild(placeholderOption);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    option.selected = value === selectedValue;
    select.appendChild(option);
  });

  select.disabled = disabled;
  if (!selectedValue) {
    select.value = "";
  }
}

function getLocationHelper() {
  return window.USLocationData;
}

function refreshLocationGroup(prefix) {
  const t = uiText[state.lang];
  const helper = getLocationHelper();
  const stateSelect = document.getElementById(`${prefix}-state`);
  const countySelect = document.getElementById(`${prefix}-county`);
  const citySelect = document.getElementById(`${prefix}-city`);
  const selectedState = stateSelect.value;
  const selectedCounty = countySelect.value;
  const availableCounties = helper.getCountiesByState(selectedState);
  const countyIsValid = availableCounties.includes(selectedCounty);
  const availableCities = countyIsValid ? helper.getCitiesByStateAndCounty(selectedState, selectedCounty) : [];
  const cityIsValid = availableCities.includes(citySelect.value);

  setSelectOptions(`${prefix}-county`, availableCounties, t.selectCounty, !selectedState, countyIsValid ? selectedCounty : "");
  setSelectOptions(`${prefix}-city`, availableCities, t.selectCity, !selectedState || !countyIsValid, cityIsValid ? citySelect.value : "");
}

function setLocationGroupValues(prefix, location = {}) {
  const helper = getLocationHelper();
  const states = helper.getStates();
  const stateValue = states.includes(location.state) ? location.state : "";
  const stateSelect = document.getElementById(`${prefix}-state`);
  const countySelect = document.getElementById(`${prefix}-county`);
  const citySelect = document.getElementById(`${prefix}-city`);

  stateSelect.value = stateValue;
  countySelect.value = "";
  citySelect.value = "";
  refreshLocationGroup(prefix);

  if (!stateValue) {
    return;
  }

  const counties = helper.getCountiesByState(stateValue);
  const countyValue = counties.includes(location.county) ? location.county : "";
  countySelect.value = countyValue;
  refreshLocationGroup(prefix);

  if (!countyValue) {
    return;
  }

  const cities = helper.getCitiesByStateAndCounty(stateValue, countyValue);
  citySelect.value = cities.includes(location.city) ? location.city : "";
}

function getBirthLocation() {
  return getSelectedLocation("birth");
}

function syncCurrentLocationToBirth() {
  setLocationGroupValues("current", getBirthLocation());
}

function updateSameAsBirthState(forceValue = null) {
  const checkbox = document.getElementById("current-same-as-birth-input");
  const shouldSync = forceValue === null ? checkbox.checked : Boolean(forceValue);
  const currentState = document.getElementById("current-state");
  const currentCounty = document.getElementById("current-county");
  const currentCity = document.getElementById("current-city");

  state.sameAsBirthLocation = shouldSync;
  checkbox.checked = shouldSync;

  if (shouldSync) {
    syncCurrentLocationToBirth();
  }

  [currentState, currentCounty, currentCity].forEach((select) => {
    select.disabled = shouldSync;
  });
}

function bindLocationGroup(prefix) {
  const stateSelect = document.getElementById(`${prefix}-state`);
  const countySelect = document.getElementById(`${prefix}-county`);
  const citySelect = document.getElementById(`${prefix}-city`);

  stateSelect.addEventListener("change", () => {
    document.getElementById(`${prefix}-county`).value = "";
    document.getElementById(`${prefix}-city`).value = "";
    refreshLocationGroup(prefix);
    if (prefix === "birth" && state.sameAsBirthLocation) {
      syncCurrentLocationToBirth();
    }
  });

  countySelect.addEventListener("change", () => {
    document.getElementById(`${prefix}-city`).value = "";
    refreshLocationGroup(prefix);
    if (prefix === "birth" && state.sameAsBirthLocation) {
      syncCurrentLocationToBirth();
    }
  });

  citySelect.addEventListener("change", () => {
    if (prefix === "birth" && state.sameAsBirthLocation) {
      syncCurrentLocationToBirth();
    }
  });
}

function setupLocationDropdowns(savedLocations = null) {
  const t = uiText[state.lang];
  const helper = getLocationHelper();
  const states = helper.getStates();
  const birthState = savedLocations?.birth?.state || document.getElementById("birth-state").value;
  const birthCounty = savedLocations?.birth?.county || document.getElementById("birth-county").value;
  const birthCity = savedLocations?.birth?.city || document.getElementById("birth-city").value;
  const currentState = savedLocations?.current?.state || document.getElementById("current-state").value;
  const currentCounty = savedLocations?.current?.county || document.getElementById("current-county").value;
  const currentCity = savedLocations?.current?.city || document.getElementById("current-city").value;
  const sameAsBirth = Boolean(
    birthState &&
    birthCounty &&
    birthCity &&
    birthState === currentState &&
    birthCounty === currentCounty &&
    birthCity === currentCity
  );

  setSelectOptions("birth-state", states, t.selectState, false, states.includes(birthState) ? birthState : "");
  setSelectOptions("current-state", states, t.selectState, false, states.includes(currentState) ? currentState : "");
  setLocationGroupValues("birth", {
    state: birthState,
    county: birthCounty,
    city: birthCity
  });
  setLocationGroupValues("current", {
    state: currentState,
    county: currentCounty,
    city: currentCity
  });
  updateSameAsBirthState(sameAsBirth);
}

function getSelectedLocation(prefix) {
  return {
    state: document.getElementById(`${prefix}-state`).value,
    county: document.getElementById(`${prefix}-county`).value,
    city: document.getElementById(`${prefix}-city`).value
  };
}

function isLocationComplete(location) {
  return Boolean(location.state && location.county && location.city);
}

function formatLocation(location) {
  return `${location.city}, ${location.county} County, ${location.state}`;
}

function openScreen(screenId) {
  if (!hasAuthenticatedClientUser() && ["dashboard-screen", "client-progress-screen", "client-chat-screen", "client-notifications-screen", "questions-screen", "result-screen", "client-documents-screen"].includes(screenId)) {
    screenId = "login-screen";
  } else if (userNeedsIntake() && ["dashboard-screen", "client-progress-screen", "client-chat-screen", "client-notifications-screen", "result-screen", "client-documents-screen"].includes(screenId)) {
    screenId = "questions-screen";
  }

  ["login-screen", "create-account-screen", "admin-dashboard-screen", "caseworker-client-screen", "caseworker-documents-screen", "client-documents-screen", "dashboard-screen", "client-progress-screen", "client-chat-screen", "client-notifications-screen", "questions-screen", "result-screen"].forEach((id) => {
    document.getElementById(id).classList.toggle("hidden", id !== screenId);
  });
  document.getElementById("login-error").textContent = "";
  document.getElementById("create-account-error").textContent = "";

  const isAdminScreen = screenId === "admin-dashboard-screen" || screenId === "caseworker-client-screen" || screenId === "caseworker-documents-screen";
  const isAdminLogin = screenId === "login-screen" && state.authView === "admin";
  const isCreateAccountScreen = screenId === "create-account-screen";
  const postLogin = screenId !== "login-screen" && !isCreateAccountScreen;
  const showHelp = postLogin && !isAdminScreen && !isAdminLogin;
  const adminPortalBtn = document.getElementById("admin-portal-btn");
  if (adminPortalBtn) {
    adminPortalBtn.classList.toggle("hidden", postLogin || isAdminLogin);
  }

  document.getElementById("skyline").classList.toggle("dimmed", postLogin);
  const helpButton = document.getElementById("help-float-btn");
  helpButton.classList.toggle("hidden", !showHelp);
  helpButton.hidden = !showHelp;

  if (!showHelp) {
    closeHelpChat();
  }

  if (screenId !== "admin-dashboard-screen" || state.adminRole !== "passaic") {
    closeWorkerProfile();
  }

  if (screenId !== "client-notifications-screen") {
    closeClientNotificationPanel();
  }

  syncAdminLayoutMode(screenId);
  syncCountyAutoRefresh();
  syncCountyAiAccess();
  syncClientNotificationRefresh(screenId);
}

function syncAdminLayoutMode(screenId) {
  const onCaseworkerScreen = screenId === "admin-dashboard-screen" || screenId === "caseworker-client-screen" || screenId === "caseworker-documents-screen";
  const onAdminDashboard = screenId === "admin-dashboard-screen";
  const adminDashboard = document.getElementById("admin-dashboard-screen");
  const caseworkerClientScreen = document.getElementById("caseworker-client-screen");
  const caseworkerDocumentsScreen = document.getElementById("caseworker-documents-screen");
  const appWrap = document.querySelector(".app-wrap");

  adminDashboard.classList.toggle("county-mode", onAdminDashboard && state.adminRole === "passaic");
  adminDashboard.classList.toggle("caseworker-mode", onAdminDashboard && state.adminRole === "caseworker");
  caseworkerClientScreen.classList.toggle("caseworker-mode", screenId === "caseworker-client-screen");
  caseworkerDocumentsScreen.classList.toggle("caseworker-mode", screenId === "caseworker-documents-screen");
  appWrap.classList.toggle("county-expanded", onAdminDashboard && state.adminRole === "passaic");
  appWrap.classList.toggle("caseworker-expanded", onCaseworkerScreen && state.adminRole === "caseworker");
}

function applyLanguage() {
  const t = uiText[state.lang];
  const isAdmin = state.authView === "admin";
  const selectedWorkerAccount = getCurrentWorker();
  const selectedClientAccount = getCurrentClientAccount();
  const clientFirstName = getFirstName(selectedClientAccount?.name);
  const workerFirstName = getFirstName(selectedWorkerAccount?.name);

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === state.lang);
  });
  document.documentElement.lang = state.lang;

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
  document.getElementById("worker-username-input").placeholder = t.createAccountEmailPlaceholder;
  document.getElementById("worker-password-input").placeholder = t.createAccountPasswordPlaceholder;
  document.getElementById("create-account-toggle-btn").textContent = t.createAccountToggle;
  document.getElementById("create-account-back-btn").textContent = t.createAccountBack;
  document.getElementById("create-account-screen-eyebrow").textContent = t.createAccountScreenEyebrow;
  document.getElementById("create-account-screen-title").textContent = t.createAccountScreenTitle;
  document.getElementById("create-account-screen-subtitle").textContent = t.createAccountScreenSubtitle;
  document.getElementById("create-account-phone-mode-btn").textContent = t.createAccountPhoneMode;
  document.getElementById("create-account-email-mode-btn").textContent = t.createAccountEmailMode;
  document.getElementById("create-account-name-label").textContent = t.createAccountName;
  document.getElementById("create-account-phone-label").textContent = t.createAccountPhone;
  document.getElementById("create-account-email-label").textContent = t.createAccountEmail;
  document.getElementById("create-account-password-label").textContent = t.createAccountPassword;
  document.getElementById("create-account-request-worker-label").textContent = t.createAccountRequestWorker;
  document.getElementById("create-account-submit-btn").textContent = t.createAccountSubmit;
  document.getElementById("create-account-name-input").placeholder = t.createAccountNamePlaceholder;
  document.getElementById("create-account-phone-input").placeholder = t.createAccountPhonePlaceholder;
  document.getElementById("create-account-email-input").placeholder = t.createAccountEmailPlaceholder;
  document.getElementById("create-account-password-input").placeholder = t.createAccountPasswordPlaceholder;
  document.getElementById("worker-login-btn").textContent = t.workerLogin;
  document.getElementById("code-demo-note").textContent = t.codeSent;
  document.getElementById("admin-login-back-btn").textContent = t.adminBack;
  document.getElementById("admin-google-mark").textContent = t.adminMark;
  document.getElementById("caseworker-role-btn").textContent = t.adminRoleCaseworker;
  document.getElementById("passaic-role-btn").textContent = t.adminRolePassaic;
  document.getElementById("admin-email-label").textContent = t.adminEmail;
  document.getElementById("admin-password-label").textContent = t.adminPassword;
  document.getElementById("admin-login-btn").textContent = t.adminLogin;
  document.getElementById("admin-demo-copy").textContent = state.lang === "es" ? "Acceso demo" : "Demo access";
  document.getElementById("admin-demo-caseworker-label").textContent = state.lang === "es" ? "Seleccione trabajador social demo" : "Select demo case worker";
  document.getElementById("admin-demo-caseworker-btn").textContent = state.lang === "es" ? "Entrar como trabajador" : "Demo Case Worker";
  document.getElementById("admin-demo-county-btn").textContent = state.lang === "es" ? "Entrar como condado" : "Demo County";
  renderAdminDemoCaseworkerOptions();

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
    state.adminRole === "caseworker" && currentWorker ? formatCountLabel(currentWorker.active_cases, "active case", "active cases", "caso activo", "casos activos") : (
      state.adminRole === "caseworker" ? t.adminSummaryCases : t.adminSummaryCounty
    );
  document.getElementById("county-users-number").textContent = String(passaicCountyMetrics.totalUsers);
  document.getElementById("county-housed-number").textContent = String(passaicCountyMetrics.housedUsers);
  document.getElementById("county-apps-number").textContent = String(passaicCountyMetrics.activeApplications);
  document.getElementById("county-users-label").textContent = t.countyUsers;
  document.getElementById("county-housed-label").textContent = t.countyHoused;
  document.getElementById("county-apps-label").textContent = t.countyApplications;

  document.getElementById("dashboard-eyebrow").textContent = t.dashboardEyebrow;
  document.getElementById("dashboard-title").textContent = clientFirstName
    ? (state.lang === "es" ? `Hola ${clientFirstName}` : `Hi ${clientFirstName}`)
    : t.dashboardTitle;
  document.getElementById("dashboard-subtitle").textContent = t.dashboardSubtitle;
  document.getElementById("doc-id-title").textContent = state.lang === "es" ? "Ver su ID" : "View Your ID";
  document.getElementById("doc-id-text").textContent = state.lang === "es" ? "Abra su pagina de documentos" : "Open your document page";
  document.getElementById("doc-birth-title").textContent = state.lang === "es" ? "Chatee con su trabajador social" : "Chat with Your Case Worker";
  document.getElementById("doc-birth-text").textContent = state.lang === "es" ? "Abra su conversacion" : "Open your conversation";
  document.getElementById("doc-passport-title").textContent = state.lang === "es" ? "Notificaciones" : "Notifications";
  document.getElementById("doc-passport-text").textContent = state.lang === "es" ? "Las actualizaciones apareceran aqui" : "Updates will appear here";
  document.getElementById("doc-ssn-title").textContent = state.lang === "es" ? "Panel de progreso" : "Progress Dashboard";
  document.getElementById("doc-ssn-text").textContent = state.lang === "es" ? "Vea lo completado y lo pendiente" : "See what is done and what is left";
  document.getElementById("client-notification-bell-btn").setAttribute("aria-label", state.lang === "es" ? "Abrir pagina de notificaciones" : "Open notifications page");
  document.getElementById("client-notification-page-eyebrow").textContent = state.lang === "es" ? "Notificaciones" : "Notifications";
  document.getElementById("client-notification-page-title").textContent = state.lang === "es" ? "Sus actualizaciones" : "Your updates";
  document.getElementById("client-notification-page-subtitle").textContent = state.lang === "es" ? "Las actualizaciones recientes del caso aparecen aqui." : "Recent case updates appear here.";
  document.getElementById("client-notification-delivery-note").textContent = getClientDeliveryMethodLabel(
    state.clientPortalData.deliveryMethod,
    state.clientPortalData.deliveryTarget
  );
  document.getElementById("client-progress-eyebrow").textContent = state.lang === "es" ? "Progreso del caso" : "Case progress";
  document.getElementById("client-progress-title").textContent = state.lang === "es" ? "Siga su caso de vivienda" : "Track your housing case";
  document.getElementById("client-progress-subtitle").textContent = state.lang === "es"
    ? "Vea lo que ya esta completo, lo que sigue pendiente y las siguientes acciones."
    : "See what is complete, what still needs attention, and what to do next.";
  document.getElementById("client-progress-score-label").textContent = state.lang === "es" ? "Progreso total" : "Overall progress";
  document.getElementById("client-progress-metric-status-label").textContent = state.lang === "es" ? "Estado del caso" : "Case status";
  document.getElementById("client-progress-metric-docs-label").textContent = state.lang === "es" ? "Pasos de documentos" : "Document steps";
  document.getElementById("client-progress-metric-worker-label").textContent = state.lang === "es" ? "Trabajador social" : "Case worker";
  document.getElementById("client-progress-metric-transport-label").textContent = state.lang === "es" ? "Transporte" : "Transportation";
  document.getElementById("client-progress-stage-title").textContent = state.lang === "es" ? "Seguimiento del progreso" : "Progress tracker";
  document.getElementById("client-progress-stage-subtitle").textContent = state.lang === "es" ? "Cada etapa cambia cuando su caso avanza." : "Each step updates as your case moves.";
  document.getElementById("client-progress-next-title").textContent = state.lang === "es" ? "Proximas acciones" : "Next actions";
  document.getElementById("client-progress-next-subtitle").textContent = state.lang === "es"
    ? "Su dashboard mantiene los siguientes pasos utiles en un solo lugar."
    : "Your dashboard keeps the next most useful steps in one place.";
  document.getElementById("dashboard-note").textContent = t.dashboardNote;
  document.getElementById("dashboard-continue-btn").textContent = t.dashboardContinue;
  document.getElementById("client-chat-title").textContent = state.lang === "es" ? "💬 Envie un mensaje a su trabajador social" : "💬 Message Your Case Worker";
  document.getElementById("client-chat-subtitle").textContent = state.lang === "es"
    ? "Mantengase en contacto, comparta imagenes y revise actualizaciones de su caso."
    : "Stay in touch, share images, and review updates for your case.";
  document.getElementById("client-chat-upload-label").textContent = state.lang === "es" ? "Subir imagen" : "Upload Image";

  document.getElementById("main-title").textContent = t.mainTitle;
  document.getElementById("main-subtitle").textContent = t.mainSubtitle;
  document.getElementById("q-birth").textContent = t.qBirth;
  document.getElementById("q-ssn").textContent = t.qSSN;
  document.getElementById("q-id").textContent = t.qID;
  document.getElementById("q-born").textContent = t.qBorn;
  document.getElementById("q-now").textContent = t.qNow;
  document.getElementById("current-same-as-birth-label").textContent = t.sameAsBorn;
  setupLocationDropdowns();
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
  document.getElementById("county-ai-float-btn").textContent = t.countyAiButton;
  document.getElementById("county-ai-title").textContent = t.countyAiTitle;
  document.getElementById("county-ai-subtitle").textContent = t.countyAiSubtitle;
  document.getElementById("county-ai-note").textContent = state.lang === "es"
    ? "Este asistente actualmente usa logica simple. Se puede actualizar a una IA real para brindar informacion mas profunda si el sistema es aprobado."
    : "This assistant currently uses simple logic. It can be upgraded to a real AI (like ChatGPT) to provide deeper insights if the system is approved.";
  document.getElementById("ai-input").placeholder = t.countyAiPlaceholder;
  document.getElementById("ai-ask-btn").textContent = t.countyAiAsk;
  document.getElementById("county-hero-eyebrow").textContent = state.lang === "es" ? "Coordinacion de vivienda de Passaic County" : "Passaic County Housing Coordination";
  document.getElementById("county-hero-title").textContent = state.lang === "es" ? "Administre solicitudes, asignaciones y rendimiento del sistema" : "Manage requests, assignments, and system performance";
  document.getElementById("county-hero-subtitle").textContent = state.lang === "es"
    ? "Revise solicitudes de clientes, asigne al mejor trabajador y supervise la actividad del condado."
    : "Review incoming client requests, assign the best worker, and monitor county-wide activity.";
  document.getElementById("county-hero-badge-queue").textContent = state.lang === "es" ? "Fila de ingreso en vivo" : "Live intake queue";
  document.getElementById("county-hero-badge-balance").textContent = state.lang === "es" ? "Balance del personal" : "Worker balancing";
  document.getElementById("county-hero-badge-transport").textContent = state.lang === "es" ? "Monitoreo de transporte" : "Transportation watch";
  document.getElementById("county-refresh-btn").textContent = state.lang === "es" ? "Actualizar datos" : "Refresh Data";
  document.getElementById("county-system-reach-kicker").textContent = state.lang === "es" ? "Alcance del sistema" : "System reach";
  document.getElementById("county-users-note").textContent = state.lang === "es" ? "Actividad en todo el condado en casos abiertos de apoyo de vivienda." : "County-wide activity across open housing support cases.";
  document.getElementById("county-placement-kicker").textContent = state.lang === "es" ? "Progreso de ubicacion" : "Placement progress";
  document.getElementById("county-housed-note").textContent = state.lang === "es" ? "Clientes que pasaron de solicitud a ubicacion de vivienda." : "Clients who moved from request to housing placement.";
  document.getElementById("county-open-workload-kicker").textContent = state.lang === "es" ? "Carga abierta" : "Open workload";
  document.getElementById("county-apps-note").textContent = state.lang === "es" ? "Solicitudes que siguen en revision, documentos y asignacion." : "Requests still moving through review, documents, and assignment.";
  document.getElementById("county-ai-kicker").textContent = state.lang === "es" ? "Recomendacion IA" : "AI recommendation";
  document.getElementById("county-recommended-worker-label").textContent = state.lang === "es" ? "Mejor trabajador sugerido" : "Best Worker Match";
  document.getElementById("county-recommended-worker-note").textContent = state.lang === "es" ? "Siguiente asignacion sugerida segun carga y balance de fila." : "Suggested next assignment based on workload and queue balance.";
  document.getElementById("county-queue-kicker").textContent = state.lang === "es" ? "Gestion de fila" : "Queue management";
  document.getElementById("county-client-requests-title").textContent = state.lang === "es" ? "🏠 Solicitudes de clientes" : "🏠 Client Requests";
  document.getElementById("county-client-requests-subtitle").textContent = state.lang === "es" ? "Asigne clientes al trabajador con menor carga o elija otro trabajador." : "Assign clients to the lowest-workload case worker or choose a different worker.";
  document.getElementById("county-bottleneck-kicker").textContent = state.lang === "es" ? "Friccion del sistema" : "System friction";
  document.getElementById("county-bottleneck-title").textContent = state.lang === "es" ? "⚠️ Cuellos de botella" : "⚠️ Bottlenecks";
  document.getElementById("county-bottleneck-id").textContent = state.lang === "es" ? "52% atascado en ID estatal" : "52% stuck at State ID";
  document.getElementById("county-bottleneck-ssn").textContent = state.lang === "es" ? "28% atascado en SSN" : "28% stuck at SSN";
  document.getElementById("county-bottleneck-birth").textContent = state.lang === "es" ? "20% atascado en acta de nacimiento" : "20% stuck at Birth Certificate";
  document.getElementById("county-transport-impact-kicker").textContent = state.lang === "es" ? "Riesgo de movilidad" : "Mobility risk";
  document.getElementById("county-transport-impact-title").textContent = state.lang === "es" ? "🚗 Impacto del transporte" : "🚗 Transport Impact";
  document.getElementById("county-transport-impact-note").textContent = state.lang === "es" ? "de los usuarios necesitan apoyo de transporte y es mas probable que pierdan citas." : "of users need transportation support and are more likely to miss appointments.";
  document.getElementById("county-activity-kicker").textContent = state.lang === "es" ? "Flujo de actividad" : "Activity feed";
  document.getElementById("county-notifications-title").textContent = state.lang === "es" ? "🔔 Notificaciones" : "🔔 Notifications";
  document.getElementById("county-notifications-subtitle").textContent = state.lang === "es" ? "Actividad reciente de asignaciones y del sistema." : "Recent assignment and system activity.";
  document.getElementById("county-notifications-live-pill").textContent = state.lang === "es" ? "En vivo" : "Live";
  document.getElementById("county-clear-notifications-btn").textContent = state.lang === "es" ? "Limpiar" : "Clear";
  document.getElementById("county-staffing-kicker").textContent = state.lang === "es" ? "Vista del personal" : "Staffing view";
  document.getElementById("county-workers-title").textContent = state.lang === "es" ? "👥 Trabajadores sociales" : "👥 Case Workers";
  document.getElementById("county-workers-subtitle").textContent = state.lang === "es" ? "Controle la carga y vea el trabajador recomendado para la siguiente asignacion." : "Track workload and see the recommended worker for the next assignment.";
  document.getElementById("county-workers-pill").textContent = state.lang === "es" ? "Fila equilibrada" : "Balanced queue";
  document.getElementById("county-field-support-kicker").textContent = state.lang === "es" ? "Apoyo en campo" : "Field support";
  document.getElementById("county-transport-requests-title").textContent = state.lang === "es" ? "🚗 Solicitudes de transporte" : "🚗 Transport Requests";
  document.getElementById("county-transport-requests-subtitle").textContent = state.lang === "es" ? "Solicitudes de Uber o transporte enviadas por trabajadores sociales." : "Uber or transportation requests sent by case workers.";
  document.getElementById("county-transport-pill").textContent = state.lang === "es" ? "Prioridad" : "Priority";
  document.getElementById("county-housing-kicker").textContent = state.lang === "es" ? "Disponibilidad de vivienda" : "Housing availability";
  document.getElementById("county-housing-title").textContent = state.lang === "es" ? "🛏️ Vivienda disponible del condado" : "🛏️ County Housing Availability";
  document.getElementById("county-housing-subtitle").textContent = state.lang === "es" ? "Camas disponibles ahora y proximas aperturas en ciudades de Passaic County." : "Beds available now and upcoming housing openings across Passaic County cities.";
  document.getElementById("county-housing-pill").textContent = state.lang === "es" ? "Vivienda en vivo" : "Live housing";
  document.getElementById("county-worker-modal-eyebrow").textContent = state.lang === "es" ? "Vista de personal de Passaic County" : "Passaic County Staffing View";
  document.getElementById("county-worker-modal-title").textContent = state.lang === "es" ? "Perfil del trabajador social" : "Case Worker Profile";
  document.getElementById("ai-response").textContent = state.lang === "es"
    ? "La mayoria de las demoras ocurren en el paso de la ID estatal por citas y transporte."
    : "Most delays are happening at the State ID step due to appointments and transportation issues.";

  refreshLocalizedScreens();

}

function refreshLocalizedScreens() {
  if (!document.getElementById("dashboard-screen").classList.contains("hidden")) {
    renderClientNotifications();
  }

  if (!document.getElementById("client-progress-screen").classList.contains("hidden")) {
    renderClientProgressDashboard();
  }

  if (!document.getElementById("client-chat-screen").classList.contains("hidden")) {
    renderClientPortalChat();
  }

  if (!document.getElementById("client-notifications-screen").classList.contains("hidden")) {
    renderClientNotifications();
  }

  if (!document.getElementById("admin-dashboard-screen").classList.contains("hidden")) {
    if (state.adminRole === "passaic") {
      renderCountyDashboard();
    } else {
      renderCaseWorkerDashboard();
    }
  }

  if (!document.getElementById("caseworker-client-screen").classList.contains("hidden")) {
    renderCaseFileView();
  }

  if (!document.getElementById("caseworker-documents-screen").classList.contains("hidden")) {
    renderCaseworkerDocumentsView();
  }

  if (!document.getElementById("client-documents-screen").classList.contains("hidden")) {
    renderClientDocumentsView();
  }

  void renderCurrentPlan();
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
  if (role === "caseworker" && state.caseWorkerData.workers.length) {
    const currentWorkerExists = state.caseWorkerData.workers.some((worker) => worker.id === state.caseWorkerData.currentWorkerId);
    if (!currentWorkerExists) {
      state.caseWorkerData.currentWorkerId = state.caseWorkerData.workers[0].id;
    }
  }
  document.getElementById("caseworker-role-btn").classList.toggle("active", role === "caseworker");
  document.getElementById("passaic-role-btn").classList.toggle("active", role === "passaic");
  document.getElementById("admin-demo-caseworker-select").disabled = role !== "caseworker";
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
    document.getElementById("admin-email-input").value = "";
    document.getElementById("admin-password-input").value = "";
  }
  applyLanguage();
}

function setCreateAccountMode(mode) {
  state.createAccountMode = mode;
  const isPhoneMode = mode === "phone";
  document.getElementById("create-account-phone-mode-btn").classList.toggle("active", isPhoneMode);
  document.getElementById("create-account-email-mode-btn").classList.toggle("active", !isPhoneMode);
  document.getElementById("create-account-phone-fields").classList.toggle("hidden", !isPhoneMode);
  document.getElementById("create-account-email-fields").classList.toggle("hidden", isPhoneMode);
  document.getElementById("create-account-error").textContent = "";
}

function setLoginView(view) {
  state.loginView = view;
  const showPhone = view === "phone";

  document.getElementById("phone-option-btn").classList.toggle("active", showPhone);
  document.getElementById("worker-option-btn").classList.toggle("active", !showPhone);
  document.getElementById("phone-login-form").classList.toggle("hidden", !showPhone);
  document.getElementById("worker-login-form").classList.toggle("hidden", showPhone);
  document.getElementById("login-error").textContent = "";
  document.getElementById("create-account-error").textContent = "";
  resetCodeEntry();
  applyLanguage();
}

function formatDocumentLabel(value) {
  return getDocumentTypeLabel(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function hasAuthenticatedClientUser() {
  return Boolean(state.clientPortalData.currentUser?.clientId);
}

function userNeedsIntake() {
  return hasAuthenticatedClientUser() && !state.clientPortalData.currentUser?.hasCompletedIntake;
}

function resetPlanState() {
  state.answers.hasBirth = null;
  state.answers.hasSSN = null;
  state.answers.hasID = null;
  state.lastPlan = null;
}

function applyChoiceButtonState(groupKey, value) {
  const row = document.querySelector(`.choice-row[data-group="${groupKey}"]`);
  if (!row) {
    return;
  }

  row.querySelectorAll(".choice-btn").forEach((button) => {
    button.classList.toggle("active", String(value) === button.dataset.value);
  });
}

function loadIntakeFromCurrentUser() {
  const user = getCurrentClientAccount();
  const savedAnswers = user?.documentAnswers || null;
  const savedLocations = user?.intakeLocations || null;

  resetPlanState();
  state.sameAsBirthLocation = false;

  if (!savedAnswers) {
    document.querySelectorAll(".choice-row[data-group]").forEach((row) => {
      row.querySelectorAll(".choice-btn").forEach((button) => button.classList.remove("active"));
    });
  } else {
    state.answers.hasBirth = savedAnswers.hasBirth;
    state.answers.hasSSN = savedAnswers.hasSSN;
    state.answers.hasID = savedAnswers.hasID;
    applyChoiceButtonState("hasBirth", savedAnswers.hasBirth);
    applyChoiceButtonState("hasSSN", savedAnswers.hasSSN);
    applyChoiceButtonState("hasID", savedAnswers.hasID);
  }

  setupLocationDropdowns(savedLocations || undefined);
  state.lastPlan = user?.roadmapPlan || null;
}

function routeClientAfterLogin() {
  loadIntakeFromCurrentUser();

  if (!userNeedsIntake()) {
    showApp();
    return;
  }

  document.getElementById("plan-error-box").textContent = "";
  openScreen("questions-screen");
}

function routeClientEntry() {
  if (!hasAuthenticatedClientUser()) {
    state.authView = "user";
    openScreen("login-screen");
    return;
  }

  routeClientAfterLogin();
}

function handleLoggedInUser(user) {
  state.clientPortalData.currentClientId = user.clientId;
  state.clientPortalData.currentUser = user;
  routeClientEntry();
}

async function restoreClientSession() {
  try {
    const data = await fetchJson("/api/auth/me");
    if (data && data.authenticated && data.user) {
      state.clientPortalData.currentClientId = data.user.clientId;
      state.clientPortalData.currentUser = data.user;
      routeClientEntry();
      return true;
    }
  } catch (error) {
    // Ignore session restore failures and keep the user on the login screen.
  }

  return false;
}

async function logoutClientUser() {
  try {
    await fetchJson("/api/auth/logout", { method: "POST" });
  } catch (error) {
    // Allow the UI to reset locally even if the server is unavailable.
  }

  state.clientPortalData.currentClientId = null;
  state.clientPortalData.currentUser = null;
  state.clientPortalData.serviceRecommendations = {};
  state.clientPortalData.notifications = [];
  state.clientPortalData.unreadNotificationCount = 0;
  state.clientPortalData.deliveryMethod = "in_app";
  state.clientPortalData.deliveryTarget = "";
  closeClientNotificationPanel();
  stopClientNotificationRefresh();
  resetPlanState();
  hideClientChatPanel();
  openScreen("login-screen");
}

async function createClientAccount() {
  const t = uiText[state.lang];
  const errorBox = document.getElementById("create-account-error");
  const name = document.getElementById("create-account-name-input").value.trim();
  const phone = document.getElementById("create-account-phone-input").value.trim();
  const email = document.getElementById("create-account-email-input").value.trim();
  const password = document.getElementById("create-account-password-input").value.trim();
  const requestCaseWorker = document.getElementById("create-account-request-worker-input").checked;

  try {
    const route = state.createAccountMode === "phone" ? "/api/auth/signup/phone" : "/api/auth/signup/email";
    const body = state.createAccountMode === "phone"
      ? { name, phone, request_case_worker: requestCaseWorker }
      : { name, email, password, request_case_worker: requestCaseWorker };

    if (state.createAccountMode === "phone" && (!name || !phone)) {
      errorBox.textContent = t.createAccountErrorPhone;
      return;
    }

    if (state.createAccountMode === "email" && (!name || !email || !password)) {
      errorBox.textContent = t.createAccountErrorEmail;
      return;
    }

    await fetchJson(route, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (state.createAccountMode === "phone") {
      document.getElementById("phone-input").value = phone;
      setLoginView("phone");
    } else {
      document.getElementById("worker-username-input").value = email;
      document.getElementById("worker-password-input").value = "";
      setLoginView("worker");
    }

    document.getElementById("create-account-name-input").value = "";
    document.getElementById("create-account-phone-input").value = "";
    document.getElementById("create-account-email-input").value = "";
    document.getElementById("create-account-password-input").value = "";
    document.getElementById("create-account-request-worker-input").checked = false;
    errorBox.textContent = "";
    openScreen("login-screen");
    document.getElementById("login-error").textContent =
      requestCaseWorker
        ? t.createAccountSuccessRequested
        : (state.createAccountMode === "phone" ? t.createAccountPhoneSuccess : t.createAccountEmailSuccess);
  } catch (error) {
    errorBox.textContent =
      error.message === "SERVER_OFFLINE" ? showServerOfflineMessage() : error.message;
  }
}

function getApiUrl(url) {
  if (typeof url !== "string" || !url.startsWith("/api/")) {
    return url;
  }

  const { protocol, hostname, port } = window.location;
  const isLocalHost = hostname === "127.0.0.1" || hostname === "localhost";
  const isLocalPreview = protocol === "file:" || (isLocalHost && port && port !== "3000");

  if (isLocalPreview) {
    return `http://127.0.0.1:3000${url}`;
  }

  return url;
}

async function fetchJson(url, options = {}) {
  let response;

  try {
    response = await fetch(getApiUrl(url), options);
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

function renderAdminDemoCaseworkerOptions() {
  const select = document.getElementById("admin-demo-caseworker-select");
  if (!select) {
    return;
  }

  const placeholder = state.lang === "es" ? "Seleccione trabajador social" : "Select case worker";
  const workers = Array.isArray(state.adminDemoWorkers) ? state.adminDemoWorkers : [];
  const currentValue = state.adminSelectedDemoWorkerId || select.value;
  const fallbackValue = workers[0]?.workerId || "";
  const selectedValue = workers.some((worker) => worker.workerId === currentValue)
    ? currentValue
    : fallbackValue;

  select.innerHTML = `
    <option value="">${escapeHtml(placeholder)}</option>
    ${workers.map((worker) => `
      <option value="${escapeHtml(worker.workerId || "")}" ${worker.workerId === selectedValue ? "selected" : ""}>${escapeHtml(`${worker.name} (${worker.workerId || ""})`)}</option>
    `).join("")}
  `;

  if (workers.length && selectedValue) {
    select.value = selectedValue;
  }

  state.adminSelectedDemoWorkerId = selectedValue;
}

function syncAdminDemoWorkerSelection() {
  const select = document.getElementById("admin-demo-caseworker-select");
  if (!select) {
    return null;
  }

  const selectedWorkerId = select.value || state.adminSelectedDemoWorkerId;
  state.adminSelectedDemoWorkerId = selectedWorkerId || "";
  const selectedWorker = state.adminDemoWorkers.find((worker) => worker.workerId === selectedWorkerId) || null;

  if (state.adminRole === "caseworker" && selectedWorker) {
    document.getElementById("admin-email-input").value = selectedWorker.email || "";
    document.getElementById("admin-password-input").value = "Demo login";
  }

  return selectedWorker;
}

async function loadAdminDemoCaseworkers() {
  try {
    const data = await fetchJson("/api/admin/demo-accounts?role=caseworker");
    state.adminDemoWorkers = Array.isArray(data.accounts) && data.accounts.length
      ? data.accounts
      : DEFAULT_DEMO_CASEWORKERS.slice();
  } catch (error) {
    state.adminDemoWorkers = DEFAULT_DEMO_CASEWORKERS.slice();
  }

  renderAdminDemoCaseworkerOptions();
  syncAdminDemoWorkerSelection();
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

function renderClientNotifications() {
  const list = document.getElementById("client-notification-list");
  const badge = document.getElementById("client-notification-bell-count");
  const unreadCount = state.clientPortalData.unreadNotificationCount || 0;
  const notifications = state.clientPortalData.notifications || [];

  badge.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
  badge.classList.toggle("hidden", unreadCount === 0);
  document.getElementById("client-notification-delivery-note").textContent = getClientDeliveryMethodLabel(
    state.clientPortalData.deliveryMethod,
    state.clientPortalData.deliveryTarget
  );

  if (!notifications.length) {
    list.innerHTML = `<div class="county-empty-state">${state.lang === "es" ? "Todavia no hay actualizaciones." : "No updates yet."}</div>`;
    return;
  }

  list.innerHTML = notifications.map((item) => `
    <article class="client-notification-item ${item.read ? "" : "unread"}">
      <div class="client-notification-meta">
        <strong>${escapeHtml(item.title || (state.lang === "es" ? "Actualizacion" : "Update"))}</strong>
        <span class="small-text">${escapeHtml(formatLocalizedTime(item.timestamp))}</span>
      </div>
      <p class="small-text">${escapeHtml(item.message || "")}</p>
      <span class="small-text client-notification-delivery">${escapeHtml(getClientDeliveryMethodLabel(item.delivery?.channel, ""))}</span>
    </article>
  `).join("");
}

async function loadClientNotifications() {
  if (!hasAuthenticatedClientUser()) {
    state.clientPortalData.notifications = [];
    state.clientPortalData.unreadNotificationCount = 0;
    renderClientNotifications();
    return;
  }

  try {
    const data = await fetchJson("/api/client-notifications");
    state.clientPortalData.notifications = data.notifications || [];
    state.clientPortalData.unreadNotificationCount = data.unread_count || 0;
    state.clientPortalData.deliveryMethod = data.delivery_method || "in_app";
    state.clientPortalData.deliveryTarget = data.delivery_target || "";
    renderClientNotifications();
  } catch (error) {
    state.clientPortalData.notifications = [];
    state.clientPortalData.unreadNotificationCount = 0;
    state.clientPortalData.deliveryMethod = "in_app";
    state.clientPortalData.deliveryTarget = "";
    renderClientNotifications();
  }
}

async function loadClientServiceRecommendations() {
  if (!hasAuthenticatedClientUser()) {
    state.clientPortalData.serviceRecommendations = {};
    return;
  }

  try {
    const data = await fetchJson("/api/client-service-recommendations");
    state.clientPortalData.serviceRecommendations = data.recommendations || {};
  } catch (error) {
    state.clientPortalData.serviceRecommendations = {};
  }
}

async function markAllClientNotificationsRead() {
  if (!hasAuthenticatedClientUser() || state.clientPortalData.unreadNotificationCount === 0) {
    return;
  }

  try {
    await fetchJson("/api/client-notifications/read-all", { method: "POST" });
    state.clientPortalData.notifications = state.clientPortalData.notifications.map((item) => ({
      ...item,
      read: true
    }));
    state.clientPortalData.unreadNotificationCount = 0;
    renderClientNotifications();
  } catch (error) {
    // Keep the panel usable even if the server-side read state cannot be updated.
  }
}

async function openClientNotificationPanel() {
  state.clientPortalData.isNotificationPanelOpen = true;
  openScreen("client-notifications-screen");
  renderClientNotifications();
  await markAllClientNotificationsRead();
}

function closeClientNotificationPanel() {
  state.clientPortalData.isNotificationPanelOpen = false;
}

async function toggleClientNotificationPanel() {
  await openClientNotificationPanel();
}

function stopClientNotificationRefresh() {
  if (state.clientPortalData.notificationRefreshIntervalId) {
    window.clearInterval(state.clientPortalData.notificationRefreshIntervalId);
    state.clientPortalData.notificationRefreshIntervalId = null;
  }
}

function syncClientNotificationRefresh(screenId) {
  const shouldRefresh = hasAuthenticatedClientUser() &&
    !["login-screen", "create-account-screen", "admin-dashboard-screen", "caseworker-client-screen", "caseworker-documents-screen"].includes(screenId);

  if (!shouldRefresh) {
    stopClientNotificationRefresh();
    return;
  }

  if (!state.clientPortalData.notificationRefreshIntervalId) {
    state.clientPortalData.notificationRefreshIntervalId = window.setInterval(() => {
      loadClientNotifications();
    }, 5000);
  }

  void loadClientNotifications();
}

function showServerOfflineMessage() {
  return state.lang === "es"
    ? "El servidor no esta en ejecucion. Inicie el backend."
    : "Server not running. Please start backend.";
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

function getClientProgress(client) {
  if (client.worker_status === "completed" || client.status === "completed") {
    return 100;
  }

  const missingCount = Array.isArray(client.missing_documents) ? client.missing_documents.length : 0;
  return Math.max(20, 100 - (missingCount * 25));
}

function getWorkerProfile(workerId) {
  const worker = state.countyData.workers.find((item) => item.id === workerId);
  if (!worker) return null;

  const clients = state.countyData.clients.filter((client) => client.assigned_worker === workerId);
  const averageProgress = clients.length
    ? Math.round(clients.reduce((total, client) => total + getClientProgress(client), 0) / clients.length)
    : 0;

  return {
    worker,
    office: countyWorkerOffices[workerId] || "Passaic County Main Office",
    clients,
    averageProgress
  };
}

function renderWorkers() {
  const list = document.getElementById("worker-load-list");

  list.innerHTML = state.countyData.workers.map((worker) => {
    const isRecommended = worker.id === state.countyData.recommendedWorkerId;
    const loadState = worker.active_cases >= 7 ? "high" : worker.active_cases >= 5 ? "medium" : "low";

    return `
      <button class="worker-load-card county-worker-trigger ${isRecommended ? "recommended" : ""}" type="button" data-worker-id="${escapeHtml(worker.id)}">
        <div>
          <strong>${escapeHtml(worker.name)}</strong>
          <p class="small-text">Worker ID: ${escapeHtml(worker.id)}</p>
        </div>
        <div class="worker-load-meta">
          <span class="worker-load-badge ${loadState}">${worker.active_cases} active</span>
          ${isRecommended ? '<span class="worker-recommended-flag">Recommended</span>' : ""}
        </div>
      </button>
    `;
  }).join("");

  list.querySelectorAll(".county-worker-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      openWorkerProfile(button.dataset.workerId);
    });
  });
}

function renderWorkerProfileModal() {
  const overlay = document.getElementById("county-worker-modal");
  const body = document.getElementById("county-worker-modal-body");
  const profile = state.countyData.selectedWorkerId ? getWorkerProfile(state.countyData.selectedWorkerId) : null;

  if (!profile) {
    overlay.classList.add("hidden");
    overlay.hidden = true;
    body.innerHTML = "";
    return;
  }

  body.innerHTML = `
    <div class="county-worker-profile-head">
      <div>
        <span class="panel-kicker">Staff profile</span>
        <h3>${escapeHtml(profile.worker.name)}</h3>
        <p class="small-text">${escapeHtml(profile.office)} • ${escapeHtml(profile.worker.id)}</p>
      </div>
      <span class="worker-load-badge ${profile.worker.active_cases >= 7 ? "high" : profile.worker.active_cases >= 5 ? "medium" : "low"}">
        ${profile.worker.active_cases} active cases
      </span>
    </div>

    <div class="county-worker-profile-grid">
      <div class="county-worker-profile-card">
        <span class="metric-kicker">Office</span>
        <strong>${escapeHtml(profile.office)}</strong>
        <p class="small-text">Current Passaic County assignment location.</p>
      </div>
      <div class="county-worker-profile-card">
        <span class="metric-kicker">Case load</span>
        <strong>${profile.clients.length}</strong>
        <p class="small-text">Clients currently assigned to this worker.</p>
      </div>
      <div class="county-worker-profile-card">
        <span class="metric-kicker">Client progress</span>
        <strong>${profile.averageProgress}%</strong>
        <p class="small-text">Average case progress across assigned clients.</p>
      </div>
    </div>

    <div class="county-worker-profile-section">
      <div class="county-section-head">
        <div>
          <p class="panel-kicker">Assigned clients</p>
          <strong>Current caseload</strong>
          <p class="small-text">Progress is estimated from case status and remaining document steps.</p>
        </div>
      </div>
      <div class="county-worker-client-list">
        ${profile.clients.length ? profile.clients.map((client) => `
          <article class="county-worker-client-card">
            <div class="county-worker-client-top">
              <div>
                <strong>${escapeHtml(client.name)}</strong>
                <p class="small-text">${escapeHtml(client.city)} • ${escapeHtml(client.id)}</p>
              </div>
              <span class="client-status-pill ${escapeHtml(client.status)}">${escapeHtml(client.status)}</span>
            </div>
            <div class="county-worker-progress-row">
              <span class="small-text">${getClientProgress(client)}% complete</span>
              <span class="small-text">${Math.max(0, Array.isArray(client.missing_documents) ? client.missing_documents.length : 0)} document steps left</span>
            </div>
            <div class="county-worker-progress-bar">
              <span style="width: ${getClientProgress(client)}%"></span>
            </div>
          </article>
        `).join("") : '<div class="county-empty-state">No clients assigned to this worker yet.</div>'}
      </div>
    </div>
  `;

  overlay.classList.remove("hidden");
  overlay.hidden = false;
}

function openWorkerProfile(workerId) {
  state.countyData.selectedWorkerId = workerId;
  renderWorkerProfileModal();
}

function closeWorkerProfile() {
  state.countyData.selectedWorkerId = null;
  renderWorkerProfileModal();
}

function renderNotifications() {
  const list = document.getElementById("county-notification-list");

  if (!state.countyData.notifications.length) {
    list.innerHTML = `<div class="county-empty-state">${localizeText("No county notifications yet.")}</div>`;
    return;
  }

  list.innerHTML = state.countyData.notifications.map((item) => {
    const timestamp = new Date(item.timestamp);
    const formatted = Number.isNaN(timestamp.getTime())
      ? localizeText("Just now")
      : timestamp.toLocaleString(getLocale(), { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    const isNew = item.id === state.countyData.highlightNotificationId;

    return `
      <div class="notification-card ${isNew ? "notification-card-new" : ""}">
        <strong>${escapeHtml(localizeText(item.message))}</strong>
        <span class="small-text">${escapeHtml(formatted)}</span>
      </div>
    `;
  }).join("");
}

function clearCountyNotifications() {
  const importantNotification = state.countyData.notifications.find(
    (item) => item.id === state.countyData.highlightNotificationId
  ) || state.countyData.notifications[0] || null;

  state.countyData.notifications = importantNotification ? [importantNotification] : [];
  state.countyData.highlightNotificationId = importantNotification ? importantNotification.id : null;
  renderNotifications();
}

function renderTransportRequests() {
  const list = document.getElementById("county-transport-request-list");

  list.innerHTML = state.countyData.transportRequests.length ? state.countyData.transportRequests.map((item) => {
    const timestamp = new Date(item.timestamp);
    const formatted = Number.isNaN(timestamp.getTime())
      ? localizeText("Just now")
      : timestamp.toLocaleString(getLocale(), { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

    return `
      <div class="notification-card">
        <strong>${escapeHtml(localizeText(item.message))}</strong>
        <span class="small-text">${escapeHtml(formatted)}</span>
      </div>
    `;
  }).join("") : `<div class="county-empty-state">${localizeText("No transportation requests yet.")}</div>`;
}

function renderCountyHousingAvailability() {
  const panel = document.getElementById("county-housing-availability");

  if (!housingData.length) {
    panel.innerHTML = `<div class="county-empty-state">${localizeText("No housing availability data yet.")}</div>`;
    return;
  }

  const rows = housingData.map((item) => {
    const availableNow = item.units;
    const comingSoon = Math.max(1, Math.round(item.units * 0.5));

    return `
      <article class="county-housing-city-card">
        <div class="county-housing-city-head">
          <div>
            <strong>${escapeHtml(item.city)}</strong>
            <p class="small-text">${localizeText("Passaic County housing network")}</p>
          </div>
          <span class="county-count-pill">${availableNow + comingSoon} total</span>
        </div>
        <div class="county-housing-stat-grid">
          <div class="county-housing-stat available">
            <span class="metric-kicker">${localizeText("Available now")}</span>
            <strong>${availableNow}</strong>
            <p class="small-text">${localizeText("Beds ready for placement now.")}</p>
          </div>
          <div class="county-housing-stat soon">
            <span class="metric-kicker">${localizeText("Coming soon")}</span>
            <strong>${comingSoon}</strong>
            <p class="small-text">${localizeText("Beds expected to open shortly.")}</p>
          </div>
        </div>
      </article>
    `;
  }).join("");

  panel.innerHTML = `
    <div class="county-housing-availability-list">
      ${rows}
    </div>
  `;
}

function renderClients() {
  const list = document.getElementById("client-request-list");
  const pendingCount = state.countyData.clients.filter((client) => client.status !== "assigned").length;
  document.getElementById("county-client-count").textContent = formatCountLabel(pendingCount, "open", "open", "abierto", "abiertos");
  const workerNameById = Object.fromEntries(state.countyData.workers.map((worker) => [worker.id, worker.name]));
  const sortedClients = [...state.countyData.clients].sort((left, right) => {
    const getPriority = (client) => {
      const hasAssignedWorker = Boolean(client.assigned_worker);
      const isPending = client.status === "pending" || client.worker_status === "pending_approval";
      const isActiveAssigned = client.status === "active" && hasAssignedWorker;

      if (!hasAssignedWorker) return 0;
      if (isPending) return 1;
      if (isActiveAssigned) return 3;
      return 2;
    };

    const priorityDiff = getPriority(left) - getPriority(right);
    if (priorityDiff !== 0) return priorityDiff;
    return String(left.id).localeCompare(String(right.id));
  });

  list.innerHTML = sortedClients.map((client) => {
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
          <span class="client-status-pill ${client.status}">${escapeHtml(getStatusText(client.status))}</span>
        </div>

        <div class="client-tag-row">${tags}</div>

        <div class="client-request-meta">
          <span class="transport-flag ${client.transportation_needed ? "needed" : "clear"}">
            ${client.transportation_needed ? (state.lang === "es" ? "Transporte necesario" : "Transport needed") : (state.lang === "es" ? "Transporte cubierto" : "Transport clear")}
          </span>
          <span class="small-text">
            ${client.assigned_worker
              ? (state.lang === "es"
                ? `Asignado a ${escapeHtml(workerNameById[client.assigned_worker] || client.assigned_worker)}`
                : `Assigned to ${escapeHtml(workerNameById[client.assigned_worker] || client.assigned_worker)}`)
              : (state.lang === "es" ? "Todavia no asignado" : "Not assigned yet")}
          </span>
        </div>

        <div class="assign-row">
          <select class="assign-worker-select" data-client-id="${escapeHtml(client.id)}">
            ${workerOptions}
          </select>
          <button class="secondary-btn assign-worker-btn" type="button" data-client-id="${escapeHtml(client.id)}">
            ${state.lang === "es" ? "Asignar" : "Assign"}
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
  renderCountyHousingAvailability();
  renderClients();
}

async function loadCountyDashboard() {
  if (state.countyData.isLoading) {
    return;
  }

  state.countyData.isLoading = true;
  const previousLatestNotificationId = state.countyData.notifications[0]?.id || null;

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
    state.countyData.highlightNotificationId =
      previousLatestNotificationId && notificationsData.notifications[0]?.id !== previousLatestNotificationId
        ? notificationsData.notifications[0].id
        : null;

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
    document.getElementById("county-housing-availability").innerHTML = `
      <div class="county-empty-state">${showServerOfflineMessage()}</div>
    `;
    document.getElementById("ai-response").innerText = showServerOfflineMessage();
  } finally {
    state.countyData.isLoading = false;
  }
}

function stopCountyAutoRefresh() {
  if (state.countyData.refreshIntervalId) {
    window.clearInterval(state.countyData.refreshIntervalId);
    state.countyData.refreshIntervalId = null;
  }
}

function syncCountyAutoRefresh() {
  const shouldRefresh =
    state.adminRole === "passaic" &&
    !document.getElementById("admin-dashboard-screen").classList.contains("hidden");

  if (!shouldRefresh) {
    stopCountyAutoRefresh();
    return;
  }

  if (state.countyData.refreshIntervalId) {
    return;
  }

  state.countyData.refreshIntervalId = window.setInterval(() => {
    loadCountyDashboard();
  }, 5000);
}

function openCountyAiPanel() {
  state.countyData.isAiPanelOpen = true;
  const panel = document.getElementById("county-ai-panel");
  panel.classList.remove("hidden");
  panel.hidden = false;
  document.getElementById("ai-input").focus();
}

function closeCountyAiPanel() {
  state.countyData.isAiPanelOpen = false;
  const panel = document.getElementById("county-ai-panel");
  panel.classList.add("hidden");
  panel.hidden = true;
}

function syncCountyAiAccess() {
  const countyAiButton = document.getElementById("county-ai-float-btn");
  const countyAiPanel = document.getElementById("county-ai-panel");
  const shouldShow =
    state.adminRole === "passaic" &&
    !document.getElementById("admin-dashboard-screen").classList.contains("hidden");

  countyAiButton.classList.toggle("hidden", !shouldShow);
  countyAiButton.hidden = !shouldShow;

  if (!shouldShow) {
    closeCountyAiPanel();
    return;
  }

  countyAiPanel.classList.toggle("hidden", !state.countyData.isAiPanelOpen);
  countyAiPanel.hidden = !state.countyData.isAiPanelOpen;
}

function resetCountyAiPanel() {
  if (state.countyData.isAiPanelOpen) {
    closeCountyAiPanel();
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
  state.pendingPhoneNumber = "";
  document.getElementById("code-entry-block").classList.add("hidden");
  document.getElementById("code-input").value = "";
}

// Keep login success separate from the screen implementation.
function showApp() {
  loadClientNotifications();
  loadClientPortalChat();
  closeClientNotificationPanel();
  hideClientChatPanel();
  applyLanguage();
  openScreen("dashboard-screen");
}

function hideClientChatPanel() {
  state.clientPortalData.isChatPanelOpen = false;
  if (state.clientPortalData.chatRefreshIntervalId) {
    window.clearInterval(state.clientPortalData.chatRefreshIntervalId);
    state.clientPortalData.chatRefreshIntervalId = null;
  }
}

async function showClientChatPanel() {
  state.clientPortalData.isChatPanelOpen = true;
  openScreen("client-chat-screen");
  await loadClientPortalChat();
  if (!state.clientPortalData.chatRefreshIntervalId) {
    state.clientPortalData.chatRefreshIntervalId = window.setInterval(async () => {
      if (!state.clientPortalData.isChatPanelOpen || document.getElementById("client-chat-screen").classList.contains("hidden")) {
        return;
      }
      await loadClientPortalChat();
    }, 4000);
  }
}

async function showClientDocuments(documentType) {
  try {
    await loadClientDocuments(state.clientPortalData.currentClientId, "client");
  } catch (error) {
    state.clientPortalData.documents = [];
  }
  openClientDocumentsPage(documentType);
}

function getCurrentClientAccount() {
  return state.clientPortalData.currentUser;
}

function getFirstName(name) {
  return name ? name.trim().split(/\s+/)[0] : "";
}

function formatChatTime(timestampRaw) {
  return formatLocalizedTime(timestampRaw);
}

function getCaseMessages(clientId, workerId) {
  return (state.caseWorkerData.messagesByClient[clientId] || []).filter((message) => (
    message.client_id === clientId &&
    (!workerId || message.worker_id === workerId)
  ));
}

function buildMessageImageHtml(message) {
  if (!message.image_data) {
    return "";
  }

  const safeName = escapeHtml(message.image_name || "shared-image");
  return `
    <a class="worker-chat-image-link" href="${message.image_data}" download="${safeName}">
      <img class="worker-chat-image" src="${message.image_data}" alt="${safeName}" />
    </a>
    <a class="worker-chat-download" href="${message.image_data}" download="${safeName}">${localizeText("Save image")}</a>
  `;
}

function buildChatMessagesHtml(messages, emptyLabel, viewerLabel, workerLabel = "Case Worker") {
  if (!messages.length) {
    return `<div class="county-empty-state">${localizeText(emptyLabel)}</div>`;
  }

  return messages.map((message) => `
    <div class="worker-chat-message ${message.sender}">
      <div class="worker-chat-message-top">
        <span class="worker-chat-sender">${message.sender === "worker" ? escapeHtml(workerLabel) : localizeText(viewerLabel)}</span>
        <span class="worker-chat-time">${escapeHtml(formatChatTime(message.timestamp))}</span>
      </div>
      ${message.text ? `<p>${escapeHtml(message.text)}</p>` : ""}
      ${buildMessageImageHtml(message)}
    </div>
  `).join("");
}

function getWorkerById(workerId) {
  return state.caseWorkerData.workers.find((worker) => worker.id === workerId)
    || state.countyData.workers.find((worker) => worker.id === workerId)
    || null;
}

function getAssignedWorkerForClient(client) {
  if (!client?.assigned_worker) {
    return null;
  }

  return getWorkerById(client.assigned_worker);
}

function getCurrentClientCase() {
  return state.caseWorkerData.clients.find((client) => client.id === state.clientPortalData.currentClientId) || null;
}

function getClientProgressStatus(client) {
  if (!client) {
    return state.lang === "es" ? "Comenzando" : "Getting started";
  }

  if (client.worker_status === "completed" || client.status === "completed") {
    return state.lang === "es" ? "Completado" : "Completed";
  }

  if (client.worker_status === "active" || client.status === "active") {
    return state.lang === "es" ? "Active" : "Active";
  }

  if (client.worker_status === "pending_approval") {
    return state.lang === "es" ? "Pendiente de aprobacion" : "Pending approval";
  }

  if (client.assigned_worker) {
    return state.lang === "es" ? "Asignado" : "Assigned";
  }

  return state.lang === "es" ? "Pendiente" : "Pending";
}

function buildClientProgressModel() {
  const account = getCurrentClientAccount();
  const client = getCurrentClientCase();
  const worker = getAssignedWorkerForClient(client);
  const missingDocuments = Array.isArray(client?.missing_documents) ? client.missing_documents : [];
  const serviceRecommendations = state.clientPortalData.serviceRecommendations || {};
  const documentAnswers = account?.documentAnswers || {};
  const hasIntake = Boolean(account?.hasCompletedIntake);
  const isAssigned = Boolean(client?.assigned_worker);
  const isActive = client?.worker_status === "active" || client?.status === "active";
  const isCompleted = client?.worker_status === "completed" || client?.status === "completed";
  const transportNeeded = Boolean(client?.transportation_needed);
  const allDocumentsReady = hasIntake && missingDocuments.length === 0;

  const stages = [
    {
      key: "account",
      title: state.lang === "es" ? "Cuenta creada" : "Account created",
      note: state.lang === "es" ? "Su portal ya esta listo para recibir actualizaciones." : "Your portal is ready to receive updates.",
      done: Boolean(account?.clientId)
    },
    {
      key: "intake",
      title: state.lang === "es" ? "Intake completado" : "Intake completed",
      note: hasIntake
        ? (state.lang === "es" ? "Sus respuestas y ubicacion ya estan guardadas." : "Your answers and locations are saved.")
        : (state.lang === "es" ? "Complete su intake para desbloquear todo el plan." : "Finish your intake to unlock the full case plan."),
      done: hasIntake
    },
    {
      key: "assignment",
      title: state.lang === "es" ? "Trabajador asignado" : "Case worker assigned",
      note: worker
        ? (state.lang === "es" ? `${worker.name} esta conectado a su caso.` : `${worker.name} is now connected to your case.`)
        : (state.lang === "es" ? "El condado aun no asigna un trabajador social." : "The county has not assigned a case worker yet."),
      done: isAssigned
    },
    {
      key: "documents",
      title: state.lang === "es" ? "Documentos en progreso" : "Documents in progress",
      note: allDocumentsReady
        ? (state.lang === "es" ? "No hay documentos faltantes en su intake actual." : "No missing documents are listed in your current intake.")
        : (state.lang === "es" ? `${missingDocuments.length} pasos de documento siguen pendientes.` : `${missingDocuments.length} document steps are still pending.`),
      done: allDocumentsReady
    },
    {
      key: "case",
      title: state.lang === "es" ? "Caso cerrado" : "Case completed",
      note: isCompleted
        ? (state.lang === "es" ? "Su caso fue marcado como completado." : "Your case has been marked complete.")
        : (state.lang === "es" ? "Este paso se completa cuando termina todo el proceso." : "This step is completed when the full process is finished."),
      done: isCompleted
    }
  ];

  const completedCount = stages.filter((stage) => stage.done).length;
  const progressPercent = Math.max(12, Math.round((completedCount / stages.length) * 100));
  const activeKey = stages.find((stage) => !stage.done)?.key || "case";

  const nextActions = [];

  if (!hasIntake) {
    nextActions.push({
      title: state.lang === "es" ? "Completar intake" : "Complete intake",
      detail: state.lang === "es" ? "Guarde sus respuestas para que el sistema pueda calcular sus siguientes pasos." : "Save your answers so the system can calculate your next steps."
    });
  }

  if (missingDocuments.includes("birth_certificate")) {
    const recommendation = serviceRecommendations.birth_certificate || null;
    nextActions.push({
      title: state.lang === "es" ? "Obtener acta de nacimiento" : "Get your birth certificate",
      detail: recommendation?.detail || (state.lang === "es" ? "Este documento aun aparece como faltante." : "This document still appears as missing."),
      officeName: recommendation?.officeName || "",
      address: recommendation?.address || "",
      links: Array.isArray(recommendation?.links) ? recommendation.links : []
    });
  }

  if (missingDocuments.includes("ssn")) {
    const recommendation = serviceRecommendations.ssn || null;
    nextActions.push({
      title: state.lang === "es" ? "Solicitar tarjeta de SSN" : "Request SSN card",
      detail: recommendation?.detail || (state.lang === "es" ? "Su dashboard todavia muestra esta tarjeta como pendiente." : "Your dashboard still shows this card as pending."),
      officeName: recommendation?.officeName || "",
      address: recommendation?.address || "",
      links: Array.isArray(recommendation?.links) ? recommendation.links : []
    });
  }

  if (missingDocuments.includes("state_id")) {
    const recommendation = serviceRecommendations.state_id || null;
    nextActions.push({
      title: state.lang === "es" ? "Terminar paso de ID estatal" : "Finish State ID step",
      detail: recommendation?.detail || (state.lang === "es" ? "La mayoria de los casos necesitan este paso para seguir avanzando." : "Most cases need this step before they can move forward."),
      officeName: recommendation?.officeName || "",
      address: recommendation?.address || "",
      links: Array.isArray(recommendation?.links) ? recommendation.links : []
    });
  }

  if (!isAssigned) {
    nextActions.push({
      title: state.lang === "es" ? "Esperar asignacion del trabajador social" : "Wait for case worker assignment",
      detail: state.lang === "es" ? "El condado le avisara cuando un trabajador sea asignado." : "The county will notify you when a worker is assigned.",
      officeName: "",
      address: "",
      links: []
    });
  } else if (isAssigned && !isActive && !isCompleted) {
    nextActions.push({
      title: state.lang === "es" ? "Revisar aprobacion del caso" : "Watch for case approval",
      detail: state.lang === "es" ? "Su trabajador ya fue asignado y el caso esta esperando activacion." : "Your worker is assigned and the case is waiting to become active.",
      officeName: "",
      address: "",
      links: []
    });
  }

  if (transportNeeded) {
    nextActions.push({
      title: state.lang === "es" ? "Seguir apoyo de transporte" : "Track transportation support",
      detail: state.lang === "es" ? "Su caso puede necesitar ayuda para llegar a citas." : "Your case may need help getting to appointments.",
      officeName: "",
      address: "",
      links: []
    });
  }

  if (worker && !isCompleted) {
    nextActions.push({
      title: state.lang === "es" ? "Enviar mensaje a su trabajador" : "Message your case worker",
      detail: state.lang === "es" ? "Use el chat para compartir avances, preguntas o documentos." : "Use chat to share updates, questions, or documents.",
      officeName: "",
      address: "",
      links: []
    });
  }

  if (!nextActions.length) {
    nextActions.push({
      title: state.lang === "es" ? "Todo va bien" : "Everything is on track",
      detail: state.lang === "es" ? "Su dashboard no muestra pasos urgentes en este momento." : "Your dashboard does not show urgent next steps right now.",
      officeName: "",
      address: "",
      links: []
    });
  }

  return {
    account,
    client,
    worker,
    missingDocuments,
    hasIntake,
    transportNeeded,
    progressPercent,
    activeKey,
    stages,
    nextActions,
    statusText: getClientProgressStatus(client),
    documentsLeftText: state.lang === "es"
      ? `${missingDocuments.length} pendientes`
      : `${missingDocuments.length} left`,
    transportText: transportNeeded
      ? (state.lang === "es" ? "Apoyo necesario" : "Support needed")
      : (state.lang === "es" ? "No urgente" : "Not urgent"),
    workerNameText: worker ? worker.name : (state.lang === "es" ? "No asignado" : "Not assigned"),
    notes: {
      status: isCompleted
        ? (state.lang === "es" ? "Todos los pasos principales del caso estan terminados." : "All major case steps are finished.")
        : isActive
          ? (state.lang === "es" ? "Su caso esta en movimiento y recibiendo apoyo activo." : "Your case is moving and receiving active support.")
          : (state.lang === "es" ? "Su dashboard esta esperando la siguiente actualizacion del sistema." : "Your dashboard is waiting for the next system update."),
      documents: hasIntake
        ? (missingDocuments.length
            ? (state.lang === "es" ? `Faltan ${missingDocuments.length} documentos o pasos de documento.` : `${missingDocuments.length} documents or document steps remain.`)
            : (state.lang === "es" ? "No hay documentos faltantes en este momento." : "No missing documents right now."))
        : (state.lang === "es" ? "Complete el intake para calcular los documentos faltantes." : "Complete intake to calculate missing documents."),
      worker: worker
        ? (state.lang === "es" ? `${worker.name} esta siguiendo su caso.` : `${worker.name} is following your case.`)
        : (state.lang === "es" ? "Todavia no hay trabajador social conectado." : "There is no case worker connected yet."),
      transport: transportNeeded
        ? (state.lang === "es" ? "La ayuda de transporte puede ser importante para sus citas." : "Transportation help may be important for your appointments.")
        : (state.lang === "es" ? "No hay barrera de transporte marcada ahora mismo." : "No transportation barrier is marked right now.")
    },
    planSummary: [
      documentAnswers.hasBirth === false ? getDocumentTypeLabel("birth_certificate") : null,
      documentAnswers.hasSSN === false ? getDocumentTypeLabel("ssn") : null,
      documentAnswers.hasID === false ? getDocumentTypeLabel("state_id") : null
    ].filter(Boolean)
  };
}

function renderClientActionLinks(links = []) {
  if (!Array.isArray(links) || !links.length) {
    return "";
  }

  return `
    <div class="client-action-links">
      ${links.map((link) => `
        <a
          class="client-action-link"
          href="${escapeHtml(link.url || "#")}"
          target="_blank"
          rel="noreferrer noopener"
        >${escapeHtml(link.label || "Open link")}</a>
      `).join("")}
    </div>
  `;
}

function renderClientProgressDashboard() {
  const model = buildClientProgressModel();
  const progressBar = document.getElementById("client-progress-score-bar");
  document.getElementById("client-progress-score-value").textContent = `${model.progressPercent}%`;
  progressBar.style.width = `${model.progressPercent}%`;
  document.getElementById("client-progress-status").textContent = model.statusText;
  document.getElementById("client-progress-doc-count").textContent = model.documentsLeftText;
  document.getElementById("client-progress-worker-name").textContent = model.workerNameText;
  document.getElementById("client-progress-transport-status").textContent = model.transportText;
  document.getElementById("client-progress-status-note").textContent = model.notes.status;
  document.getElementById("client-progress-doc-note").textContent = model.notes.documents;
  document.getElementById("client-progress-worker-note").textContent = model.notes.worker;
  document.getElementById("client-progress-transport-note").textContent = model.notes.transport;

  const stageList = document.getElementById("client-stage-list");
  stageList.innerHTML = model.stages.map((stage) => {
    const stageState = stage.done ? "done" : (stage.key === model.activeKey ? "active" : "todo");
    const pill = stage.done
      ? (state.lang === "es" ? "Listo" : "Done")
      : (stage.key === model.activeKey ? (state.lang === "es" ? "Actual" : "Current") : (state.lang === "es" ? "Sigue" : "Next"));
    const icon = stage.done ? "✓" : (stage.key === model.activeKey ? "•" : "○");

    return `
      <article class="client-stage-item ${stageState}">
        <span class="client-stage-icon" aria-hidden="true">${icon}</span>
        <div>
          <strong>${escapeHtml(stage.title)}</strong>
          <p class="small-text">${escapeHtml(stage.note)}</p>
        </div>
        <span class="client-stage-pill">${escapeHtml(pill)}</span>
      </article>
    `;
  }).join("");

  const actionList = document.getElementById("client-action-list");
  actionList.innerHTML = model.nextActions.map((action) => `
    <article class="client-action-item">
      <strong>${escapeHtml(action.title)}</strong>
      <p class="small-text">${escapeHtml(action.detail)}</p>
      ${action.officeName ? `<p class="small-text client-action-office"><strong>${escapeHtml(action.officeName)}</strong></p>` : ""}
      ${action.address ? `<p class="small-text client-action-address">${escapeHtml(action.address)}</p>` : ""}
      ${renderClientActionLinks(action.links)}
    </article>
  `).join("");
}

async function openClientProgressDashboard() {
  const screen = document.getElementById("client-progress-screen");
  if (!screen) {
    return;
  }

  openScreen("client-progress-screen");
  await loadClientServiceRecommendations();
  renderClientProgressDashboard();
}

function getWorkerInitials(worker) {
  const name = worker?.name || "Case Worker";

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function buildClientChatWorkerCard(worker, messages) {
  const isEs = state.lang === "es";

  if (!worker) {
    return `
      <div class="client-chat-profile-card empty">
        <div class="client-chat-avatar muted">?</div>
        <div>
          <strong>${isEs ? "Aun no tiene trabajador social asignado" : "No case worker assigned yet"}</strong>
          <p class="small-text">${isEs ? "Cuando se asigne uno, aqui vera su nombre, horario, contacto y perfil." : "Once one is assigned, you will see their name, schedule, contact details, and profile here."}</p>
        </div>
      </div>
    `;
  }

  const lastMessage = messages[messages.length - 1] || null;
  const languageList = Array.isArray(worker.languages) && worker.languages.length ? worker.languages.join(", ") : (isEs ? "Ingles" : "English");
  const specialties = Array.isArray(worker.specialties) && worker.specialties.length
    ? worker.specialties.map((item) => `<span class="client-chat-chip">${escapeHtml(item)}</span>`).join("")
    : `<span class="client-chat-chip">${isEs ? "Apoyo general del caso" : "General case support"}</span>`;

  return `
    <div class="client-chat-profile-card">
      <div class="client-chat-profile-top">
        <div class="client-chat-avatar">${escapeHtml(getWorkerInitials(worker))}</div>
        <div class="client-chat-profile-copy">
          <strong>${escapeHtml(worker.name)}</strong>
          <p>${escapeHtml(worker.title || (isEs ? "Trabajador social" : "Case Worker"))}</p>
          <span class="client-chat-profile-meta">${escapeHtml(worker.office || "Passaic County Main Office")}</span>
        </div>
      </div>
      <p class="small-text client-chat-bio">${escapeHtml(worker.bio || (isEs ? "Su trabajador social puede ayudar con documentos, pasos del caso y coordinacion." : "Your case worker can help with documents, case steps, and coordination."))}</p>
      <button class="secondary-btn client-chat-profile-toggle" type="button" id="client-chat-profile-toggle-btn">
        ${state.clientPortalData.showWorkerProfile ? (isEs ? "Ocultar perfil" : "Hide profile") : (isEs ? "Ver perfil completo" : "View full profile")}
      </button>
      ${state.clientPortalData.showWorkerProfile ? `
        <div class="client-chat-profile-details">
          <div class="client-chat-detail-row">
            <span>${isEs ? "Disponibilidad" : "Availability"}</span>
            <strong>${escapeHtml(worker.availability || (isEs ? "Lun-Vie, 9 AM - 5 PM" : "Mon-Fri, 9 AM - 5 PM"))}</strong>
          </div>
          <div class="client-chat-detail-row">
            <span>${isEs ? "Idiomas" : "Languages"}</span>
            <strong>${escapeHtml(languageList)}</strong>
          </div>
          <div class="client-chat-detail-row">
            <span>${isEs ? "Contacto" : "Contact"}</span>
            <strong>${escapeHtml(worker.phone || worker.email || (isEs ? "Disponible en el chat" : "Available in chat"))}</strong>
          </div>
          <div class="client-chat-detail-row">
            <span>${isEs ? "Ultima actividad" : "Last update"}</span>
            <strong>${escapeHtml(lastMessage ? formatChatTime(lastMessage.timestamp) : (isEs ? "Sin mensajes aun" : "No messages yet"))}</strong>
          </div>
          <div class="client-chat-specialties">
            <span>${isEs ? "Especialidades" : "Specialties"}</span>
            <div class="client-chat-chip-row">${specialties}</div>
          </div>
          <div class="client-chat-contact-links">
            ${worker.phone ? `<a class="client-chat-contact-link" href="tel:${escapeHtml(worker.phone)}">${isEs ? "Llamar" : "Call"}</a>` : ""}
            ${worker.email ? `<a class="client-chat-contact-link" href="mailto:${escapeHtml(worker.email)}">${isEs ? "Correo" : "Email"}</a>` : ""}
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

function buildClientChatQuickActions(worker) {
  const isEs = state.lang === "es";
  const responseNote = worker
    ? (isEs ? "Su trabajador social suele responder durante el horario de oficina." : "Your case worker usually replies during office hours.")
    : (isEs ? "Esperando asignacion del trabajador social." : "Waiting for case worker assignment.");

  return `
    <button class="client-chat-quick-btn" type="button" data-chat-template="${escapeHtml(isEs ? "Hola, queria compartir una actualizacion de mi caso." : "Hi, I wanted to share a quick case update.")}">
      ${isEs ? "Compartir actualizacion" : "Share update"}
    </button>
    <button class="client-chat-quick-btn" type="button" data-chat-template="${escapeHtml(isEs ? "Tengo una pregunta sobre mis documentos." : "I have a question about my documents.")}">
      ${isEs ? "Preguntar sobre documentos" : "Ask about documents"}
    </button>
    <button class="client-chat-quick-btn" type="button" data-chat-template="${escapeHtml(isEs ? "Necesito ayuda con el siguiente paso de mi caso." : "I need help with the next step in my case.")}">
      ${isEs ? "Siguiente paso" : "Next step"}
    </button>
    <span class="client-chat-response-note">${responseNote}</span>
  `;
}

function getChatTranscript(client, messages) {
  return messages.map((message) => {
    const sender = message.sender === "worker" ? localizeText("Case Worker") : client.name;
    const imageLine = message.image_name ? ` [Image: ${message.image_name}]` : "";
    return `[${formatChatTime(message.timestamp)}] ${sender}: ${message.text || ""}${imageLine}`.trim();
  }).join("\n");
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

async function setPendingChatImage(file, owner) {
  if (!file) {
    if (owner === "client") {
      state.clientPortalData.pendingImage = null;
    } else {
      state.caseWorkerData.pendingChatImage = null;
    }
    return;
  }

  const imagePayload = {
    name: file.name,
    type: file.type || "image/jpeg",
    data: await readFileAsDataUrl(file)
  };

  if (owner === "client") {
    state.clientPortalData.pendingImage = imagePayload;
  } else {
    state.caseWorkerData.pendingChatImage = imagePayload;
  }
}

function clearPendingChatImage(owner) {
  if (owner === "client") {
    state.clientPortalData.pendingImage = null;
    const input = document.getElementById("client-chat-image-input");
    if (input) input.value = "";
  } else {
    state.caseWorkerData.pendingChatImage = null;
    const input = document.getElementById("worker-chat-image-input");
    if (input) input.value = "";
  }
}

async function postChatMessage({ clientId, workerId, sender, text, image }) {
  return fetchJson("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      worker_id: workerId,
      sender,
      text,
      image_name: image?.name || null,
      image_data: image?.data || null,
      image_type: image?.type || null
    })
  });
}

function getDocumentsForType(documents, documentType) {
  return documents.filter((item) => item.document_type === documentType);
}

async function loadClientDocuments(clientId, owner = "client") {
  const data = await fetchJson(`/api/client-documents?client_id=${encodeURIComponent(clientId)}`);

  if (owner === "worker") {
    state.caseWorkerData.documents = data.documents || [];
    return state.caseWorkerData.documents;
  }

  state.clientPortalData.documents = data.documents || [];
  return state.clientPortalData.documents;
}

async function postClientDocument({ clientId, workerId, documentType, file, uploadedBy }) {
  return fetchJson("/api/client-documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      worker_id: workerId,
      document_type: documentType,
      file_name: file.name,
      file_data: file.data,
      file_type: file.type,
      uploaded_by: uploadedBy
    })
  });
}

async function deleteClientDocument(documentId, clientId) {
  return fetchJson(`/api/client-documents/${encodeURIComponent(documentId)}?client_id=${encodeURIComponent(clientId)}`, {
    method: "DELETE"
  });
}

function openClientDocumentsPage(documentType = null) {
  state.clientPortalData.selectedDocumentType = documentType;
  renderClientDocumentsView();
  openScreen("client-documents-screen");
}

async function openCaseworkerDocumentsPage(clientId, documentType = null) {
  state.caseWorkerData.fullCaseViewId = clientId;
  state.caseWorkerData.activeWorkspacePanel = null;
  try {
    await loadClientDocuments(clientId, "worker");
  } catch (error) {
    state.caseWorkerData.documents = [];
  }
  state.caseWorkerData.selectedClientId = clientId;
  state.clientPortalData.selectedDocumentType = documentType;
  renderCaseworkerDocumentsView();
  openScreen("caseworker-documents-screen");
}

function buildDocumentCardsHtml(selectedType, documents, viewerMode) {
  return DOCUMENT_TYPES.map((item) => {
    const isSelected = selectedType === item.key;
    const documentCount = getDocumentsForType(documents, item.key).length;
    const label = getDocumentTypeLabel(item.key);
    const visualClass = item.key === "state_id"
      ? "id-art"
      : item.key === "birth_certificate"
        ? "birth-art"
        : item.key === "passport"
          ? "passport-art"
          : "ssn-art";
    const description = isSelected
      ? (state.lang === "es"
        ? `Abrir ${viewerMode === "workspace" ? "area de trabajo" : "visor"} para ${label}.`
        : `Open ${viewerMode} for ${label}.`)
      : localizeText("Click to reveal this document area.");

    return `
      <button class="document-page-card ${isSelected ? "selected" : ""}" type="button" data-document-card="${item.key}">
        <span class="doc-art document-page-visual ${visualClass}" aria-hidden="true"></span>
        <span class="document-page-card-top">
          <strong>${escapeHtml(label)}</strong>
          <span class="county-count-pill">${formatCountLabel(documentCount, "file", "files", "archivo", "archivos")}</span>
        </span>
        <p class="small-text">${escapeHtml(description)}</p>
      </button>
    `;
  }).join("");
}

function buildDocumentGalleryHtml(documents, options = {}) {
  const {
    removable = false
  } = options;

  if (!documents.length) {
    return `<div class="county-empty-state">${localizeText("No uploaded files for this document yet.")}</div>`;
  }

  return documents.map((item) => `
    <article class="document-file-card">
      <a class="document-file-image-link" href="${item.file_data}" download="${escapeHtml(item.file_name)}">
        <img class="document-file-image" src="${item.file_data}" alt="${escapeHtml(item.file_name)}" />
      </a>
      <div class="document-file-meta">
        <strong>${escapeHtml(item.file_name)}</strong>
        <p class="small-text">${escapeHtml(item.uploaded_by === "worker" ? localizeText("Uploaded by case worker on") : localizeText("Uploaded by client on"))} ${escapeHtml(formatChatTime(item.uploaded_at))}</p>
        <div class="document-file-actions">
          <a class="worker-chat-download" href="${item.file_data}" download="${escapeHtml(item.file_name)}">${localizeText("Save file")}</a>
          ${removable ? `<button class="secondary-btn document-remove-btn" type="button" data-remove-document-id="${escapeHtml(item.id)}">${localizeText("Remove")}</button>` : ""}
        </div>
      </div>
    </article>
  `).join("");
}

function renderCaseworkerDocumentsView() {
  const container = document.getElementById("caseworker-documents-view");
  const client = state.caseWorkerData.clients.find((item) => item.id === state.caseWorkerData.fullCaseViewId);

  if (!client) {
    container.innerHTML = `<div class="county-empty-state">${localizeText("Select a client to manage documents.")}</div>`;
    return;
  }

  const selectedType = state.clientPortalData.selectedDocumentType;
  const selectedLabel = selectedType ? getDocumentTypeLabel(selectedType) : (state.lang === "es" ? "Documento" : "Document");
  const selectedDocuments = selectedType ? getDocumentsForType(state.caseWorkerData.documents, selectedType) : [];
  const pendingFile = selectedType ? state.caseWorkerData.pendingDocumentByType[selectedType] : null;

  container.innerHTML = `
    <div class="document-page-shell">
      <div class="screen-top-row caseworker-file-top">
        <button class="back-link-btn screen-back-btn" type="button" id="caseworker-documents-back-btn">Go Back</button>
      </div>
      <div class="caseworker-file-hero">
        <div>
          <p class="eyebrow">${localizeText("Client documents")}</p>
          <h2>${escapeHtml(client.name)}</h2>
          <p class="small-text">${escapeHtml(client.city)} • ${escapeHtml(client.id)}</p>
        </div>
      </div>
      <div class="document-page-grid">
        <aside class="caseworker-panel">
          <strong>${localizeText("Document Types")}</strong>
          <p class="small-text">${localizeText("All uploads here are linked directly to this client.")}</p>
          <div class="document-page-card-list">
            ${buildDocumentCardsHtml(selectedType, state.caseWorkerData.documents, "workspace")}
          </div>
        </aside>
        <div class="caseworker-panel">
          ${selectedType ? `
            <div class="workspace-panel-head">
              <div>
                <strong>${escapeHtml(selectedLabel)}</strong>
                <p class="small-text">${localizeText("Upload images for this document and review previously saved files.")}</p>
              </div>
            </div>
            <div class="document-upload-toolbar">
              <label class="secondary-btn chat-upload-btn" for="caseworker-document-input">${state.lang === "es" ? `Subir ${escapeHtml(selectedLabel)}` : `Upload ${escapeHtml(selectedLabel)}`}</label>
              <input id="caseworker-document-input" class="chat-upload-input" type="file" accept="image/*" />
              <button class="secondary-btn worker-save-notes-btn" type="button" id="caseworker-document-save-btn" ${pendingFile ? "" : "disabled"}>${localizeText("Save Upload")}</button>
            </div>
            <div id="caseworker-document-preview">
              ${pendingFile ? `
                <div class="chat-image-preview-card">
                  <img src="${pendingFile.data}" alt="${escapeHtml(pendingFile.name)}" />
                  <div>
                    <strong>${escapeHtml(pendingFile.name)}</strong>
                    <button class="secondary-btn chat-image-remove-btn" type="button" id="caseworker-document-remove-btn">${localizeText("Remove")}</button>
                  </div>
                </div>
              ` : ""}
            </div>
            <div class="document-file-grid">
              ${buildDocumentGalleryHtml(selectedDocuments, { removable: true })}
            </div>
          ` : `
            <div class="document-page-empty">
              <strong>${localizeText("Select one of the 4 document cards.")}</strong>
              <p class="small-text">${localizeText("Unopened documents stay blurred until clicked.")}</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  document.getElementById("caseworker-documents-back-btn").addEventListener("click", () => {
    renderCaseFileView();
    openScreen("caseworker-client-screen");
  });

  container.querySelectorAll("[data-document-card]").forEach((button) => {
    button.addEventListener("click", () => {
      state.clientPortalData.selectedDocumentType = button.dataset.documentCard;
      renderCaseworkerDocumentsView();
    });
  });

  const uploadInput = document.getElementById("caseworker-document-input");
  if (uploadInput && selectedType) {
    uploadInput.addEventListener("change", async (event) => {
      const [file] = Array.from(event.target.files || []);
      state.caseWorkerData.pendingDocumentByType[selectedType] = file ? {
        name: file.name,
        type: file.type || "image/jpeg",
        data: await readFileAsDataUrl(file)
      } : null;
      renderCaseworkerDocumentsView();
    });
  }

  const removeButton = document.getElementById("caseworker-document-remove-btn");
  if (removeButton && selectedType) {
    removeButton.addEventListener("click", () => {
      delete state.caseWorkerData.pendingDocumentByType[selectedType];
      renderCaseworkerDocumentsView();
    });
  }

  const saveButton = document.getElementById("caseworker-document-save-btn");
  if (saveButton && selectedType) {
    saveButton.addEventListener("click", async () => {
      const pending = state.caseWorkerData.pendingDocumentByType[selectedType];
      if (!pending) return;

      await postClientDocument({
        clientId: client.id,
        workerId: state.caseWorkerData.currentWorkerId,
        documentType: selectedType,
        file: pending,
        uploadedBy: "worker"
      });

      delete state.caseWorkerData.pendingDocumentByType[selectedType];
      await loadClientDocuments(client.id, "worker");
      if (state.clientPortalData.currentClientId === client.id) {
        await loadClientDocuments(client.id, "client");
      }
      renderCaseworkerDocumentsView();
    });
  }

  container.querySelectorAll("[data-remove-document-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      await deleteClientDocument(button.dataset.removeDocumentId, client.id);
      await loadClientDocuments(client.id, "worker");
      if (state.clientPortalData.currentClientId === client.id) {
        await loadClientDocuments(client.id, "client");
      }
      renderCaseworkerDocumentsView();
    });
  });
}

function renderClientDocumentsView() {
  const container = document.getElementById("client-documents-view");
  const account = getCurrentClientAccount();
  const currentClient = state.caseWorkerData.clients.find((item) => item.id === state.clientPortalData.currentClientId) || null;
  const selectedType = state.clientPortalData.selectedDocumentType;
  const selectedLabel = selectedType ? getDocumentTypeLabel(selectedType) : (state.lang === "es" ? "Documento" : "Document");
  const selectedDocuments = selectedType ? getDocumentsForType(state.clientPortalData.documents, selectedType) : [];
  const pendingFile = selectedType ? state.clientPortalData.pendingDocumentByType[selectedType] : null;

  container.innerHTML = `
    <div class="document-page-shell">
      <div class="screen-top-row caseworker-file-top">
        <button class="back-link-btn screen-back-btn" type="button" id="client-documents-back-btn">Go Back</button>
      </div>
      <div class="caseworker-file-hero">
        <div>
          <p class="eyebrow">${localizeText("My documents")}</p>
          <h2>${escapeHtml(account?.name || localizeText("Client Documents"))}</h2>
          <p class="small-text">${localizeText("Files uploaded by your case worker for your case.")}</p>
        </div>
      </div>
      <div class="caseworker-panel client-document-card-panel">
        <strong>${localizeText("Document Types")}</strong>
        <p class="small-text">${localizeText("Click a card to reveal that document section.")}</p>
        <div class="client-document-card-grid">
          ${buildDocumentCardsHtml(selectedType, state.clientPortalData.documents, "viewer")}
        </div>
      </div>
      <div class="caseworker-panel">
        <div class="document-page-empty">
          <strong>${localizeText("Select one of the 4 document cards.")}</strong>
          <p class="small-text">${localizeText("Click a card to reveal that document section.")}</p>
        </div>
      </div>
      ${selectedType ? `
        <div class="workspace-overlay">
          <div class="workspace-modal document-modal">
            <div class="workspace-panel-body">
              <div class="workspace-panel-head">
                <div>
                  <strong>${escapeHtml(selectedLabel)}</strong>
                  <p class="small-text">${localizeText("These are the files currently saved to your case.")}</p>
                </div>
                <button class="chat-close-btn workspace-close-btn" type="button" id="client-document-close-btn">X</button>
              </div>
              <div class="document-upload-toolbar">
                <label class="secondary-btn chat-upload-btn" for="client-document-input">${state.lang === "es" ? `Subir ${escapeHtml(selectedLabel)}` : `Upload ${escapeHtml(selectedLabel)}`}</label>
                <input id="client-document-input" class="chat-upload-input" type="file" accept="image/*" />
                <button class="secondary-btn worker-save-notes-btn" type="button" id="client-document-save-btn" ${pendingFile ? "" : "disabled"}>${localizeText("Save Upload")}</button>
              </div>
              <div id="client-document-preview">
                ${pendingFile ? `
                  <div class="chat-image-preview-card">
                    <img src="${pendingFile.data}" alt="${escapeHtml(pendingFile.name)}" />
                    <div>
                      <strong>${escapeHtml(pendingFile.name)}</strong>
                      <button class="secondary-btn chat-image-remove-btn" type="button" id="client-document-remove-btn">${localizeText("Remove")}</button>
                    </div>
                  </div>
                ` : ""}
              </div>
              <div class="document-file-grid">
                ${buildDocumentGalleryHtml(selectedDocuments, { removable: true })}
              </div>
            </div>
          </div>
        </div>
      ` : ""}
    </div>
  `;

  document.getElementById("client-documents-back-btn").addEventListener("click", () => {
    openScreen("dashboard-screen");
  });

  container.querySelectorAll("[data-document-card]").forEach((button) => {
    button.addEventListener("click", () => {
      state.clientPortalData.selectedDocumentType = button.dataset.documentCard;
      renderClientDocumentsView();
    });
  });

  const closeButton = document.getElementById("client-document-close-btn");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      state.clientPortalData.selectedDocumentType = null;
      renderClientDocumentsView();
    });
  }

  const uploadInput = document.getElementById("client-document-input");
  if (uploadInput && selectedType) {
    uploadInput.addEventListener("change", async (event) => {
      const [file] = Array.from(event.target.files || []);
      state.clientPortalData.pendingDocumentByType[selectedType] = file ? {
        name: file.name,
        type: file.type || "image/jpeg",
        data: await readFileAsDataUrl(file)
      } : null;
      renderClientDocumentsView();
    });
  }

  const removePendingButton = document.getElementById("client-document-remove-btn");
  if (removePendingButton && selectedType) {
    removePendingButton.addEventListener("click", () => {
      delete state.clientPortalData.pendingDocumentByType[selectedType];
      renderClientDocumentsView();
    });
  }

  const saveButton = document.getElementById("client-document-save-btn");
  if (saveButton && selectedType) {
    saveButton.addEventListener("click", async () => {
      const pending = state.clientPortalData.pendingDocumentByType[selectedType];
      if (!pending) return;

      await postClientDocument({
        clientId: state.clientPortalData.currentClientId,
        workerId: currentClient?.assigned_worker || null,
        documentType: selectedType,
        file: pending,
        uploadedBy: "client"
      });

      delete state.clientPortalData.pendingDocumentByType[selectedType];
      await loadClientDocuments(state.clientPortalData.currentClientId, "client");
      if (currentClient?.assigned_worker) {
        await loadClientDocuments(state.clientPortalData.currentClientId, "worker");
      }
      renderClientDocumentsView();
    });
  }

  container.querySelectorAll("[data-remove-document-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      await deleteClientDocument(button.dataset.removeDocumentId, state.clientPortalData.currentClientId);
      await loadClientDocuments(state.clientPortalData.currentClientId, "client");
      renderClientDocumentsView();
    });
  });
}

function renderClientPortalChat() {
  const client = state.caseWorkerData.clients.find((item) => item.id === state.clientPortalData.currentClientId);
  const worker = getAssignedWorkerForClient(client);
  const messages = getCaseMessages(state.clientPortalData.currentClientId, client?.assigned_worker || null);
  const isCompleted = client?.worker_status === "completed";
  const workerCard = document.getElementById("client-chat-worker-card");
  const quickActions = document.getElementById("client-chat-quick-actions");
  const history = document.getElementById("client-chat-history");
  const status = document.getElementById("client-chat-status");
  const input = document.getElementById("client-chat-input");
  const send = document.getElementById("client-chat-send-btn");
  const note = document.getElementById("client-chat-note");
  const preview = document.getElementById("client-chat-image-preview");
  const subtitle = document.getElementById("client-chat-subtitle");
  const pendingImage = state.clientPortalData.pendingImage;

  if (workerCard) {
    workerCard.innerHTML = buildClientChatWorkerCard(worker, messages);
    const toggleButton = document.getElementById("client-chat-profile-toggle-btn");

    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        state.clientPortalData.showWorkerProfile = !state.clientPortalData.showWorkerProfile;
        renderClientPortalChat();
      });
    }
  }

  if (quickActions) {
    quickActions.innerHTML = buildClientChatQuickActions(worker);
    quickActions.querySelectorAll("[data-chat-template]").forEach((button) => {
      button.addEventListener("click", () => {
        if (input && !input.disabled) {
          input.value = button.dataset.chatTemplate || "";
          input.focus();
        }
      });
    });
  }

  history.innerHTML = buildChatMessagesHtml(messages, "No messages yet.", "You", worker?.name || "Case Worker");
  history.scrollTop = history.scrollHeight;

  if (subtitle) {
    subtitle.textContent = worker
      ? (state.lang === "es"
        ? `${worker.name} puede ayudarle con documentos, imagenes y actualizaciones del caso.`
        : `${worker.name} can help with documents, image sharing, and case updates.`)
      : (state.lang === "es"
        ? "El chat se activara en cuanto se le asigne un trabajador social."
        : "Chat will activate as soon as a case worker is assigned.");
  }

  status.textContent = isCompleted
    ? (state.lang === "es" ? "🔒 Caso completado - Chat cerrado" : "🔒 Case Completed - Chat Closed")
    : (state.lang === "es" ? "🟢 Caso activo" : "🟢 Case Active");
  status.classList.toggle("locked", isCompleted);
  status.classList.toggle("active", !isCompleted);
  input.disabled = Boolean(isCompleted);
  send.disabled = Boolean(isCompleted);
  input.placeholder = isCompleted
    ? localizeText("Case completed. Chat is closed.")
    : (state.lang === "es" ? "Escriba un mensaje para su trabajador social" : "Type a message to your case worker");
  note.textContent = isCompleted
    ? localizeText("Case completed. Chat is closed.")
    : (!worker ? localizeText("No case worker is assigned to this case yet.") : "");

  if (preview) {
    preview.innerHTML = pendingImage ? `
      <div class="chat-image-preview-card">
        <img src="${pendingImage.data}" alt="${escapeHtml(pendingImage.name)}" />
        <div>
          <strong>${escapeHtml(pendingImage.name)}</strong>
          <button class="secondary-btn chat-image-remove-btn" type="button" id="client-chat-image-remove-btn" ${isCompleted ? "disabled" : ""}>${localizeText("Remove")}</button>
        </div>
      </div>
    ` : "";

    const removeButton = document.getElementById("client-chat-image-remove-btn");
    if (removeButton) {
      removeButton.addEventListener("click", () => {
        clearPendingChatImage("client");
        renderClientPortalChat();
      });
    }
  }
}

async function loadClientPortalChat() {
  try {
    const [clientsData, workersData] = await Promise.all([
      fetchJson("/api/clients"),
      fetchJson("/api/workers")
    ]);
    state.caseWorkerData.clients = clientsData.clients;
    state.caseWorkerData.workers = workersData.workers || [];
    state.countyData.workers = workersData.workers || state.countyData.workers;
    const currentClient = state.caseWorkerData.clients.find((item) => item.id === state.clientPortalData.currentClientId);

    await loadClientMessages(state.clientPortalData.currentClientId, currentClient?.assigned_worker || null);
    await loadClientServiceRecommendations();
    if (!document.getElementById("client-progress-screen").classList.contains("hidden")) {
      renderClientProgressDashboard();
    }
    if (state.clientPortalData.isChatPanelOpen) {
      renderClientPortalChat();
    }
  } catch (error) {
    if (!document.getElementById("client-progress-screen").classList.contains("hidden")) {
      renderClientProgressDashboard();
    }
    if (state.clientPortalData.isChatPanelOpen) {
      document.getElementById("client-chat-history").innerHTML = `<div class="county-empty-state">${showServerOfflineMessage()}</div>`;
      document.getElementById("client-chat-note").textContent = showServerOfflineMessage();
    }
  }
}

async function sendClientMessage() {
  const input = document.getElementById("client-chat-input");
  const clientId = state.clientPortalData.currentClientId;
  const client = state.caseWorkerData.clients.find((item) => item.id === clientId);
  const image = state.clientPortalData.pendingImage;

  if (!input || !client) return;
  if (!client.assigned_worker) {
    document.getElementById("client-chat-note").textContent = localizeText("No case worker is assigned to this case yet.");
    return;
  }
  if (client.worker_status === "completed") {
    renderClientPortalChat();
    return;
  }

  const text = input.value.trim();
  if (!text && !image) return;

  try {
    state.caseWorkerData.chatNotices[clientId] = "";
    await postChatMessage({
      clientId: state.clientPortalData.currentClientId,
      workerId: client.assigned_worker,
      sender: "client",
      text,
      image
    });
    input.value = "";
    clearPendingChatImage("client");
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

function getCurrentCases() {
  return state.caseWorkerData.clients.filter((client) => (
    isAssignedToCurrentWorker(client) && client.worker_status !== "completed" && client.worker_status !== "rejected"
  ));
}

function getCaseStatusLabel(client) {
  if (client.status === "completed") return state.lang === "es" ? "Completado" : "Completed";
  if (client.worker_status === "pending_approval" || client.status === "pending") return state.lang === "es" ? "Pendiente" : "Pending";
  return state.lang === "es" ? "Activo" : "Active";
}

function renderWorkerClientList(clients) {
  const list = document.getElementById("worker-case-list");

  if (!clients.length) {
    list.innerHTML = `<div class="county-empty-state">${localizeText("No current cases yet.")}</div>`;
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
        <button class="secondary-btn worker-select-btn" type="button" data-client-id="${escapeHtml(client.id)}">${localizeText("Open")}</button>
      </div>
    </article>
  `).join("");

  list.querySelectorAll(".worker-select-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      await openCase(button.dataset.clientId);
    });
  });
}

function renderWorkerNotifications() {
  const list = document.getElementById("worker-notification-list");
  const notifications = state.caseWorkerData.notifications || [];

  document.getElementById("worker-notification-count").textContent = formatCountLabel(notifications.length, "alert", "alerts", "alerta", "alertas");

  if (!notifications.length) {
    list.innerHTML = `<div class="county-empty-state">${localizeText("No notifications yet.")}</div>`;
    return;
  }

  list.innerHTML = notifications.map((item) => {
    const timestamp = new Date(item.timestamp);
    const formatted = Number.isNaN(timestamp.getTime())
      ? localizeText("Just now")
      : timestamp.toLocaleString(getLocale(), { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

    return `
      <div class="notification-card">
        <strong>${escapeHtml(localizeText(item.message))}</strong>
        <span class="small-text">${escapeHtml(item.source === "client" ? localizeText("Client update") : localizeText("County update"))}</span>
        <span class="small-text">${escapeHtml(formatted)}</span>
      </div>
    `;
  }).join("");
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
  state.caseWorkerData.activeWorkspacePanel = null;
  state.caseWorkerData.showChatImagesOnly = false;
  clearPendingChatImage("worker");
  await loadMessages(clientId);
  renderCaseFileView();
  openScreen("caseworker-client-screen");
}

function closeCaseFileView() {
  state.caseWorkerData.fullCaseViewId = null;
  state.caseWorkerData.activeWorkspacePanel = null;
  state.caseWorkerData.showChatImagesOnly = false;
  clearPendingChatImage("worker");
  openScreen("admin-dashboard-screen");
  renderCaseWorkerDashboard();
}

function renderHousingOpportunities() {
  const eligibleClients = state.caseWorkerData.clients.filter((client) => client.missing_documents.length === 0);
  document.getElementById("eligible-clients-count").textContent = `${eligibleClients.length} ${localizeText("eligible")}`;
  document.getElementById("housing-opportunity-list").innerHTML = housingData.map((item) => `
    <div class="housing-opportunity-card">
      <strong>${escapeHtml(item.city)}</strong>
      <span class="small-text">${item.units} ${localizeText("units")}</span>
    </div>
  `).join("");
}

function getDocumentStatus(client, documentKey) {
  if (client.missing_documents.includes(documentKey)) {
    if (documentKey === "ssn") return `⏳ ${localizeText("In Progress")}`;
    return `❌ ${localizeText("Missing")}`;
  }

  return `✅ ${localizeText("Completed")}`;
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

function openWorkspacePanel(panelName) {
  state.caseWorkerData.activeWorkspacePanel = panelName;
  if (panelName !== "chat") {
    state.caseWorkerData.showChatImagesOnly = false;
  }
  renderCaseFileView();
}

function closeWorkspacePanel() {
  state.caseWorkerData.activeWorkspacePanel = null;
  state.caseWorkerData.showChatImagesOnly = false;
  clearPendingChatImage("worker");
  renderCaseFileView();
}

function getCaseActivityItems(client) {
  const transportRequests = state.caseWorkerData.notifications.filter((item) => (
    item.message && item.message.includes(client.name)
  ));
  const messages = getCaseMessages(client.id, state.caseWorkerData.currentWorkerId);

  return [
    {
      label: "Case status",
      detail: client.worker_status === "completed" ? "Case completed" : client.worker_status === "pending_approval" ? "Pending approval" : "Case active"
    },
    ...transportRequests.slice(0, 3).map((item) => ({
      label: "Alert",
      detail: `${item.message} • ${formatChatTime(item.timestamp)}`
    })),
    ...messages.slice(-4).map((message) => ({
      label: message.sender === "worker" ? "Worker message" : "Client message",
      detail: `${message.text || (message.image_name ? `Shared ${message.image_name}` : "Sent an update")} • ${formatChatTime(message.timestamp)}`
    }))
  ];
}

function buildWorkspacePanelContent(client) {
  const panelName = state.caseWorkerData.activeWorkspacePanel;
  const notes = state.caseWorkerData.notes[client.id] || "";
  const uploads = ["birth_certificate", "ssn", "state_id"].map((key) => ({
    key,
    label: formatDocumentLabel(key),
    files: state.caseWorkerData.documentUploads[`${client.id}:${key}`] || []
  }));
  const messages = getCaseMessages(client.id, state.caseWorkerData.currentWorkerId);
  const onlyImages = state.caseWorkerData.showChatImagesOnly;
  const visibleMessages = onlyImages ? messages.filter((message) => message.image_data) : messages;
  const isCompleted = client.worker_status === "completed";
  const pendingImage = state.caseWorkerData.pendingChatImage;

  if (panelName === "documents") {
    return `
      <div class="workspace-panel-body">
        <div class="workspace-panel-head">
          <div>
            <strong>Document Uploads</strong>
            <p class="small-text">Upload or review client files by document type.</p>
          </div>
          <button class="chat-close-btn workspace-close-btn" type="button" id="workspace-close-btn">X</button>
        </div>
        <div class="workspace-doc-grid">
          ${uploads.map((item) => `
            <div class="worker-detail-block workspace-doc-card">
              <strong>${escapeHtml(item.label)}</strong>
              <p class="small-text">${item.files.length ? `${item.files.length} file(s) selected` : "No files selected yet."}</p>
              <input class="workspace-file-input" id="upload-${client.id}-${item.key}" type="file" multiple />
              <button class="secondary-btn worker-save-notes-btn workspace-upload-btn" type="button" data-upload-doc="${item.key}">Save File List</button>
              ${item.files.length ? `<div class="workspace-chip-row">${item.files.map((fileName) => `<span class="document-tag">${escapeHtml(fileName)}</span>`).join("")}</div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  if (panelName === "notes") {
    return `
      <div class="workspace-panel-body">
        <div class="workspace-panel-head">
          <div>
            <strong>Case Notes</strong>
            <p class="small-text">Keep notes for this client file. Notes stay on screen during this session.</p>
          </div>
          <button class="chat-close-btn workspace-close-btn" type="button" id="workspace-close-btn">X</button>
        </div>
        <div class="worker-detail-block">
          <label for="workspace-notes-input">Notes</label>
          <textarea id="workspace-notes-input" rows="10" placeholder="Document barriers, next steps, appointment updates...">${escapeHtml(notes)}</textarea>
          <button class="secondary-btn worker-save-notes-btn" type="button" id="workspace-notes-save-btn">Save Notes</button>
        </div>
      </div>
    `;
  }

  if (panelName === "activity") {
    const activityItems = getCaseActivityItems(client);

    return `
      <div class="workspace-panel-body">
        <div class="workspace-panel-head">
          <div>
            <strong>Case Activity</strong>
            <p class="small-text">Recent case updates, transport alerts, and message activity.</p>
          </div>
          <button class="chat-close-btn workspace-close-btn" type="button" id="workspace-close-btn">X</button>
        </div>
        <div class="workspace-activity-list">
          ${activityItems.length ? activityItems.map((item) => `
            <div class="worker-detail-block workspace-activity-card">
              <strong>${escapeHtml(item.label)}</strong>
              <p class="small-text">${escapeHtml(item.detail)}</p>
            </div>
          `).join("") : '<div class="county-empty-state">No activity yet.</div>'}
        </div>
      </div>
    `;
  }

  if (panelName === "chat") {
    return `
      <div class="workspace-panel-body workspace-chat-panel">
        <div class="workspace-panel-head">
          <div>
            <strong>Client Chat</strong>
            <p class="small-text">Live case conversation. History stays available until this case is marked complete.</p>
          </div>
          <div class="workspace-chat-actions">
            <button class="secondary-btn workspace-action-btn" type="button" id="workspace-chat-refresh-btn">Refresh</button>
            <button class="secondary-btn workspace-action-btn" type="button" id="workspace-chat-save-btn">Save Chat</button>
            <button class="secondary-btn workspace-action-btn" type="button" id="workspace-chat-images-btn">${onlyImages ? "Show All" : "Shared Images"}</button>
            <button class="chat-close-btn workspace-close-btn" type="button" id="workspace-close-btn">X</button>
          </div>
        </div>
        <div class="worker-chat-history workspace-chat-history" id="workspace-chat-history">
          ${buildChatMessagesHtml(visibleMessages, onlyImages ? "No shared images yet." : "No messages yet.", "Client")}
        </div>
        <div id="worker-chat-image-preview">
          ${pendingImage ? `
            <div class="chat-image-preview-card">
              <img src="${pendingImage.data}" alt="${escapeHtml(pendingImage.name)}" />
              <div>
                <strong>${escapeHtml(pendingImage.name)}</strong>
                <button class="secondary-btn chat-image-remove-btn" type="button" id="worker-chat-image-remove-btn" ${isCompleted ? "disabled" : ""}>Remove</button>
              </div>
            </div>
          ` : ""}
        </div>
        <div class="worker-chat-compose worker-chat-compose-rich">
          <input id="worker-chat-input" type="text" placeholder="${isCompleted ? "Case completed. Chat is closed." : "Type a message"}" ${isCompleted ? "disabled" : ""} />
          <label class="secondary-btn chat-upload-btn ${isCompleted ? "disabled" : ""}" for="worker-chat-image-input">Upload Image</label>
          <input id="worker-chat-image-input" class="chat-upload-input" type="file" accept="image/*" ${isCompleted ? "disabled" : ""} />
          <button class="secondary-btn worker-chat-send-btn" type="button" ${isCompleted ? "disabled" : ""}>Send</button>
        </div>
        <p class="small-text worker-inline-message" id="workspace-chat-note">${isCompleted ? "Case completed. Chat history has been cleared." : (state.caseWorkerData.chatNotices[client.id] || "")}</p>
      </div>
    `;
  }

  return "";
}

function renderCaseFileView() {
  const container = document.getElementById("caseworker-full-view");
  const selectedClient = state.caseWorkerData.clients.find((client) => client.id === state.caseWorkerData.fullCaseViewId);

  if (!selectedClient) {
    container.innerHTML = `<div class="county-empty-state">Select a client to open the full file.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="caseworker-file-shell">
      <div class="screen-top-row caseworker-file-top">
        <button class="back-link-btn screen-back-btn" type="button" id="caseworker-file-back-btn">Go Back</button>
      </div>

      <div class="caseworker-file-hero">
        <div>
          <p class="eyebrow">Client workspace</p>
          <h2>${escapeHtml(selectedClient.name)}</h2>
          <p class="small-text">${escapeHtml(selectedClient.city)} • ${escapeHtml(selectedClient.id)}</p>
        </div>
        <div class="caseworker-file-meta">
          <span class="client-status-pill ${selectedClient.worker_status === "completed" ? "completed" : (selectedClient.worker_status === "pending_approval" ? "pending" : "assigned")}">
            ${selectedClient.worker_status === "completed" ? "Completed" : (selectedClient.worker_status === "pending_approval" ? "Pending" : "Active")}
          </span>
        </div>
      </div>

      <div class="caseworker-file-grid">
        <div class="caseworker-file-main">
          <div class="caseworker-panel">
            <div class="county-section-head">
              <div>
                <strong>📁 Client File</strong>
                <p class="small-text">Choose a workspace below. Each card opens a responsive panel for this client.</p>
              </div>
            </div>
            <div class="caseworker-workspace-placeholder-grid">
              <button class="worker-detail-block workspace-launch-card" type="button" data-panel="documents">
                <strong>Document Uploads</strong>
                <p class="small-text">Review required documents and attach image or file selections.</p>
              </button>
              <button class="worker-detail-block workspace-launch-card" type="button" data-panel="chat">
                <strong>Client Chat</strong>
                <p class="small-text">Open the live chat popup for saved messages and shared images.</p>
              </button>
              <button class="worker-detail-block workspace-launch-card" type="button" data-panel="notes">
                <strong>Case Notes</strong>
                <p class="small-text">Track internal notes, blockers, and next steps for this client.</p>
              </button>
              <button class="worker-detail-block workspace-launch-card" type="button" data-panel="activity">
                <strong>Case Activity</strong>
                <p class="small-text">See recent movement across messages, transport, and status changes.</p>
              </button>
            </div>
          </div>
        </div>

        <aside class="caseworker-file-side">
          <div class="caseworker-panel">
            <strong>Client Summary</strong>
            <p class="small-text">Current status: ${selectedClient.worker_status === "pending_approval" ? "Pending approval" : (selectedClient.worker_status === "completed" ? "Completed" : "Active")}</p>
            <p class="small-text">Transportation needed: ${selectedClient.transportation_needed ? "Yes" : "No"}</p>
            <p class="small-text">Missing documents: ${selectedClient.missing_documents.length ? escapeHtml(selectedClient.missing_documents.map(formatDocumentLabel).join(", ")) : "None listed"}</p>
            <button class="secondary-btn worker-complete-btn" type="button" id="caseworker-complete-case-btn" ${selectedClient.worker_status === "completed" ? "disabled" : ""}>Mark Case Completed</button>
          </div>

          <div class="caseworker-panel">
            <strong>Live Chat Status</strong>
            <p class="small-text">${selectedClient.worker_status === "completed" ? "The case is completed. Chat history is removed at completion." : `${getCaseMessages(selectedClient.id, state.caseWorkerData.currentWorkerId).length} saved messages currently linked to this client.`}</p>
            <p class="small-text">Open the chat card to continue the conversation or download the saved transcript.</p>
          </div>
        </aside>
      </div>
      ${state.caseWorkerData.activeWorkspacePanel ? `
        <div class="workspace-overlay">
          <div class="workspace-modal ${state.caseWorkerData.activeWorkspacePanel === "chat" ? "chat" : ""}">
            ${buildWorkspacePanelContent(selectedClient)}
          </div>
        </div>
      ` : ""}
    </div>
  `;

  document.getElementById("caseworker-file-back-btn").addEventListener("click", () => {
    closeCaseFileView();
  });

  container.querySelectorAll(".workspace-launch-card").forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.dataset.panel === "documents") {
        await openCaseworkerDocumentsPage(selectedClient.id, state.clientPortalData.selectedDocumentType);
        return;
      }

      openWorkspacePanel(button.dataset.panel);
    });
  });

  const completeButton = document.getElementById("caseworker-complete-case-btn");
  if (completeButton) {
    completeButton.addEventListener("click", async () => {
      await updateCaseApproval(selectedClient.id, "complete");
      state.caseWorkerData.activeWorkspacePanel = null;
      state.caseWorkerData.messagesByClient[selectedClient.id] = [];
      renderCaseFileView();
    });
  }

  const closeButton = document.getElementById("workspace-close-btn");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeWorkspacePanel();
    });
  }

  container.querySelectorAll("[data-upload-doc]").forEach((button) => {
    button.addEventListener("click", () => {
      saveDocumentUpload(selectedClient.id, button.dataset.uploadDoc);
      renderCaseFileView();
    });
  });

  const notesSave = document.getElementById("workspace-notes-save-btn");
  if (notesSave) {
    notesSave.addEventListener("click", () => {
      const textarea = document.getElementById("workspace-notes-input");
      state.caseWorkerData.notes[selectedClient.id] = textarea ? textarea.value : "";
      renderCaseFileView();
    });
  }

  const chatRefresh = document.getElementById("workspace-chat-refresh-btn");
  if (chatRefresh) {
    chatRefresh.addEventListener("click", async () => {
      await loadMessages(selectedClient.id);
      renderCaseFileView();
    });
  }

  const chatSave = document.getElementById("workspace-chat-save-btn");
  if (chatSave) {
    chatSave.addEventListener("click", () => {
      const transcript = getChatTranscript(selectedClient, getCaseMessages(selectedClient.id, state.caseWorkerData.currentWorkerId));
      downloadTextFile(`${selectedClient.id}-chat.txt`, transcript || "No messages yet.");
    });
  }

  const chatImages = document.getElementById("workspace-chat-images-btn");
  if (chatImages) {
    chatImages.addEventListener("click", () => {
      state.caseWorkerData.showChatImagesOnly = !state.caseWorkerData.showChatImagesOnly;
      renderCaseFileView();
    });
  }

  const workerImageRemove = document.getElementById("worker-chat-image-remove-btn");
  if (workerImageRemove) {
    workerImageRemove.addEventListener("click", () => {
      clearPendingChatImage("worker");
      renderCaseFileView();
    });
  }

  const workerImageInput = document.getElementById("worker-chat-image-input");
  if (workerImageInput) {
    workerImageInput.addEventListener("change", async (event) => {
      const [file] = Array.from(event.target.files || []);
      await setPendingChatImage(file, "worker");
      renderCaseFileView();
    });
  }

  const workerSend = document.querySelector("#caseworker-full-view .worker-chat-send-btn");
  if (workerSend) {
    workerSend.addEventListener("click", async () => {
      await sendWorkerMessage(selectedClient.id);
      renderCaseFileView();
    });
  }

  const workerInput = document.getElementById("worker-chat-input");
  if (workerInput) {
    workerInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        await sendWorkerMessage(selectedClient.id);
        renderCaseFileView();
      }
    });
  }
}

function renderCaseWorkerDashboard() {
  const currentCases = getCurrentCases();
  const currentWorker = getCurrentWorker();

  document.getElementById("worker-case-count").textContent = formatCountLabel(currentCases.length, "case", "cases", "caso", "casos");

  if (!state.caseWorkerData.selectedClientId) {
    const firstClient = currentCases[0];
    state.caseWorkerData.selectedClientId = firstClient ? firstClient.id : null;
  }

  if (currentWorker) {
    document.getElementById("admin-role-title").textContent = currentWorker.name;
    document.getElementById("admin-role-subtitle").textContent = `${currentWorker.active_cases} active cases`;
  }

  renderWorkerClientList(currentCases);
  renderWorkerNotifications();
}

async function loadCaseWorkerDashboard() {
  try {
    const [clientsData, workersData, notificationsData] = await Promise.all([
      fetchJson("/api/clients"),
      fetchJson("/api/workers"),
      fetchJson(`/api/worker-notifications?worker_id=${encodeURIComponent(state.caseWorkerData.currentWorkerId)}`)
    ]);

    state.caseWorkerData.clients = clientsData.clients;
    state.caseWorkerData.workers = workersData.workers;
    state.caseWorkerData.notifications = notificationsData.notifications;

    const selectedStillExists = state.caseWorkerData.clients.some((client) => client.id === state.caseWorkerData.selectedClientId);
    if (!selectedStillExists) {
      state.caseWorkerData.selectedClientId = null;
    }

    const currentCases = getCurrentCases();
    if (!state.caseWorkerData.selectedClientId && currentCases.length) {
      state.caseWorkerData.selectedClientId = currentCases[0].id;
    }

    if (state.caseWorkerData.selectedClientId) {
      await loadMessages(state.caseWorkerData.selectedClientId);
    }

    applyLanguage();
    renderCaseWorkerDashboard();
  } catch (error) {
    document.getElementById("worker-case-list").innerHTML = `<div class="county-empty-state">${showServerOfflineMessage()}</div>`;
    document.getElementById("worker-notification-list").innerHTML = `<div class="county-empty-state">${showServerOfflineMessage()}</div>`;
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

    if (action === "complete") {
      state.caseWorkerData.messagesByClient[clientId] = [];
      state.caseWorkerData.chatNotices[clientId] = "";
      clearPendingChatImage("worker");
    }

    await loadCaseWorkerDashboard();
  } catch (error) {
    document.getElementById("worker-notification-list").innerHTML = `<div class="county-empty-state">${showServerOfflineMessage()}</div>`;
  }
}

async function sendWorkerMessage(clientId) {
  const selectedClient = state.caseWorkerData.clients.find((client) => client.id === clientId);
  const input = document.getElementById("worker-chat-input");
  const image = state.caseWorkerData.pendingChatImage;
  if (!selectedClient || !input) return;

  if (selectedClient.worker_status === "completed") {
    input.disabled = true;
    const sendButton = document.querySelector("#caseworker-full-view .worker-chat-send-btn");
    if (sendButton) sendButton.disabled = true;
    renderCaseFileView();
    return;
  }

  const text = input.value.trim();
  if (!text && !image) return;

  try {
    state.caseWorkerData.chatNotices[clientId] = "";
    await postChatMessage({
      clientId,
      workerId: state.caseWorkerData.currentWorkerId,
      sender: "worker",
      text,
      image
    });

    input.value = "";
    clearPendingChatImage("worker");
    await loadMessages(clientId);
  } catch (error) {
    if (error.message === "SERVER_OFFLINE") {
      document.getElementById("worker-notification-list").innerHTML = `<div class="county-empty-state">${showServerOfflineMessage()}</div>`;
    } else {
      state.caseWorkerData.chatNotices[clientId] = error.message;
    }
  }
}

async function sendMessage() {
  const selectedClient = state.caseWorkerData.clients.find((client) => client.id === state.caseWorkerData.selectedClientId);
  if (!selectedClient) return;
  await sendWorkerMessage(selectedClient.id);
}

function showQuestionScreen(options = {}) {
  const { prefillFromSaved = false } = options;
  document.getElementById("plan-error-box").textContent = "";
  if (prefillFromSaved) {
    loadIntakeFromCurrentUser();
  }
  openScreen("questions-screen");
}

function showResultScreen() {
  openScreen("result-screen");
}

function startOver() {
  state.answers.hasBirth = null;
  state.answers.hasSSN = null;
  state.answers.hasID = null;
  state.sameAsBirthLocation = false;

  document.querySelectorAll(".choice-btn").forEach((button) => {
    if (button.closest("[data-group]")) {
      button.classList.remove("active");
    }
  });

  document.getElementById("plan-steps").innerHTML = "";
  document.getElementById("transport-btn").classList.add("hidden");
  document.getElementById("plan-error-box").textContent = "";
  document.getElementById("birth-state").value = "";
  document.getElementById("birth-county").value = "";
  document.getElementById("birth-city").value = "";
  document.getElementById("current-state").value = "";
  document.getElementById("current-county").value = "";
  document.getElementById("current-city").value = "";
  document.getElementById("current-same-as-birth-input").checked = false;
  setupLocationDropdowns();
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

  const birthLocation = getSelectedLocation("birth");
  const currentLocation = getSelectedLocation("current");

  if (!isLocationComplete(birthLocation) || !isLocationComplete(currentLocation)) {
    errorBox.textContent = uiText[state.lang].locationError;
    return;
  }

  const birthPlace = formatLocation(birthLocation);
  const currentPlace = formatLocation(currentLocation);

  const plan = generatePlan(state.answers, birthPlace, currentPlace);
  state.lastPlan = plan;
  const translatedSteps = [];

  for (const step of plan.steps) {
    translatedSteps.push({
      text: await translateText(step.text, state.lang),
      description: step.description ? await translateText(step.description, state.lang) : "",
      actionLabel: step.actionLabel ? await translateText(step.actionLabel, state.lang) : "",
      actionLink: step.actionLink || "",
      actionExternal: Boolean(step.actionExternal)
    });
  }

  const list = document.getElementById("plan-steps");
  list.innerHTML = "";

  translatedSteps.forEach((step) => {
    const li = document.createElement("li");
    li.className = "plan-step-item";

    const title = document.createElement("p");
    title.className = "plan-step-text";
    title.textContent = step.text;
    li.appendChild(title);

    if (step.description) {
      const description = document.createElement("p");
      description.className = "small-text plan-step-description";
      description.textContent = step.description;
      li.appendChild(description);
    }

    if (step.actionLink && step.actionLabel) {
      const actionLink = document.createElement("a");
      actionLink.className = "secondary-btn plan-step-link";
      actionLink.href = step.actionLink;
      if (step.actionExternal) {
        actionLink.target = "_blank";
        actionLink.rel = "noopener noreferrer";
      }
      actionLink.textContent = step.actionLabel;
      li.appendChild(actionLink);
    }

    list.appendChild(li);
  });

  const transportButton = document.getElementById("transport-btn");
  transportButton.classList.toggle("hidden", !plan.transportation_needed);
  transportButton.onclick = () => {
    window.location.href = "https://www.njtransit.com";
  };

  try {
    const data = await fetchJson("/api/auth/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentAnswers: {
          hasBirth: state.answers.hasBirth,
          hasSSN: state.answers.hasSSN,
          hasID: state.answers.hasID
        },
        intakeLocations: {
          birth: birthLocation,
          current: currentLocation
        },
        roadmapPlan: plan
      })
    });

    state.clientPortalData.currentUser = data.user;
  } catch (error) {
    errorBox.textContent =
      error.message === "SERVER_OFFLINE" ? showServerOfflineMessage() : error.message;
    return;
  }

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

async function loginAdminWithRole(role, options = {}) {
  const { demo = false, email = "", password = "", workerId = "", preferredWorkerId = "" } = options;
  const endpoint = demo ? "/api/admin/demo-login" : "/api/admin/login";
  const payload = demo ? { role, workerId } : { role, email, password };

  const data = await fetchJson(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  state.adminRole = role;

  if (role === "caseworker") {
    state.caseWorkerData.currentWorkerId = preferredWorkerId || data.workerId || state.caseWorkerData.currentWorkerId;
  }

  if (role === "caseworker") {
    await loadCaseWorkerDashboard();
  }

  if (role === "passaic") {
    await loadCountyDashboard();
  }

  document.getElementById("login-error").textContent = "";
  openScreen("admin-dashboard-screen");
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

  document.getElementById("client-notification-bell-btn").addEventListener("click", () => {
    void toggleClientNotificationPanel();
  });

  document.getElementById("create-account-toggle-btn").addEventListener("click", () => {
    openScreen("create-account-screen");
    document.getElementById("create-account-name-input").focus();
  });

  document.getElementById("create-account-back-btn").addEventListener("click", () => {
    openScreen("login-screen");
  });

  document.getElementById("create-account-phone-mode-btn").addEventListener("click", () => {
    setCreateAccountMode("phone");
  });

  document.getElementById("create-account-email-mode-btn").addEventListener("click", () => {
    setCreateAccountMode("email");
  });

  document.getElementById("create-account-submit-btn").addEventListener("click", async () => {
    await createClientAccount();
  });

  [
    "create-account-name-input",
    "create-account-phone-input",
    "create-account-email-input",
    "create-account-password-input"
  ].forEach((id) => {
    document.getElementById(id).addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        await createClientAccount();
      }
    });
  });

  const adminPortalBtn = document.getElementById("admin-portal-btn");
  if (adminPortalBtn) {
    adminPortalBtn.addEventListener("click", () => {
      setAuthView("admin");
      setAdminRole("caseworker");
      if (!state.adminDemoWorkers.length) {
        void loadAdminDemoCaseworkers();
      }
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

  document.getElementById("admin-demo-caseworker-select").addEventListener("change", () => {
    state.adminSelectedDemoWorkerId = document.getElementById("admin-demo-caseworker-select").value;
    if (state.adminRole !== "caseworker") {
      setAdminRole("caseworker");
    }
    syncAdminDemoWorkerSelection();
  });

  document.getElementById("send-code-btn").addEventListener("click", () => {
    void (async () => {
      const t = uiText[state.lang];
      const phone = document.getElementById("phone-input").value.trim();

      if (!phone) {
        document.getElementById("login-error").textContent = t.phoneError;
        return;
      }

      try {
        await fetchJson("/api/auth/login/phone/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone })
        });

        state.otpSent = true;
        state.pendingPhoneNumber = phone;
        document.getElementById("code-entry-block").classList.remove("hidden");
        document.getElementById("login-error").textContent = t.codeSent;
        document.getElementById("code-input").focus();
      } catch (error) {
        document.getElementById("login-error").textContent =
          error.message === "SERVER_OFFLINE" ? showServerOfflineMessage() : error.message;
      }
    })();
  });

  document.getElementById("phone-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("send-code-btn").click();
    }
  });

  document.getElementById("verify-code-btn").addEventListener("click", () => {
    void (async () => {
      const t = uiText[state.lang];
      const code = document.getElementById("code-input").value.trim();

      if (!state.otpSent || !/^\d{4}$/.test(code)) {
        document.getElementById("login-error").textContent = t.codeError;
        return;
      }

      try {
        const data = await fetchJson("/api/auth/login/phone/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: state.pendingPhoneNumber, otp: code })
        });
        resetCodeEntry();
        document.getElementById("login-error").textContent = "";
        handleLoggedInUser(data.user);
      } catch (error) {
        document.getElementById("login-error").textContent =
          error.message === "SERVER_OFFLINE" ? showServerOfflineMessage() : error.message;
      }
    })();
  });

  document.getElementById("code-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("verify-code-btn").click();
    }
  });

  document.getElementById("worker-login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    void (async () => {
      const email = document.getElementById("worker-username-input").value.trim();
      const password = document.getElementById("worker-password-input").value.trim();

      try {
        const data = await fetchJson("/api/auth/login/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        document.getElementById("login-error").textContent = "";
        handleLoggedInUser(data.user);
      } catch (error) {
        document.getElementById("login-error").textContent =
          error.message === "SERVER_OFFLINE" ? showServerOfflineMessage() : error.message;
      }
    })();
  });

  document.getElementById("admin-login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const t = uiText[state.lang];
    const email = document.getElementById("admin-email-input").value.trim();
    const password = document.getElementById("admin-password-input").value.trim();
    const selectedWorkerId = document.getElementById("admin-demo-caseworker-select").value || state.adminSelectedDemoWorkerId || "";
    
    try {
      if (state.adminRole === "caseworker" && password === "Demo login") {
        const matchingDemoWorker = state.adminDemoWorkers.find((worker) => (
          worker.workerId === selectedWorkerId
        )) || DEFAULT_DEMO_CASEWORKERS.find((worker) => (
          worker.workerId === selectedWorkerId
        )) || state.adminDemoWorkers.find((worker) => (
          String(worker.email || "").trim().toLowerCase() === email.toLowerCase()
        )) || DEFAULT_DEMO_CASEWORKERS.find((worker) => (
          String(worker.email || "").trim().toLowerCase() === email.toLowerCase()
        )) || null;

        if (!matchingDemoWorker?.workerId) {
          throw new Error(state.lang === "es" ? "Seleccione un trabajador social demo valido." : "Select a valid demo case worker.");
        }

        state.adminSelectedDemoWorkerId = matchingDemoWorker.workerId;
        document.getElementById("admin-demo-caseworker-select").value = matchingDemoWorker.workerId;
        document.getElementById("admin-email-input").value = matchingDemoWorker.email || email;
        await loginAdminWithRole("caseworker", {
          demo: true,
          workerId: matchingDemoWorker.workerId,
          preferredWorkerId: matchingDemoWorker.workerId
        });
      } else if (state.adminRole === "passaic" && password === "Demo login" && email.toLowerCase() === "county@idhelp.org") {
        await loginAdminWithRole("passaic", { demo: true });
      } else {
        await loginAdminWithRole(state.adminRole, { email, password });
      }
    } catch (error) {
      document.getElementById("login-error").textContent =
        error.message === "SERVER_OFFLINE"
          ? showServerOfflineMessage()
          : (error.message || t.adminError);
    }
  });

  document.getElementById("admin-demo-caseworker-btn").addEventListener("click", async () => {
    setAdminRole("caseworker");
    state.adminSelectedDemoWorkerId = document.getElementById("admin-demo-caseworker-select").value || state.adminSelectedDemoWorkerId;
    const selectedWorker = syncAdminDemoWorkerSelection() || state.adminDemoWorkers[0] || null;

    if (!selectedWorker) {
      document.getElementById("login-error").textContent = state.lang === "es"
        ? "No hay trabajadores demo disponibles."
        : "No demo case workers are available.";
      return;
    }

    document.getElementById("admin-demo-caseworker-select").value = selectedWorker.workerId || "";
    state.adminSelectedDemoWorkerId = selectedWorker.workerId || "";
    document.getElementById("admin-email-input").value = selectedWorker.email || "";
    document.getElementById("admin-password-input").value = "Demo login";
    document.getElementById("admin-login-form").requestSubmit();
  });

  document.getElementById("admin-demo-county-btn").addEventListener("click", async () => {
    setAdminRole("passaic");
    document.getElementById("admin-email-input").value = "county@idhelp.org";
    document.getElementById("admin-password-input").value = "Demo login";
    document.getElementById("admin-login-form").requestSubmit();
  });

  document.querySelectorAll(".doc-card").forEach((card) => {
    card.addEventListener("click", async () => {
      if (card.dataset.doc === "id") {
        await showClientDocuments("state_id");
        return;
      }

      if (card.dataset.doc === "chat") {
        await showClientChatPanel();
        return;
      }

      if (card.dataset.doc === "notifications") {
        await openClientNotificationPanel();
        return;
      }

      if (card.dataset.doc === "progress") {
        await openClientProgressDashboard();
        return;
      }

      if (card.dataset.doc === "empty") {
        return;
      }
    });
  });

  document.getElementById("dashboard-continue-btn").addEventListener("click", () => {
    showQuestionScreen({ prefillFromSaved: true });
  });

  document.getElementById("dashboard-back-btn").addEventListener("click", () => {
    void logoutClientUser();
  });

  document.getElementById("client-progress-back-btn").addEventListener("click", () => {
    openScreen("dashboard-screen");
  });

  document.getElementById("client-chat-back-btn").addEventListener("click", () => {
    hideClientChatPanel();
    openScreen("dashboard-screen");
  });

  document.getElementById("client-notifications-back-btn").addEventListener("click", () => {
    closeClientNotificationPanel();
    openScreen("dashboard-screen");
  });

  document.getElementById("admin-dashboard-back-btn").addEventListener("click", () => {
    openScreen("login-screen");
  });

  document.getElementById("questions-back-btn").addEventListener("click", () => {
    if (state.clientPortalData.currentUser?.hasCompletedIntake) {
      openScreen("dashboard-screen");
      return;
    }

    openScreen("questions-screen");
  });

  document.getElementById("questions-logout-btn").addEventListener("click", () => {
    void logoutClientUser();
  });

  document.getElementById("result-back-btn").addEventListener("click", () => {
    openScreen("questions-screen");
  });

  document.getElementById("plan-dashboard-btn").addEventListener("click", () => {
    openScreen("dashboard-screen");
  });

  document.getElementById("current-same-as-birth-input").addEventListener("change", (event) => {
    updateSameAsBirthState(Boolean(event.target.checked));
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

  document.getElementById("county-ai-float-btn").addEventListener("click", openCountyAiPanel);
  document.getElementById("county-ai-close-btn").addEventListener("click", closeCountyAiPanel);
  document.getElementById("ai-ask-btn").addEventListener("click", askAI);
  document.getElementById("ai-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      askAI();
    }
  });

  document.getElementById("client-chat-send-btn").addEventListener("click", sendClientMessage);
  document.getElementById("client-chat-image-input").addEventListener("change", async (event) => {
    const [file] = Array.from(event.target.files || []);
    await setPendingChatImage(file, "client");
    renderClientPortalChat();
  });
  document.getElementById("client-chat-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendClientMessage();
    }
  });

  document.getElementById("county-refresh-btn").addEventListener("click", () => {
    loadCountyDashboard();
  });
  document.getElementById("county-clear-notifications-btn").addEventListener("click", clearCountyNotifications);

  document.getElementById("county-worker-modal-close-btn").addEventListener("click", closeWorkerProfile);
  document.getElementById("county-worker-modal").addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.workerModalClose === "true") {
      closeWorkerProfile();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.countyData.selectedWorkerId) {
      closeWorkerProfile();
    }
  });

}

bindLocationGroup("birth");
bindLocationGroup("current");
setupLocationDropdowns();
attachChoiceHandlers();
bindEvents();

async function initializeApp() {
  resetCodeEntry();
  setCreateAccountMode("phone");
  setAuthView("user");
  setAdminRole("caseworker");
  setLoginView("phone");
  await loadAdminDemoCaseworkers();
  applyLanguage();
  const restored = await restoreClientSession();
  if (!restored) {
    routeClientEntry();
  }
}

initializeApp();
