import { useState } from "react";
import { API_URL } from "../config";

function Login({ setUser, setPage, addToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister
      ? { name, email, password, role }
      : { email, password };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        addToast(isRegister ? "Account created successfully! 🎉" : `Welcome back, ${data.name}! 👋`, "success");
        setPage("home");
      } else {
        addToast(data.message || "An error occurred. Please try again.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Cannot connect to server. Please ensure the backend is running.", "error");
    }
  };

  return (
    <div className="form-container">
      <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        {isRegister
          ? "Register as a Customer or Admin to test role features."
          : "Sign in to proceed with your shopping experience."}
      </p>

      {/* Error messages are handled by slide-in toasts */}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {isRegister && (
          <div className="form-group">
            <label htmlFor="role">User Role (For Testing)</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-color)",
                color: "var(--text-main)",
                fontSize: "0.95rem",
                outline: "none"
              }}
            >
              <option value="user">Standard User (Customer)</option>
              <option value="admin">Administrator (Merchant)</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn form-submit-btn">
          {isRegister ? "Register" : "Sign In"}
        </button>
      </form>

      <div className="form-toggle-link">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <span onClick={() => { setIsRegister(false); }}>Sign In</span>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <span onClick={() => { setIsRegister(true); }}>Register</span>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
