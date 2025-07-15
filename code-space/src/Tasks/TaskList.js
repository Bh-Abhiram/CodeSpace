import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tasksData } from "./tasksData";

export default function TaskList() {
  const { level } = useParams();
  const navigate = useNavigate();
  const tasks = tasksData[level] || [];

  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        if (!userEmail) {
          console.error("No user logged in!");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/tasks/submissions/${userEmail}`
        );
        const submissions = await res.json();

        const completed = submissions
          .filter((s) => s.level === level && s.status === "Approved") 
          .map((s) => s.taskId);

        setCompletedTasks(completed);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [level, userEmail]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 capitalize">
        {level} Level Tasks
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading tasks...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white shadow rounded p-4 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {task.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {task.description.slice(0, 80)}...
              </p>
              {completedTasks.includes(task.id) && (
                <span className="inline-block mb-2 text-green-600 font-medium">
                  ✅ Completed
                </span>
              )}
              <button
                onClick={() => navigate(`/tasks/${level}/${task.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                View Task
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate("/tasks")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back to Levels
        </button>
      </div>
    </div>
  );
}
