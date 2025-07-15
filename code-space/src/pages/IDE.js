import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function IDE() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Start coding...");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const emailKey = user?.email;
  const codesKey = `myCodes_${emailKey}`;
  const historyKey = `compilerHistory_${emailKey}`;

  const handleRun = async () => {
    if (!code.trim()) return toast.error("Code can't be empty!");
    try {
      const res = await fetch("http://localhost:5000/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, input }),
      });
      const data = await res.json();
      const result = data.output || "No output.";
      setOutput(result);

      const newEntry = {
        language,
        tags,
        code,
        input,
        output: result,
        timestamp: new Date().toLocaleString(),
      };

      const history = JSON.parse(localStorage.getItem(historyKey)) || [];
      localStorage.setItem(historyKey, JSON.stringify([newEntry, ...history]));
    } catch (err) {
      toast.error("Execution error.");
    }
  };

  const handleSave = () => {
    if (!title.trim() || !code.trim()) {
      return toast.error("Title and code are required to save.");
    }

    const newSnippet = {
      id: Date.now(),
      title,
      tags,
      language,
      code,
      date: new Date().toLocaleString(),
    };

    const existingSnippets = JSON.parse(localStorage.getItem(codesKey)) || [];
    localStorage.setItem(codesKey, JSON.stringify([newSnippet, ...existingSnippets]));
    toast.success("Code saved to My Cart!");
  };

  const handleClear = () => {
    setCode("");
    setInput("");
    setOutput("");
    setTitle("");
    setTags("");
  };

  const extensionsMap = {
    javascript: javascript(),
    python: python(),
    java: java(),
    cpp: cpp(),
    c: cpp(),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">CodeSpace</div>
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate("/home")} className="text-gray-600 hover:text-blue-600">Home</button>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="px-6 py-4">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">Online IDE</h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border p-2 rounded focus:ring focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="flex-1 border p-2 rounded focus:ring focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border p-2 rounded focus:ring focus:ring-blue-400"
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleRun}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1"
              >
                ▶️ Run
              </button>
              <button
                onClick={handleClear}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center gap-1"
              >
                🧹 Clear
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1"
              >
                💾 Save
              </button>
            </div>
          </div>

          <CodeMirror
            height="400px"
            value={code}
            theme={dracula}
            extensions={[extensionsMap[language] || javascript()]}
            onChange={(val) => setCode(val)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Input</h3>
              <textarea
                rows="5"
                className="w-full border p-2 rounded focus:ring focus:ring-blue-400"
                placeholder="Enter input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Output</h3>
              <div className="w-full border p-2 rounded bg-gray-50 min-h-[120px] whitespace-pre-wrap">
                {output || "Output will appear here..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
