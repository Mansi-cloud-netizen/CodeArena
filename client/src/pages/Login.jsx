// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    fontFamily: "Inter, sans-serif",
    padding: "1rem",
  },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 0 30px rgba(109, 40, 217, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#6d28d9",
    textAlign: "center",
    marginBottom: "1rem",
  },
  input: {
    backgroundColor: "transparent",
    border: "2px solid #6d28d9",
    color: "#6d28d9",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "0 0 10px #6d28d9",
    outline: "none",
    fontSize: "1rem",
    transition: "box-shadow 0.3s ease-in-out",
  },
  button: {
    background: "linear-gradient(to right, #00ffcc, #6d28d9)",
    color: "#000",
    fontWeight: "bold",
    border: "none",
    padding: "12px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "1rem",
    boxShadow: "0 0 20px #6d28d9",
    transition: "transform 0.2s",
  },
};

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { identifier, password });
      localStorage.setItem("token", res.data.token);
      navigate("/Dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={login} style={styles.form}>
        <h2 style={styles.title}>Login</h2>

        <input
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email or Phone"
          style={styles.input}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
