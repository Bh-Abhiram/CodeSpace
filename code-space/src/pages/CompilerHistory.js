import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function CompilerHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const emailKey = user?.email;
  const historyKey = `compilerHistory_${emailKey}`;

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem(historyKey)) || [];
    setHistory(savedHistory);
  }, [historyKey]);

  const downloadPDF = (entry) => {
    const doc = new jsPDF();
    let content = `Language: ${entry.language}\nTags: ${entry.tags}\nDate: ${entry.timestamp}\n\n`;
    content += entry.code + "\n\n";
    content += "---INPUT---\n" + (entry.input || "No input") + "\n\n";
    content += "---OUTPUT---\n" + (entry.output || "No output");

    doc.setFont("Courier", "normal");
    doc.setFontSize(12);
    doc.text(content, 10, 10);
    doc.save(`CodeHistory_${entry.language}_${entry.timestamp.replace(/[: ]/g, "_")}.pdf`);
  };

  const deleteEntry = (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    localStorage.setItem(historyKey, JSON.stringify(newHistory));
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      localStorage.removeItem(historyKey);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-600">🕓 Compiler History</h1>
        <div className="flex gap-3">
          <button
            onClick={clearAllHistory}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            ❌ Clear All
          </button>
          <button
            onClick={() => navigate("/ide")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🔙 Back to IDE
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="text-gray-600">No compiler history found.</p>
      ) : (
        <div className="space-y-6">
          {history.map((entry, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow space-y-2 border-l-4 border-yellow-500"
            >
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="text-sm text-gray-700">
                  <p><strong>Language:</strong> {entry.language}</p>
                  <p><strong>Tags:</strong> {entry.tags}</p>
                  <p><strong>Date:</strong> {entry.timestamp}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadPDF(entry)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    📄 Download PDF
                  </button>
                  <button
                    onClick={() => deleteEntry(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Code:</h4>
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap text-sm">
{entry.code}
                </pre>
              </div>

              <div className="bg-gray-50 p-2 rounded whitespace-pre-wrap text-sm">
                <strong>---INPUT---</strong><br />
                {entry.input || "No input"}<br /><br />
                <strong>---OUTPUT---</strong><br />
                {entry.output || "No output"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
