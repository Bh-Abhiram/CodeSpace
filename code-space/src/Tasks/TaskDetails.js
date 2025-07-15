import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tasksData } from "./tasksData";
import { FaUpload } from "react-icons/fa";

export default function TaskDetails() {
  const { level, id } = useParams();
  const navigate = useNavigate();
  const task = tasksData[level]?.find((t) => t.id === parseInt(id));

  const [selectedFile, setSelectedFile] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  useEffect(() => {
   
    if (!userEmail) {
      alert("⚠️ Please login first to access tasks.");
      navigate("/login");
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/tasks/submissions/${userEmail}`
        );
        const submissions = await res.json();

        const submitted = submissions.some(
          (s) => s.level === level && s.taskId === parseInt(id)
        );
        setCompleted(submitted);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };

    fetchSubmissions();
  }, [level, id, userEmail, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("⚠️ Please select a valid PDF file.");
      e.target.value = null;
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("⚠️ Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("level", level);
    formData.append("taskId", id);
    formData.append("user", userEmail);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/tasks/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (res.status === 200) {
        alert(data.message);
        setCompleted(true);
      } else {
        alert("❌ Submission failed.");
      }
    } catch (err) {
      console.error("Error during submission:", err);
      alert("❌ Server error.");
      setLoading(false);
    }
  };

  if (!task) return <div className="p-6 text-red-600">Task not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        {task.title}{" "}
        {completed && (
          <span className="text-green-600">(Completed ✅)</span>
        )}
      </h1>
      <p className="text-gray-700 mb-6">{task.description}</p>

      {/* Problem Input/Output */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <pre className="text-sm">
          <strong>Sample Input:</strong> {task.input}
        </pre>
        <pre className="text-sm">
          <strong>Expected Output:</strong> {task.output}
        </pre>
      </div>

      {/* File Upload */}
      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full border rounded p-2"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={completed || loading}
          className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
            completed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <FaUpload /> {loading ? "Submitting..." : "Submit Solution (PDF)"}
        </button>

        <button
          onClick={() => navigate("/tasks")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Back to Tasks
        </button>
      </div>
    </div>
  );
}
