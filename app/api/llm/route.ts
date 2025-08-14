import processPrompt from "@/lib/process-prompt";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const LLM_API_URL = "https://router.huggingface.co/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b:fireworks-ai";

export async function POST(req: NextRequest) {
  try {
    const { user_instruction } = await req.json();

    if (!user_instruction) {
      return NextResponse.json(
        { error: 'Missing "user_instruction".' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_LLM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing API key." },
        { status: 500 }
      );
    }

    const apiResponse = await axios.post(
      LLM_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: "user",
            content: processPrompt(user_instruction),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(
      { result: apiResponse.data.choices[0].message.content },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
