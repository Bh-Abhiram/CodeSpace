import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Cart() {
  const [codes, setCodes] = useState([]);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterLang, setFilterLang] = useState("all");
  const [filterTag, setFilterTag] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));
  const emailKey = user?.email;
  const codesKey = `myCodes_${emailKey}`;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(codesKey)) || [];
    setCodes(stored);
    setFilteredCodes(stored);
  }, [codesKey]);

  useEffect(() => {
    let filtered = [...codes];

    if (search.trim()) {
      filtered = filtered.filter((code) =>
        code.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterLang !== "all") {
      filtered = filtered.filter((code) => code.language === filterLang);
    }

    if (filterTag !== "all") {
      filtered = filtered.filter((code) =>
        code.tags?.toLowerCase().includes(filterTag.toLowerCase())
      );
    }

    setFilteredCodes(filtered);
  }, [search, filterLang, filterTag, codes]);

  const handleDelete = (id) => {
    const updated = codes.filter((c) => c.id !== id);
    localStorage.setItem(codesKey, JSON.stringify(updated));
    setCodes(updated);
    toast.success("Deleted!");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Code copied to clipboard!");
  };

  const uniqueLanguages = [
    ...new Set(codes.map((c) => c.language).filter(Boolean)),
  ];
  const uniqueTags = [
    ...new Set(
      codes.flatMap((c) =>
        c.tags ? c.tags.split(",").map((t) => t.trim()) : []
      )
    ),
  ];

  const resetFilters = () => {
    setSearch("");
    setFilterLang("all");
    setFilterTag("all");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">🛒 My Saved Codes</h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          className="px-3 py-2 border rounded-md shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterLang}
          onChange={(e) => setFilterLang(e.target.value)}
          className="px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="all">All Languages</option>
          {uniqueLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="all">All Tags</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <button
          onClick={resetFilters}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          🔄 Reset Filters
        </button>
      </div>

      {filteredCodes.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No matching codes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCodes.map((snippet) => (
            <div
              key={snippet.id}
              className="bg-white rounded-xl shadow-md p-5 border border-blue-100 hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <h2 className="text-xl font-bold text-blue-700">{snippet.title}</h2>
              <p className="text-sm text-gray-500 mb-1">🕒 {snippet.date}</p>
              <p className="text-gray-600 text-sm mb-1">🔖 Tags: {snippet.tags || "None"}</p>
              <p className="text-sm mb-2">
                💻 Language: <span className="font-medium">{snippet.language.toUpperCase()}</span>
              </p>

              <div className="bg-gray-100 text-sm text-gray-800 p-3 rounded mb-4 max-h-40 overflow-auto whitespace-pre-wrap">
                {snippet.code}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => handleDelete(snippet.id)}
                  className="bg-red-500 text-white px-4 py-1 text-sm rounded hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
                <button
                  onClick={() => handleCopy(snippet.code)}
                  className="bg-green-600 text-white px-4 py-1 text-sm rounded hover:bg-green-700"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
