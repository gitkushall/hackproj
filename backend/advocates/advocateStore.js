const advocates = [
  {
    id: "ADV-01",
    name: "Elena Torres",
    organization: "Paterson Family Support Center",
    role: "Community Advocate",
    city: "Paterson",
    county: "Passaic",
    specialties: ["Birth Certificate", "State ID", "Housing"],
    phone: "(973) 555-2101",
    email: "elena.torres@pfsc.org",
    languages: ["English", "Spanish"],
    availability: "Weekdays 9 AM - 5 PM"
  },
  {
    id: "ADV-02",
    name: "Marcus Reid",
    organization: "Passaic Outreach Network",
    role: "Housing Navigator",
    city: "Passaic",
    county: "Passaic",
    specialties: ["Housing", "Shelter support", "Transportation"],
    phone: "(973) 555-2102",
    email: "marcus.reid@pon.org",
    languages: ["English"],
    availability: "Weekdays 8 AM - 4 PM"
  },
  {
    id: "ADV-03",
    name: "Sonia Patel",
    organization: "Clifton Resource Desk",
    role: "Document Specialist",
    city: "Clifton",
    county: "Passaic",
    specialties: ["State ID", "SSN", "Birth Certificate"],
    phone: "(973) 555-2103",
    email: "sonia.patel@cliftondesk.org",
    languages: ["English", "Hindi", "Gujarati"],
    availability: "Mon, Wed, Fri 10 AM - 6 PM"
  },
  {
    id: "ADV-04",
    name: "Jamal Freeman",
    organization: "Newark Access Coalition",
    role: "Benefits Advocate",
    city: "Newark",
    county: "Essex",
    specialties: ["SSN", "State ID", "Transportation"],
    phone: "(973) 555-2104",
    email: "jamal.freeman@nac.org",
    languages: ["English"],
    availability: "Weekdays 11 AM - 7 PM"
  },
  {
    id: "ADV-05",
    name: "Rosa Mendoza",
    organization: "Essex County Community Link",
    role: "Shelter Advocate",
    city: "Newark",
    county: "Essex",
    specialties: ["Shelter support", "Housing", "Transportation"],
    phone: "(973) 555-2105",
    email: "rosa.mendoza@eccl.org",
    languages: ["English", "Spanish"],
    availability: "Daily 9 AM - 3 PM"
  },
  {
    id: "ADV-06",
    name: "Tariq Wilson",
    organization: "Hudson Help Collective",
    role: "Client Support Advocate",
    city: "Jersey City",
    county: "Hudson",
    specialties: ["Housing", "Transportation", "State ID"],
    phone: "(201) 555-2106",
    email: "tariq.wilson@hudsonhelp.org",
    languages: ["English"],
    availability: "Weekdays 9 AM - 6 PM"
  },
  {
    id: "ADV-07",
    name: "Ana Gomez",
    organization: "North Jersey Family Bridge",
    role: "Case Advocate",
    city: "Union City",
    county: "Hudson",
    specialties: ["Birth Certificate", "SSN", "Shelter support"],
    phone: "(201) 555-2107",
    email: "ana.gomez@njbridge.org",
    languages: ["English", "Spanish"],
    availability: "Tue - Sat 10 AM - 5 PM"
  },
  {
    id: "ADV-08",
    name: "David Cho",
    organization: "Garden State Access Partners",
    role: "Resource Coordinator",
    city: "Newark",
    county: "Essex",
    specialties: ["Housing", "Birth Certificate", "SSN"],
    phone: "(973) 555-2108",
    email: "david.cho@gsap.org",
    languages: ["English", "Korean"],
    availability: "Weekdays 8:30 AM - 4:30 PM"
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function compareAdvocates(a, b) {
  if (b.matchScore !== a.matchScore) {
    return b.matchScore - a.matchScore;
  }

  return a.name.localeCompare(b.name);
}

function scoreAdvocate(advocate, { city, county, need }) {
  const normalizedCity = normalize(city);
  const normalizedCounty = normalize(county);
  const normalizedNeed = normalize(need);

  let matchScore = 0;

  if (normalizedCounty && normalize(advocate.county) === normalizedCounty) {
    matchScore += 100;
  }

  if (normalizedCity && normalize(advocate.city) === normalizedCity) {
    matchScore += 60;
  }

  if (normalizedNeed) {
    const hasSpecialtyMatch = advocate.specialties.some((specialty) => normalize(specialty) === normalizedNeed);
    if (hasSpecialtyMatch) {
      matchScore += 25;
    }
  }

  if (!normalizedCounty && !normalizedCity && !normalizedNeed) {
    matchScore = 1;
  }

  return {
    ...clone(advocate),
    matchScore,
    bestMatch: false
  };
}

function getAdvocates() {
  return clone(advocates);
}

function getAvailableCounties() {
  return [...new Set(advocates.map((advocate) => advocate.county))].sort();
}

function getAvailableNeeds() {
  const needs = advocates.flatMap((advocate) => advocate.specialties);
  return [...new Set(needs)].sort();
}

function searchAdvocates(criteria = {}) {
  const results = advocates
    .map((advocate) => scoreAdvocate(advocate, criteria))
    .sort(compareAdvocates);

  if (results[0]) {
    results[0].bestMatch = true;
  }

  return results;
}

module.exports = {
  getAdvocates,
  getAvailableCounties,
  getAvailableNeeds,
  searchAdvocates
};
