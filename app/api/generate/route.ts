import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// This would be imported from a proper client library
async function generateWithGemini(prompt: string, systemInstruction: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash-8b",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const data = (await response.text) || "";
    const cleaned = data
      .replace(/^```mdx\s*\n/, "") // Remove leading ```mdx
      .replace(/\n```$/, "") // Remove trailing ```
      .replace(/\n```$/, ""); // Remove trailing ```

    console.log("text:", cleaned);
    return cleaned;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, language = "auto" } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const prompt = `
        \`\`\`${language}
        ${code}
        \`\`\`
        `;

    const systemInstruction = `
        "You are a code documentation specialist. Your task is to take a given code snippet and generate comprehensive documentation for it in MDX format.

        **Input:** A code snippet.
        **Output:** MDX documentation including:
        - A clear, concise purpose statement for the code.
        - Detailed explanation of parameters (if any), including their types and descriptions.
        - Description of the return value (if any), including its type and description.
        - Usage examples with code blocks.
        - Any important notes or considerations.

        Ensure all code blocks within the MDX are properly formatted using fenced code blocks        
    `;

    const mdxContent = await generateWithGemini(prompt, systemInstruction);

    return NextResponse.json({ mdx: mdxContent });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to generate documentation" },
      { status: 500 }
    );
  }
}
