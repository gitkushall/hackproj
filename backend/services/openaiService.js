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

module.exports = {
  generateAdminInsight
};
