"use client";

import React, { useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

export default function CodeInput() {
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl shadow-md p-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Code Input
      </label>
      <CodeEditor
        value={code}
        language="js"
        placeholder="Paste your JavaScript code here..."
        onChange={(evn) => setCode(evn.target.value)}
        padding={16}
        className="rounded-md shadow-sm overflow-hidden"
        style={{
          backgroundColor: "#f9f9f9",
          fontFamily:
            "ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace",
          fontSize: 14,
          borderRadius: 8,
        }}
      />
    </div>
  );
}
