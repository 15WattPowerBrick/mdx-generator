"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Code2, FileText } from "lucide-react";
import { toast } from "sonner";
import MdxPreview from "@/components/MdxPreview";
import Hero from "@/components/Hero";

export default function Home() {
  const [code, setCode] = useState("");
  const [mdxOutput, setMdxOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("code");

  const generateDocumentation = async () => {
    if (!code.trim()) {
      toast("No code provided", {
        description: "Please enter some code to generate documentation.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate documentation");
      }

      const data = await response.json();
      setMdxOutput(data.mdx);
      setActiveTab("preview");

      toast("Documentation generated!", {
        description: "Your code documentation has been created successfully.",
      });
    } catch {
      toast("Error", {
        description: "Failed to generate documentation",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied!", {
      description: "Content copied to clipboard",
    });
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white px-4 py-4 md:py-30">
      <div className="max-w-7xl mx-auto space-y-12">
        <Hero />
        <div className="grid grid-cols-1 gap-6">
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Input Code</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCode("")}
                disabled={!code || isGenerating}
              >
                Clear
              </Button>
            </div>
            <div className="border rounded-lg p-2 bg-gray-100 dark:bg-gray-900">
              <textarea
                className="font-mono text-sm w-full h-100 p-4 bg-transparent resize-none focus:outline-none"
                placeholder="Paste your code snippet here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            <Button
              className="w-full"
              onClick={generateDocumentation}
              disabled={!code.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate Documentation</>
              )}
            </Button>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Documentation Output</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(mdxOutput)}
                disabled={!mdxOutput}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy MDX
              </Button>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code">
                  <Code2 className="h-4 w-4 mr-2" /> MDX Source
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <FileText className="h-4 w-4 mr-2" /> Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="code" className="mt-2">
                <pre className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-900 font-mono text-sm whitespace-pre-wrap">
                  <code>{mdxOutput || "MDX output will appear here..."}</code>
                </pre>
              </TabsContent>
              <TabsContent value="preview" className="mt-2">
                <div className="prose dark:prose-invert max-w-none">
                  <MdxPreview mdxSource={mdxOutput} />
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </main>
  );
}
