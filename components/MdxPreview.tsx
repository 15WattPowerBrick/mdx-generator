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

  // Function to preprocess MDX source to fix common AI-generated issues
  const preprocessMdx = (source: string): string => {
    if (!source) return "";

    // Fix code blocks that might be incorrectly formatted
    let processed = source.replace(/```(mdx|markdown)?\s*\n/g, "```\n");

    // Make sure code blocks are properly closed
    processed = processed.replace(/```\s*$/gm, "```\n");

    // Make sure there's a space after heading markers
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
        // Preprocess the MDX to fix common issues
        const processedMdx = preprocessMdx(mdxSource);

        // Process MDX on client-side
        const mdxCompiled = await serialize(processedMdx, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            // You can add rehype plugins here if needed
            // rehypePlugins: [rehypePrism, rehypeSlug],
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

  if (!mdxSource) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Documentation preview will appear here...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
        <span className="ml-2 text-gray-500 dark:text-gray-400">
          Rendering preview...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <p>Error rendering MDX: {error}</p>
        <p className="text-sm mt-2">Displaying raw content instead:</p>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 text-sm overflow-auto max-h-64 w-full rounded">
          {mdxSource}
        </pre>
      </div>
    );
  }

  // Define custom components (optional)
  const components = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-2xl font-bold mb-4" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-xl font-bold mb-3 mt-6" {...props} />
    ),
    code: (props: React.HTMLAttributes<HTMLElement>) => (
      <code
        className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded"
        {...props}
      />
    ),
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <pre
        className="p-4 rounded-md bg-gray-100 dark:bg-gray-800 overflow-x-auto"
        {...props}
      />
    ),
  };

  return (
    <article className="prose dark:prose-invert max-w-none">
      {compiledSource && (
        <MDXRemote {...compiledSource} components={components} />
      )}
    </article>
  );
}
