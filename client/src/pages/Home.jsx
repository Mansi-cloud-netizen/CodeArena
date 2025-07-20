// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    fontFamily: "Inter, sans-serif",
    color: "#6d28d9",
    textAlign: "center",
  },
  box: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "3rem",
    borderRadius: "24px",
    boxShadow: "0 0 30px rgba(109, 40, 217, 0.3)",
    maxWidth: "600px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    background: "linear-gradient(to right, #00ffcc, #6d28d9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  tagline: {
    fontSize: "1.1rem",
    color: "#7c70ebff",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1rem",
    flexWrap: "wrap",
  },
  button: {
    padding: "12px 24px",
    borderRadius: "999px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    border: "none",
    color: "#000",
    background: "linear-gradient(to right, #00ffcc, #6d28d9)",
    boxShadow: "0 0 20px #6d28d9",
    transition: "transform 0.2s",
  },
  secondaryButton: {
    background: "transparent",
    color: "#6d28d9",
    border: "2px solid #6d28d9",
    boxShadow: "0 0 10px #6d28d9",
  },
};

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>AI-Powered Language Learning Companion</h1>
        <p style={styles.tagline}>
          Speak, Learn, and Grow — Your personal AI tutor is ready 24/7.
        </p>
        <div style={styles.buttonContainer}>
          <Link to="/register">
            <button style={styles.button}>Get Started</button>
          </Link>
          <Link to="/login">
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
