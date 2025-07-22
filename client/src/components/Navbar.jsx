// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("User")));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Handle screen resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update user state on localStorage change (e.g. login/logout)
  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem("User")));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const styles = {
    navbar: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "12px" : "16px",
      padding: "12px 24px",
      backgroundColor: "#000000",
      boxShadow: "0 0 20px rgba(109, 40, 217, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, sans-serif",
      zIndex: 1000,
      width: "100%",
      boxSizing: "border-box",
    },
    link: {
      color: "#6d28d9",
      textDecoration: "none",
      fontWeight: "500",
      fontSize: isMobile ? "0.95rem" : "1rem",
      padding: "6px 12px",
      borderRadius: "8px",
      transition: "all 0.3s ease-in-out",
      textAlign: "center",
    },
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.link}>Home</Link>

     
        <>
          <Link to="/register" style={styles.link}>Register</Link>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/profile" style={styles.link}>Profile</Link>
          <Link to="/reset-password" style={styles.link}>Reset Password</Link>
          <Link to="/logout" style={styles.link}>Logout</Link>
        </>
     
        <>
          
        </>
     
    </nav>
  );
};

export default Navbar;
