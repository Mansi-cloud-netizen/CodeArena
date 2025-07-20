// src/pages/Register.jsx
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
    maxWidth: "500px",
    width: "100%",
    color: "#6d28d9",
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
  textarea: {
    backgroundColor: "transparent",
    border: "2px solid #6d28d9",
    color: "#6d28d9",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "0 0 10px #6d28d9",
    outline: "none",
    fontSize: "1rem",
    resize: "vertical",
    minHeight: "80px",
  },
  select: {
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
  file: {
    color: "#6d28d9",
    backgroundColor: "transparent",
    padding: "12px",
    border: "2px solid #6d28d9",  
  },

};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    language: "",
    proficiency: "A1",
    goals: "",
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) data.append(key, form[key]);

    try {
      await axios.post("/auth/register", data);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Register</h2>

        <input
          type="file"
          name="avatar"
          onChange={handleChange}
          style={styles.file}
        />
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="language"
          placeholder="Target Language"
          onChange={handleChange}
          style={styles.input}
        />
        <textarea
          name="goals"
          placeholder="Learning Goals"
          onChange={handleChange}
          style={styles.textarea}
        />
        <select name="proficiency" onChange={handleChange} style={styles.select}>
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
};

export default Register;
