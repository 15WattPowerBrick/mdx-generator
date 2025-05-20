import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  // Animation state for floating blobs
  const [offset, setOffset] = useState(0);

  // Subtle animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 0.5) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative isolate overflow-hidden py-24 sm:py-32 rounded-lg">
      {/* Animated pastel background with blur effect */}
      <div className="absolute inset-0 -z-10">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>

        {/* Animated blurred blobs */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            filter: "blur(70px)",
            opacity: 0.7,
          }}
        >
          {/* Pastel colored blobs that move slowly */}
          <div
            className="absolute h-64 w-64 rounded-full bg-pink-200"
            style={{
              top: `${15 + Math.sin(offset * 0.05) * 5}%`,
              left: `${20 + Math.cos(offset * 0.03) * 3}%`,
            }}
          ></div>
          <div
            className="absolute h-80 w-80 rounded-full bg-purple-200"
            style={{
              top: `${40 + Math.sin(offset * 0.02) * 8}%`,
              right: `${15 + Math.cos(offset * 0.04) * 4}%`,
            }}
          ></div>
          <div
            className="absolute h-72 w-72 rounded-full bg-blue-200"
            style={{
              bottom: `${10 + Math.sin(offset * 0.03) * 6}%`,
              left: `${30 + Math.cos(offset * 0.05) * 5}%`,
            }}
          ></div>
          <div
            className="absolute h-56 w-56 rounded-full bg-teal-200"
            style={{
              top: `${60 + Math.sin(offset * 0.04) * 4}%`,
              left: `${60 + Math.cos(offset * 0.03) * 3}%`,
            }}
          ></div>
        </div>

        {/* Subtle grid pattern overlay for texture */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      {/* Content with backdrop blur for better readability */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block backdrop-blur-sm bg-white/30 p-2 px-4 rounded-full mb-4">
            <span className="text-sm font-semibold text-blue-600">
              Transform your code in seconds
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Code to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
              MDX
            </span>{" "}
            Documentation
          </h1>

          <p className="mt-6 text-lg text-gray-800 max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-white/20 p-4 rounded-xl">
            Effortlessly transform your code snippet into meaningful MDX
            documentation in seconds with Gemini AI.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="https://github.com/15WattPowerBrick/mdx-generator"
              passHref
            >
              <Button className="px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
                Visit GitHub Repo
              </Button>
            </Link>
            <Link href="https://swanhtataung.com" passHref>
              <Button
                variant="outline"
                className="px-8 py-3 text-lg font-medium border-2 border-blue-500 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all duration-300 backdrop-blur-sm bg-white/30 rounded-xl"
              >
                See more cool stuff
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Optional floating code snippet mockup for visual interest */}
      <div className="absolute bottom-10 right-10 max-w-xs hidden lg:block">
        <div className="backdrop-blur-md bg-white/20 p-4 rounded-lg shadow-lg border border-white/40 transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <div className="bg-gray-900/90 p-3 rounded text-xs text-gray-300 font-mono">
            <span className="text-pink-400">const</span>{" "}
            <span className="text-blue-400">docs</span> ={" "}
            <span className="text-green-400">generateMDX</span>(codeSnippet);
          </div>
        </div>
      </div>
    </header>
  );
}
