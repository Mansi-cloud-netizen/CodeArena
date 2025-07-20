// src/pages/Profile.jsx
import { useEffect, useState } from "react";
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
    maxWidth: "600px",
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
  textarea: {
    backgroundColor: "transparent",
    border: "2px solid #6d28d9",
    color: "#6d28d9",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "0 0 10px #6d28d9",
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
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    alignSelf: "center",
  },
  label: {
    fontSize: "0.9rem",
    color: "#816ceaff",
  },
};

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get("/user/me")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Profile error:", err));
  }, []);

  const handleUpdate = async () => {
    await axios.put("/user/update", profile);
    alert("Profile updated!");
  };

  if (!profile) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Profile</h2>

        {profile.avatar && (
          <img
            src={`http://localhost:5000/${profile.avatar}`}
            alt="avatar"
            style={styles.image}
          />
        )}

        <input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Name"
          style={styles.input}
        />

        <textarea
          value={profile.goals}
          onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
          placeholder="Learning Goals"
          style={styles.textarea}
        />

        <select
          value={profile.proficiency}
          onChange={(e) =>
            setProfile({ ...profile, proficiency: e.target.value })
          }
          style={styles.select}
        >
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>

        <label htmlFor="nativeLanguage" style={styles.label}>
          Native Language
        </label>
        <select
          id="nativeLanguage"
          value={profile.nativeLanguage}
          onChange={(e) =>
            setProfile({ ...profile, nativeLanguage: e.target.value })
          }
          style={styles.select}
        >
          <option value="">Select native language</option>
          {[
            "English",
            "Hindi",
            "Gujarati",
            "Spanish",
            "French",
            "Arabic",
            "Mandarin",
            "Bengali",
            "Tamil",
            "Marathi",
            "Telugu",
          ].map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <label htmlFor="language" style={styles.label}>
          Target Language to Learn
        </label>
        <select
          id="language"
          value={profile.language}
          onChange={(e) =>
            setProfile({ ...profile, language: e.target.value })
          }
          style={styles.select}
        >
          <option value="">Select target language</option>
          {[
            "English",
            "Spanish",
            "French",
            "German",
            "Mandarin",
            "Japanese",
            "Korean",
            "Arabic",
            "Russian",
            "Portuguese",
            "Italian",
          ].map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <button onClick={handleUpdate} style={styles.button}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Profile;
