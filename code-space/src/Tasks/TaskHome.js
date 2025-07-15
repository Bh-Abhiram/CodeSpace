import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFire, FaMountain, FaRocket } from "react-icons/fa";

export default function TaskHome() {
  const navigate = useNavigate();

  const levels = [
    {
      title: "Beginner",
      description: "Start your journey with basic programming tasks.",
      color: "bg-gradient-to-r from-green-400 to-teal-500",
      icon: <FaRocket size={28} />,
      path: "/tasks/beginner",
    },
    {
      title: "Intermediate",
      description: "Take your coding skills to the next level with moderate challenges.",
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      icon: <FaMountain size={28} />,
      path: "/tasks/intermediate",
    },
    {
      title: "Advanced",
      description: "Test your limits with tough DSA & algorithmic tasks.",
      color: "bg-gradient-to-r from-pink-500 to-purple-600",
      icon: <FaFire size={28} />,
      path: "/tasks/advanced",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white">
      {/* Header */}
      <header className="text-center py-10">
        <h1 className="text-5xl font-extrabold drop-shadow-lg mb-3">
          💻 Coding Challenges
        </h1>
        <p className="text-gray-200 text-lg">
          Select a level and start solving curated programming problems!
        </p>
      </header>

      {/* Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto pb-16">
        {levels.map((level, index) => (
          <div
            key={index}
            onClick={() => navigate(level.path)}
            className={`rounded-2xl shadow-xl p-6 cursor-pointer transform hover:scale-105 hover:shadow-2xl transition duration-300 ${level.color}`}
          >
            <div className="flex justify-center items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex justify-center items-center">
                {level.icon}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">{level.title}</h2>
            <p className="text-center text-gray-100">{level.description}</p>
            <div className="flex justify-center mt-4">
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">
                Explore →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
