// src/components/Navbar.jsx
import { Link } from "react-router-dom";

const styles = {
  navbar: {
    display: "flex",
    gap: "16px",
    padding: "12px 24px",
    backgroundColor: "#000000",
    boxShadow: "0 0 20px rgba(109, 40, 217, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
    zIndex: 1000,
  },
  link: {
    color: "#6d28d9",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "1rem",
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "all 0.3s ease-in-out",
  },
};

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("User"));

  return (
    <nav style={styles.navbar}>
      <a href="/" style={styles.link}>Home</a>
       <a href="/register" style={styles.link}>Register</a>
        <a href="/login" style={styles.link}>Login</a>
       <a href="/profile" style={styles.link}>Profile</a>
       <a href="/reset-password" style={styles.link}>Reset Password</a>
      <a href="/Dashboard" style={styles.link}>Dashboard</a>
      <a href="/logout" style={styles.link}>Logout</a>
    </nav>
  );
};

export default Navbar;
