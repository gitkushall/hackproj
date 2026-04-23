const PRIMARY_RESOURCES = {
  helpline211: {
    label: "Call or text 211",
    detail: "Free 24/7 help for shelters, document support, food, and local resources.",
    phone: "211",
    url: "https://www.nj211.org/"
  },
  njVitalRecords: {
    label: "NJ Vital Records",
    detail: "Official New Jersey birth certificate information and support.",
    phone: "1-866-649-8726",
    url: "https://www.nj.gov/health/vital/"
  },
  vitalChek: {
    label: "VitalChek",
    detail: "Online ordering support for vital records in many states.",
    phone: "1-888-434-2587",
    url: "https://www.vitalchek.com/v/"
  },
  ssaMain: {
    label: "Social Security Administration",
    detail: "Main SSA help line and card replacement guidance.",
    phone: "1-800-772-1213",
    url: "https://www.ssa.gov/number-card"
  },
  ssaLocator: {
    label: "SSA Office Locator",
    detail: "Find a local Social Security office.",
    phone: "",
    url: "https://www.ssa.gov/locator/"
  },
  njMvc: {
    label: "NJ MVC",
    detail: "New Jersey non-driver ID requirements and appointment system.",
    phone: "(609) 292-6500",
    url: "https://www.nj.gov/mvc/license/nondriverid.htm"
  },
  njMvcLocations: {
    label: "NJ MVC Licensing Centers",
    detail: "Official list of New Jersey Licensing Centers where non-driver IDs are issued.",
    phone: "(609) 292-6500",
    url: "https://www.nj.gov/mvc/locations/liccenters.htm"
  },
  njMvc6Points: {
    label: "NJ MVC 6 Points of ID",
    detail: "Official New Jersey document checklist for license and non-driver ID transactions.",
    phone: "(609) 292-6500",
    url: "https://www.nj.gov/mvc/license/6pointid.htm"
  },
  njMvcAppointment: {
    label: "NJ MVC Appointment Wizard",
    detail: "Schedule a New Jersey MVC appointment.",
    phone: "(609) 292-6500",
    url: "https://telegov.njportal.com/njmvc/AppointmentWizard"
  }
};

const PASSAIC_LOCAL_BIRTH_OFFICES = {
  paterson: {
    label: "Paterson Health Division Vital Records",
    address: "176 Broadway, Paterson, NJ 07505",
    phone: "973-321-1277",
    note: "Use this office if the birth was registered in Paterson."
  },
  passaic: {
    label: "Passaic Vital Statistics Office",
    address: "330 Passaic Street, Passaic, NJ 07055",
    phone: "973-365-5584",
    note: "Use this office if the birth was registered in Passaic."
  },
  clifton: {
    label: "Clifton City Registrar",
    address: "900 Clifton Avenue, Suite 1, Clifton, NJ 07013",
    phone: "973-470-5824",
    note: "Use this office if the birth was registered in Clifton."
  },
  wayne: {
    label: "Wayne Health Department",
    address: "475 Valley Road, Wayne, NJ 07470",
    phone: "973-694-1800 x3243",
    note: "Use this office if the birth was registered in Wayne."
  },
  totowa: {
    label: "Totowa Borough Registrar",
    address: "537 Totowa Road, Totowa, NJ 07512",
    phone: "(973) 956-1000 x1008",
    note: "Use this office if the birth was registered in Totowa."
  }
};

const SSA_OFFICES = {
  passaic_default: {
    label: "Paterson SSA Office",
    address: "200 Federal Plaza, First Floor, Paterson, NJ 07505",
    phone: "1-888-397-9806",
    note: "Regional office with strong transit access and in-person support."
  },
  clifton: {
    label: "Clifton SSA Office",
    address: "935 Allwood Road, Clifton, NJ 07012",
    phone: "1-888-397-9806",
    note: "Good option for western and southern Passaic County."
  },
  paterson: {
    label: "Paterson SSA Office",
    address: "200 Federal Plaza, First Floor, Paterson, NJ 07505",
    phone: "1-888-397-9806",
    note: "About a 10-minute walk from Paterson train station."
  }
};

const MVC_OFFICES = {
  paterson: {
    label: "Paterson MVC Licensing Center",
    address: "125 Broadway, Suite 201, Paterson, NJ 07505",
    phone: "(609) 292-6500",
    note: "Closest option for Paterson and nearby Passaic locations."
  },
  wayne: {
    label: "Wayne MVC Licensing Center",
    address: "481 Route 46 West, Wayne, NJ 07470",
    phone: "(609) 292-6500",
    note: "Strong option for Wayne, Clifton, and Totowa."
  },
  oakland: {
    label: "Oakland MVC Licensing Center",
    address: "350 Ramapo Valley Road, Suite 24, Oakland, NJ 07436",
    phone: "(609) 292-6500",
    note: "Alternate option for northern Passaic County."
  }
};

const NJ_STATE_ID_LOCATION_COUNT = 29;

const DOCUMENT_GUIDANCE = {
  birth_certificate: {
    title: "Birth Certificate",
    summary: "Start here first. The birth certificate usually unlocks the rest of the document path.",
    applicationSteps: [
      "Gather your full legal name at birth, date of birth, city or town of birth, and your parents' names.",
      "If you were born in New Jersey, start with the Trenton state walk-in office or use VitalChek online.",
      "If you do not have ID, ask a shelter or social worker for a letter on agency letterhead and help with a mailing address.",
      "Bring or prepare any alternate records you have, then submit the request in person or online."
    ],
    appointment: {
      required: false,
      note: "The Trenton state office can often handle walk-ins for New Jersey births without an appointment."
    },
    timeline: "Same-day at some in-person offices, or about 2 to 3 weeks by mail.",
    requiredItems: [
      "Full legal name at birth",
      "Date of birth",
      "City or town of birth",
      "Mother's full maiden name",
      "Father's full name if listed",
      "A mailing address you can safely use"
    ],
    alternateProof: [
      "Expired ID or driver's license",
      "Medical or hospital records",
      "School records or transcripts",
      "Military records",
      "Old utility bills, bank statements, or pay stubs",
      "A shelter or social worker letter on official letterhead"
    ],
    supportNote: "If you do not have ID, a shelter or social worker can often help verify identity, provide an address, and request a fee waiver in New Jersey.",
    feeWaiver: "For homeless individuals in New Jersey, a shelter or social worker may submit the request with official agency letterhead so the $25 fee can be waived.",
    links: [
      PRIMARY_RESOURCES.njVitalRecords,
      PRIMARY_RESOURCES.vitalChek,
      PRIMARY_RESOURCES.helpline211
    ]
  },
  ssn: {
    title: "Social Security Card",
    summary: "After your birth certificate, use SSA to request or replace your Social Security card.",
    applicationSteps: [
      "Start with your birth certificate first so you have a stronger identity document for SSA.",
      "Fill out SSA Form SS-5 or start the replacement process online if SSA allows it for your case.",
      "Call SSA before visiting if you are missing a current photo ID or need to confirm what proof they will accept.",
      "Go to the nearest SSA office with your birth certificate and any identity documents SSA requested."
    ],
    appointment: {
      required: false,
      note: "You can often begin online first, then visit the office if SSA asks for in-person verification."
    },
    timeline: "Replacement cards are free, but processing time depends on office volume and mailed verification.",
    requiredItems: [
      "Birth certificate",
      "State ID if available",
      "Completed SSA Form SS-5",
      "Any supporting identity documents SSA requests"
    ],
    alternateProof: [
      "Use your birth certificate first if no current ID is available",
      "Call SSA before visiting if you are missing a current photo ID"
    ],
    supportNote: "If travel or identity verification is a barrier, connect with 211 or your case worker before visiting SSA.",
    feeWaiver: "SSA replacement cards are free.",
    links: [
      PRIMARY_RESOURCES.ssaMain,
      PRIMARY_RESOURCES.ssaLocator,
      PRIMARY_RESOURCES.helpline211
    ]
  },
  state_id: {
    title: "State ID",
    summary: "Use MVC after your birth certificate and Social Security step so you can unlock housing applications and identity checks.",
    applicationSteps: [
      "Finish your birth certificate and Social Security steps before going to MVC whenever possible.",
      "Book an MVC appointment through the official appointment system or by phone.",
      "Bring your identity documents, and if you are using the homeless waiver path, bring Form BA-208 and a shelter or social worker letter.",
      "Go to the MVC licensing center for document review and ask about the homeless fee waiver if it applies to you."
    ],
    appointment: {
      required: true,
      note: "New Jersey MVC non-driver IDs usually require an appointment."
    },
    timeline: "Timing depends on appointment availability and document review at MVC.",
    requiredItems: [
      "Birth certificate",
      "Social Security card or SSA proof",
      "Form BA-208 if using the homeless waiver path",
      "A shelter or social worker letter if standard proof is not available"
    ],
    alternateProof: [
      "Shelter address can often be used as your residence address",
      "A social worker letter can help support the homeless waiver path"
    ],
    supportNote: "For homeless applicants in New Jersey, MVC may waive the fee and allow a shelter or support address.",
    feeWaiver: "The New Jersey non-driver ID fee may be waived for homeless individuals using the proper support documentation.",
    links: [
      PRIMARY_RESOURCES.njMvc,
      PRIMARY_RESOURCES.njMvcLocations,
      PRIMARY_RESOURCES.njMvc6Points
    ]
  }
};

module.exports = {
  DOCUMENT_GUIDANCE,
  NJ_STATE_ID_LOCATION_COUNT,
  MVC_OFFICES,
  PASSAIC_LOCAL_BIRTH_OFFICES,
  PRIMARY_RESOURCES,
  SSA_OFFICES
};
