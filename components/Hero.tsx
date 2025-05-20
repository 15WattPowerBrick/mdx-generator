import { Button } from "./ui/button";
import Link from "next/link"; // Assuming you are using Next.js for client-side navigation

export default function Hero() {
  return (
    <>
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-24 sm:py-32 rounded-xl shadow-sm">
        {/* Background blobs/shapes for visual interest */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <svg
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="e813992c-7d03-4cc4-a2bd-1517462bdf1d"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#e813992c-7d03-4cc4-a2bd-1517462bdf1d)"
            />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Unleash the Power of{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                AI-Powered MDX
              </span>{" "}
              Documentation
            </h1>
            <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Effortlessly transform your code snippet into meaningful MDX
              documentation in seconds with Gemini AI.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {/* Using Link for internal navigation, or a regular <a> tag for external */}
              <Link href="https://github.com/YOUR_GITHUB_REPO_LINK" passHref>
                <Button className="px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-700 text-white">
                  Visit GitHub Repo
                </Button>
              </Link>
              <Button
                variant="outline"
                className="px-8 py-3 text-lg font-medium border-2 border-blue-500 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all duration-300"
              >
                See more cool stuff
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
