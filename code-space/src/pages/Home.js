import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">CodeSpace</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">👤 {user?.name || "User"}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Welcome Section */}
      <header className="text-center py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to CodeSpace 🚀</h2>
        <p className="text-gray-600">Choose a tool below to get started</p>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 px-6 pb-10 max-w-5xl mx-auto">
        {/* IDE Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition">
          <h3 className="text-xl font-semibold text-blue-600">IDE</h3>
          <p className="text-gray-600 mt-2">
            Launch your intelligent code editor with syntax highlighting and multi-language support.
          </p>
          <button
            onClick={() => navigate("/ide")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Open IDE
          </button>
        </div>

        {/* Codes Cart Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition">
          <h3 className="text-xl font-semibold text-green-600">Codes Cart</h3>
          <p className="text-gray-600 mt-2">
            Browse and manage all your saved snippets and code experiments in one place.
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            View Cart
          </button>
        </div>

        {/* Compiler History Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition">
          <h3 className="text-xl font-semibold text-yellow-600">Compiler History</h3>
          <p className="text-gray-600 mt-2">
            Revisit past compilations, view inputs/outputs and re-run previously executed code.
          </p>
          <button
            onClick={() => navigate("/run-history")}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            View History
          </button>
        </div>

        {/* Coding Tasks Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition">
          <h3 className="text-xl font-semibold text-purple-600">Coding Tasks</h3>
          <p className="text-gray-600 mt-2">
            Challenge yourself with curated problems and track your coding practice progress.
          </p>
          <button
            onClick={() => navigate("/tasks")}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Start Solving
          </button>
        </div>
      </div>
    </div>
  );
}
