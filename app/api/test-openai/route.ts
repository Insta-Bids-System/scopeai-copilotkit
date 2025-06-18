import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Test the API key with a simple completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: "Say 'OpenAI is working!' if you can read this."
        }
      ],
      max_tokens: 50,
    });

    return NextResponse.json({
      status: "success",
      response: completion.choices[0].message.content,
      model: completion.model,
    });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json({
      error: error.message || "Unknown error",
      type: error.type || "unknown",
      code: error.code || "unknown",
    }, { status: 500 });
  }
}
