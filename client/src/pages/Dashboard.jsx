import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

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
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 0 30px rgba(109, 40, 217, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
    color: "#6d28d9",
  },
  heading: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#6d28d9",
  },
  paragraph: {
    fontSize: "1rem",
    color: "#ccc",
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

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/user/me")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load user", err));
  }, []);

  if (!user) return <div style={styles.container}><p style={styles.paragraph}>Loading...</p></div>;

  return (
    <>
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome to {user.name}'s Dashboard</h1>
        <p style={styles.paragraph}>This is the main interface for the AI-powered language learning features.</p>
        {/* <button
          style={styles.button}
          onClick={() => axios.post("/user/progress/xp", { xp: 10 })}
        >
          +10 XP (Simulate Practice)
        </button> */}
        <button
          style={styles.button}
          onClick={() => navigate("/STT")}
        >
          Explore
        </button>
      </div><br></br>
 
  </div>
   <h3
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      padding: "1rem",
      borderRadius: "12px",
      color: "#6d28d9",
      fontSize: "2rem",
      maxWidth: "100%",
      width: "100%",
      textAlign: "center",
      fontWeight: "600",
      boxShadow: "0 0 15px rgba(109, 40, 217, 0.3)",
    }}
  >
    Your Ultimate Guide to AI Acharya
  </h3>
   <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
    
    <video width="100%" controls autoPlay loop>
      <source src="/guide.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
  </>
  );
};

export default Dashboard;
