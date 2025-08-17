import processPrompt from "@/lib/process-prompt";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const LLM_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req: NextRequest) {
  try {
    const {
      userAPI,
      user_instruction,
    }: { userAPI: string; user_instruction: string } = await req.json();

    if (!user_instruction) {
      return NextResponse.json(
        { error: 'Missing "user_instruction".' },
        { status: 400 }
      );
    }

    const apiKey = userAPI || process.env.NEXT_PUBLIC_FALLBACK_LLM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing API key." },
        { status: 500 }
      );
    }

    const apiResponse = await axios.post(
      `${LLM_API_URL}`,
      {
        contents: [
          {
            parts: [
              {
                text: processPrompt(user_instruction),
              },
            ],
          },
        ],
      },
      {
        headers: {
          "X-goog-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const response = apiResponse.data.candidates[0].content.parts[0]
      .text as string;
    const processedResponse = response.slice(8, response.length - 4);

    return NextResponse.json({ result: processedResponse }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
