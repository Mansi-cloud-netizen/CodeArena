// src/pages/ResetPassword.jsx
import { useState } from "react";
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
    color: "#6d28d9",
  },
  card: {
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
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({ email: "", otp: "", newPassword: "" });
  const [showPassword, setShowPassword] = useState(false);

  const sendOTP = async () => {
    await axios.post("/auth/send-otp", { email: info.email });
    setStep(2);
  };

  const resetPassword = async () => {
    await axios.post("/auth/reset-password", info);
    alert("Password reset");
    setStep(1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>
        {step === 1 ? (
          <>
            <input
              placeholder="Email"
              onChange={(e) =>
                setInfo({ ...info, email: e.target.value })
              }
              style={styles.input}
            />
            <button onClick={sendOTP} style={styles.button}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              placeholder="OTP"
              onChange={(e) =>
                setInfo({ ...info, otp: e.target.value })
              }
              style={styles.input}
            />
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                onChange={(e) =>
                  setInfo({ ...info, newPassword: e.target.value })
                }
                style={styles.input}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <button onClick={resetPassword} style={styles.button}>
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
