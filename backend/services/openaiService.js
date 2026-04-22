const OpenAI = require("openai");

let client = null;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!client) {
    client = new OpenAI({ apiKey });
  }

  return client;
}

async function generateAdminInsight({ question, systemData, dashboard }) {
  const openai = getClient();

  if (!openai) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const prompt = [
    "You are an operations assistant for a county housing coordination dashboard.",
    "Answer using only the provided dashboard data.",
    "Be concise, practical, and factual.",
    "If the question asks for unavailable information, say that clearly instead of guessing.",
    `System data: ${JSON.stringify(systemData)}`,
    `Dashboard summary: ${JSON.stringify(dashboard)}`,
    `Question: ${question}`
  ].join("\n");

  const response = await openai.responses.create({
    model,
    input: prompt
  });

  return String(response.output_text || "").trim();
}

async function generatePortalHelpReply({ question, language = "en" }) {
  const openai = getClient();

  if (!openai) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const prompt = [
    "You are Portal Help for a housing support portal.",
    "You answer quick questions about login, portal navigation, notifications, transportation requests, and document steps.",
    "Do not pretend to be a human case worker.",
    "Do not claim you can see or update a person's case.",
    "If a question is case-specific, direct the user to message their case worker.",
    "Keep answers short, warm, and practical.",
    `Preferred language: ${language === "es" ? "Spanish" : "English"}`,
    `Question: ${question}`
  ].join("\n");

  const response = await openai.responses.create({
    model,
    input: prompt
  });

  return String(response.output_text || "").trim();
}

module.exports = {
  generateAdminInsight,
  generatePortalHelpReply
};
