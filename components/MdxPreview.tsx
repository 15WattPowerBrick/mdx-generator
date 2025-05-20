"use client";

import { useState, useEffect } from "react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { Loader2 } from "lucide-react";
import remarkGfm from "remark-gfm";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

type MdxPreviewProps = {
  mdxSource: string;
};

export default function MdxPreview({ mdxSource }: MdxPreviewProps) {
  const [compiledSource, setCompiledSource] =
    useState<MDXRemoteSerializeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preprocessMdx = (source: string): string => {
    if (!source) return "";
    let processed = source.replace(/```(mdx|markdown)?\s*\n/g, "```\n");
    processed = processed.replace(/```\s*$/gm, "```\n");
    processed = processed.replace(/^(#{1,6})([^#\s])/gm, "$1 $2");
    return processed;
  };

  useEffect(() => {
    async function compileMdx() {
      if (!mdxSource) {
        setCompiledSource(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const processedMdx = preprocessMdx(mdxSource);
        const mdxCompiled = await serialize(processedMdx, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        });
        setCompiledSource(mdxCompiled);
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Failed to render MDX";
        console.error("Error compiling MDX:", err);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    compileMdx();
  }, [mdxSource]);

  const components = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-2xl font-semibold mb-4" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-xl font-semibold mt-6 mb-3" {...props} />
    ),
    code: (props: React.HTMLAttributes<HTMLElement>) => (
      <code
        className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
        {...props}
      />
    ),
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <pre
        className="p-4 rounded-md bg-gray-100 dark:bg-gray-800 overflow-x-auto text-sm my-4"
        {...props}
      />
    ),
  };

  if (!mdxSource) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-gray-500 dark:text-gray-400 text-sm">
        Documentation preview will appear here...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Loader2 className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          Rendering preview...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-600 p-4 text-sm">
        <p>Error rendering MDX: {error}</p>
        <p className="text-xs mt-2">Displaying raw content instead:</p>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded w-full overflow-auto max-h-64 text-sm">
          {mdxSource}
        </pre>
      </div>
    );
  }

  return (
    <div className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-900 rounded-xl shadow-md p-4">
      {compiledSource && (
        <MDXRemote {...compiledSource} components={components} />
      )}
    </div>
  );
}
