// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Logout from "./pages/Logout/Logout";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard"; // Assuming you have a Dashboard component
import Home from "./pages/Home";
import ProgressSnapshot from "./pages/ProgressSnapshot";  
import STT from "./pages/STT"; // Assuming you have a STT component 



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/stt" element={<STT />} /> {/* Add STT route */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/progress" element={<ProgressSnapshot />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
