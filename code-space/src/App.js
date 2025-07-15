// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import IDE from "./pages/IDE";
import Cart from "./pages/Cart";
import CompilerHistory from "./pages/CompilerHistory";
import TaskHome from "./Tasks/TaskHome";
import TaskList from "./Tasks/TaskList";
import TaskDetails from "./Tasks/TaskDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute> } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/ide" element={<ProtectedRoute> <IDE /> </ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute> <Cart /> </ProtectedRoute>} />
          <Route path="/run-history" element={<ProtectedRoute> <CompilerHistory /> </ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute> <TaskHome /> </ProtectedRoute>} />
          <Route path="/tasks/:level" element={<ProtectedRoute> <TaskList /> </ProtectedRoute>} />
          <Route path="/tasks/:level/:id" element={<ProtectedRoute> <TaskDetails /> </ProtectedRoute>} />         
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
