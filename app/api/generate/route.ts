import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// This would be imported from a proper client library
async function generateWithGemini(prompt: string, systemInstruction: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
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
        Generate comprehensive documentation in MDX format for the following code:

        \`\`\`${language}
        ${code}
        \`\`\`
        `;

    const systemInstruction = `
        The documentation must be in MDX format that is clear.

        Important: there is no need to overexplain. Keep it concise and relevant.
    
        The documentation may include:
        1. A concise title and description
        2. Purpose and functionality explanation
        3. Parameters/arguments breakdown
        4. Return values/output explanation
        5. Usage examples
        6. Any key implementation details or algorithms
        7. Edge cases and limitations

        Format the response in clean MDX with appropriate headings, code blocks, and formatting.
        Include the original code in a syntax-highlighted code block.
        Use standard markdown features that are compatible with MDX.

        
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
