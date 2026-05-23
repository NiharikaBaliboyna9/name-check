import { NextRequest, NextResponse } from "next/server";
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const MODEL_ID =
  process.env.BEDROCK_MODEL_ID ?? "us.amazon.nova-pro-v1:0";

console.log("ENV CHECK:", {
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID?.slice(0, 8),
  AWS_ROLE_ARN: process.env.AWS_ROLE_ARN,
  AWS_CONTAINER_CREDENTIALS_RELATIVE_URI: process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI,
  AWS_WEB_IDENTITY_TOKEN_FILE: process.env.AWS_WEB_IDENTITY_TOKEN_FILE,
});

const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
  },
});

function parseName(fullName: string): { part: string; name: string }[] {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return [{ part: "first", name: parts[0] }];
  }
  if (parts.length === 2) {
    return [
      { part: "first", name: parts[0] },
      { part: "last", name: parts[1] },
    ];
  }
  const result: { part: string; name: string }[] = [
    { part: "first", name: parts[0] },
  ];
  for (let i = 1; i < parts.length - 1; i++) {
    result.push({ part: "middle", name: parts[i] });
  }
  result.push({ part: "last", name: parts[parts.length - 1] });
  return result;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const nameParts = parseName(body.name);

  const namingList = nameParts
    .map((p) => `- ${p.part.charAt(0).toUpperCase() + p.part.slice(1)} Name: "${p.name}"`)
    .join("\n");

  const prompt = `You are an expert in onomastics (the study of names), etymology, and cultural history.

Analyze the following name parts and return a JSON array — no markdown, no extra text, only valid JSON.

Name parts to analyze:
${namingList}

Return an array where each element has this exact structure:
{
  "part": "first" | "middle" | "last",
  "name": "the name as given",
  "meaning": "The core meaning or definition of the name in 1–2 sentences",
  "etymology": "The linguistic roots, language of origin, and historical development in 2–3 sentences",
  "origin": "The primary cultural/geographic origin (e.g., Hebrew, Latin, Irish, Japanese)",
  "traits": ["3 to 5 personality traits commonly associated with this name"],
  "notableBearers": ["3 real famous people who share this name (first+last or just last for surnames)"],
  "funFact": "One surprising or delightful fact about this name"
}

Return only the JSON array, nothing else.`;

  try {
    const command = new ConverseCommand({
      modelId: MODEL_ID,
      messages: [{ role: "user", content: [{ text: prompt }] }],
      system: [
        {
          text: "You are an expert in name etymology and cultural history. You always respond with valid JSON only.",
        },
      ],
      inferenceConfig: {
        maxTokens: 2048,
        temperature: 0.6,
      },
    });

    const response = await client.send(command);
    const rawText =
      response.output?.message?.content?.[0]?.text ?? "[]";

    // Strip any accidental markdown code fences
    const cleaned = rawText
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");

    const analyses = JSON.parse(cleaned);

    return NextResponse.json({ analyses });
  } catch (err) {
    console.error("Bedrock error:", err);
    const message = err instanceof Error ? err.message : "Unknown error from Bedrock";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
