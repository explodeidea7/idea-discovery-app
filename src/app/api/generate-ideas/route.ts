export interface QuestionnaireData {
  industry?: string[];
  experience?: string;
  budget?: string;
  timeline?: string;
  market_preference?: string;
  risk_tolerance?: number | string;
  strengths?: string[];
  goals?: string;
  [key: string]: unknown;
}

export interface BusinessIdea {
  title: string;
  summary: string;
  confidenceScore: number;
  marketSize: string;
  estimatedRevenue: string;
  implementationTime: string;
  riskLevel: "low" | "medium" | "high";
  category: string;
}

export interface TrendsItem {
  industry: string;
  title: string;
  url: string;
  points: number;
  created_at: string;
}

export type ResponseShape = {
  businessIdea: BusinessIdea;
  trends: TrendsItem[];
};

const BASE_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function sanitizeString(input: unknown): string {
  return typeof input === "string" ? input.trim() : "";
}

function coerceBusinessIdea(input: any): BusinessIdea {
  const risk = sanitizeString(input?.riskLevel).toLowerCase();
  const riskLevel: "low" | "medium" | "high" =
    risk === "low" || risk === "medium" || risk === "high" ? (risk as any) : "medium";

  const confidence = Number(input?.confidenceScore);
  const confidenceScore = Number.isFinite(confidence)
    ? Math.max(0, Math.min(100, Math.round(confidence)))
    : 65;

  return {
    title: sanitizeString(input?.title) || "Untitled Concept",
    summary: sanitizeString(input?.summary) || "A concise summary will appear here.",
    confidenceScore,
    marketSize: sanitizeString(input?.marketSize) || "N/A",
    estimatedRevenue: sanitizeString(input?.estimatedRevenue) || "N/A",
    implementationTime: sanitizeString(input?.implementationTime) || "N/A",
    riskLevel,
    category: sanitizeString(input?.category) || "General",
  };
}

function coerceTrends(items: any[]): TrendsItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((t) => {
      const title = sanitizeString(t?.title);
      const url = sanitizeString(t?.url);
      const industry = sanitizeString(t?.industry);
      const pointsNum = Number(t?.points);
      const created = sanitizeString(t?.created_at);
      if (!title || !industry) return null;
      return {
        industry,
        title,
        url: url || "",
        points: Number.isFinite(pointsNum) ? pointsNum : 0,
        created_at: created || "",
      } as TrendsItem;
    })
    .filter(Boolean) as TrendsItem[];
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function fetchTrendsForIndustry(industry: string): Promise<TrendsItem[]> {
  const query = encodeURIComponent(industry);
  const url = `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=5`;
  try {
    const res = await fetchWithTimeout(url, { method: "GET" }, 8000);
    if (!res.ok) return [];
    const data: any = await res.json();
    const hits: any[] = Array.isArray(data?.hits) ? data.hits : [];
    return hits
      .map((h: any) => {
        const title = sanitizeString(h?.title) || sanitizeString(h?.story_title) || "";
        const rawUrl = sanitizeString(h?.url) || sanitizeString(h?.story_url) || "";
        const id = sanitizeString(h?.objectID);
        const urlFinal = rawUrl || (id ? `https://news.ycombinator.com/item?id=${id}` : "");
        const points = Number(h?.points);
        const created = sanitizeString(h?.created_at) || "";
        if (!title) return null;
        return {
          industry,
          title,
          url: urlFinal,
          points: Number.isFinite(points) ? points : 0,
          created_at: created,
        } as TrendsItem;
      })
      .filter(Boolean) as TrendsItem[];
  } catch {
    return [];
  }
}

function buildPrompt({
  answers,
  trends,
}: {
  answers: QuestionnaireData;
  trends: TrendsItem[];
}): { system: string; user: string } {
  const system = [
    "You are a sharp venture analyst. You evaluate founder questionnaires alongside recent tech and market signals to craft one best-fit startup idea.",
    "Constraints:",
    "- Output JSON ONLY with the exact schema below. Do not include backticks or explanations.",
    "- Be concise and pragmatic. Use clear, specific language.",
    "- Ensure confidenceScore is an integer between 0 and 100.",
    "- Choose an appropriate riskLevel from: low | medium | high.",
    "",
    "TypeScript shape to output strictly:",
    "interface BusinessIdea { title: string; summary: string; confidenceScore: number; marketSize: string; estimatedRevenue: string; implementationTime: string; riskLevel: \"low\" | \"medium\" | \"high\"; category: string }",
    "interface TrendsItem { industry: string; title: string; url: string; points: number; created_at: string }",
    "type ResponseShape = { businessIdea: BusinessIdea; trends: TrendsItem[] }",
  ].join("\n");

  const safeArr = (val: unknown) => (Array.isArray(val) ? (val as unknown[]).map(sanitizeString).filter(Boolean) : []);

  const userObj = {
    questionnaire: {
      industry: safeArr(answers.industry),
      experience: sanitizeString(answers.experience),
      budget: sanitizeString(answers.budget),
      timeline: sanitizeString(answers.timeline),
      market_preference: sanitizeString(answers.market_preference),
      risk_tolerance: typeof answers.risk_tolerance === 'number' ? String(answers.risk_tolerance) : sanitizeString(answers.risk_tolerance),
      strengths: safeArr(answers.strengths),
      goals: sanitizeString(answers.goals),
    },
    trend_snippets: trends,
    instruction: "Propose exactly one businessIdea aligned to the questionnaire and supported by the trend_snippets. Output JSON with keys: businessIdea, trends (reuse or refine given snippets).",
  };

  const user = JSON.stringify(userObj);
  return { system, user };
}

function tryParseJSONStrict(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractFirstJsonObject(text: string): string | null {
  // Remove code fences if present
  let cleaned = text.trim();
  // Strip common fences
  if (cleaned.startsWith("")) {
    cleaned = cleaned.replace(/^[a-zA-Z]*\n?/, "").replace(/$/, "");
  }

  let inString = false;
  let escape = false;
  let depth = 0;
  let start = -1;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      if (depth > 0) depth--;
      if (depth === 0 && start !== -1) {
        return cleaned.slice(start, i + 1);
      }
    }
  }

  return null;
}

function robustParseResponseShape(rawText: string, fallbackTrends: TrendsItem[]): ResponseShape | null {
  // Attempt direct parse
  let parsed: any = tryParseJSONStrict(rawText);

  if (!parsed) {
    // Try extracting a JSON object
    const objText = extractFirstJsonObject(rawText);
    if (objText) {
      parsed = tryParseJSONStrict(objText);
    }
  }

  if (!parsed) return null;

  const businessIdea = coerceBusinessIdea(parsed?.businessIdea);
  const trends = coerceTrends(parsed?.trends);
  return {
    businessIdea,
    trends: trends.length ? trends : fallbackTrends,
  };
}

function generateFallbackIdea(answers: QuestionnaireData, trends: TrendsItem[]): BusinessIdea {
  const industry = Array.isArray(answers.industry) && answers.industry.length ? answers.industry[0] : "General";
  const timeline = sanitizeString(answers.timeline) || "3-6 months";
  const goal = sanitizeString(answers.goals) || "grow a sustainable business";
  const strengths = Array.isArray(answers.strengths) ? answers.strengths : [];
  const riskToleranceStr = typeof answers.risk_tolerance === 'number' ? String(answers.risk_tolerance) : sanitizeString(answers.risk_tolerance);
  const riskNum = Number(riskToleranceStr);
  const riskLevel: "low" | "medium" | "high" = Number.isFinite(riskNum) ? (riskNum <= 3 ? "low" : riskNum >= 8 ? "high" : "medium") : "medium";
  const highlight = trends[0]?.title || "emerging demand signals";

  return {
    title: `${industry} Opportunity: Trend-Aligned Concept`,
    summary: `Based on your profile and live trend signals (e.g., ${highlight}), this concept targets your goal to ${goal}. It leverages your strengths${strengths.length ? ` (${strengths.join(', ')})` : ''} and is scoped for a ${timeline} implementation.`,
    confidenceScore: Math.min(95, Math.max(60, 70 + (Number.isFinite(riskNum) ? (8 - riskNum) * 2 : 0))),
    marketSize: "$500M+ TAM (estimated)",
    estimatedRevenue: "$50k-$200k in Year 1 (range)",
    implementationTime: timeline,
    riskLevel,
    category: industry,
  };
}

export async function POST(req: Request): Promise<Response> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON body. Expecting { answers: QuestionnaireData }." },
        { status: 400, headers: BASE_HEADERS }
      );
    }

    if (!body || typeof body !== "object" || !body.answers || typeof body.answers !== "object") {
      return Response.json(
        { error: "Bad Request: Missing 'answers' object in request body." },
        { status: 400, headers: BASE_HEADERS }
      );
    }

    const incoming: QuestionnaireData = body.answers as QuestionnaireData;
    const industriesRaw = Array.isArray(incoming.industry) ? incoming.industry : [];
    const industries = industriesRaw
      .filter((x) => typeof x === "string")
      .map(sanitizeString)
      .filter(Boolean)
      .slice(0, 3);

    const experience = sanitizeString(incoming.experience);
    const budget = sanitizeString(incoming.budget);
    const timeline = sanitizeString(incoming.timeline);
    const market_preference = sanitizeString(incoming.market_preference);
    const risk_tolerance = typeof incoming.risk_tolerance === 'number' ? String(incoming.risk_tolerance) : sanitizeString(incoming.risk_tolerance);
    const strengthsArr = Array.isArray(incoming.strengths) ? incoming.strengths.map(sanitizeString).filter(Boolean) : [];
    const goals = sanitizeString(incoming.goals);

    // Fetch trends for up to 3 industries
    const trendResults = await Promise.all(
      industries.map((ind) => fetchTrendsForIndustry(ind))
    );
    const aggregatedTrends = trendResults.flat().slice(0, 15);

    // Build normalized answers
    const answers: QuestionnaireData = {
      industry: industries,
      experience,
      budget,
      timeline,
      market_preference,
      risk_tolerance,
      strengths: strengthsArr,
      goals,
    };

    // Fallback path when no API key is configured
    if (!apiKey) {
      const fallbackIdea = generateFallbackIdea(answers, aggregatedTrends);
      return Response.json(
        { businessIdea: fallbackIdea, trends: aggregatedTrends },
        { status: 200, headers: BASE_HEADERS }
      );
    }

    const { system, user } = buildPrompt({ answers, trends: aggregatedTrends });

    const payload = {
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    };

    const openAIRes = await fetchWithTimeout(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      },
      30000
    );

    if (!openAIRes.ok) {
      const errText = await openAIRes.text().catch(() => "Unknown error");
      return Response.json(
        {
          error: "OpenAI API request failed.",
          status: openAIRes.status,
          details: errText,
        },
        { status: 500, headers: BASE_HEADERS }
      );
    }

    const openAIData: any = await openAIRes.json().catch(() => null);
    const rawText: string =
      sanitizeString(openAIData?.choices?.[0]?.message?.content) || "";

    if (!rawText) {
      return Response.json(
        {
          error: "OpenAI returned an empty response.",
        },
        { status: 500, headers: BASE_HEADERS }
      );
    }

    const parsed = robustParseResponseShape(rawText, aggregatedTrends);
    if (!parsed) {
      return Response.json(
        {
          error: "Failed to parse model response as JSON.",
          raw: rawText,
        },
        { status: 500, headers: BASE_HEADERS }
      );
    }

    // Final response
    return Response.json(
      {
        businessIdea: parsed.businessIdea,
        trends: parsed.trends,
      } satisfies ResponseShape,
      { status: 200, headers: BASE_HEADERS }
    );
  } catch (err: any) {
    return Response.json(
      {
        error: "Unexpected server error.",
        details: sanitizeString(err?.message) || "Unknown error",
      },
      { status: 500, headers: BASE_HEADERS }
    );
  }
}