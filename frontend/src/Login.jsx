import { useState } from "react";

const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_URL = configuredApiUrl
  ? `${configuredApiUrl.startsWith("http") ? "" : "https://"}${configuredApiUrl}`
  : "http://localhost:8080";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [accountRole, setAccountRole] = useState("ADMIN");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("error");
    if (mode === "register" && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);

    try {
      const registering = mode === "register";
      const response = await fetch(
        `${API_URL}/api/auth/${registering ? "register" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            ...(registering ? { role: accountRole } : {}),
          }),
        }
      );

      const responseText =
        await response.text();

      if (!response.ok) {
        setMessage(
          responseText ||
            "Login failed."
        );

        setLoading(false);
        return;
      }

      if (registering) {
        setMessageType("success");
        setMessage("Account created. Sign in with your new credentials.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      let result = {};

      try {
        result =
          JSON.parse(responseText);
      } catch (error) {
        console.error(
          "Could not parse login response:",
          error
        );
      }

      const actualRole = (result.role || "USER").toUpperCase();
      if (actualRole !== accountRole) {
        setMessage(`This account is registered as ${actualRole}. Select that account type and try again.`);
        return;
      }

      if (!result.token) {
        setMessage(
          "Login succeeded, but no authentication token was returned."
        );

        setLoading(false);
        return;
      }

      localStorage.setItem(
        "loggedIn",
        "true"
      );

      localStorage.setItem(
        "username",
        result.username ||
          username
      );

      localStorage.setItem(
        "userRole",
        result.role ||
          "USER"
      );

      localStorage.setItem(
        "authToken",
        result.token
      );

      onLogin({
        username:
          result.username ||
          username,

        role:
          result.role ||
          "USER",
      });

    } catch (error) {
      console.error(error);

      setMessage(
        "Could not connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="login-logo">
          PEC
        </div>

        <h1>
          Placement Eligibility Checker
        </h1>

        <p className="login-subtitle">
          Student Placement Management System
        </p>

        <h2>{mode === "register" ? "Create your account" : "Sign in"}</h2>

        <div className="auth-role-field">
          <span>{mode === "register" ? "Account type" : "Sign in as"}</span>
          <div className="auth-role-switch" role="group" aria-label="Account type">
            {[{ value: "ADMIN", label: "Administrator" }, { value: "STUDENT", label: "Student" }].map((role) => (
              <button
                key={role.value}
                type="button"
                className={accountRole === role.value ? "selected" : ""}
                aria-pressed={accountRole === role.value}
                onClick={() => setAccountRole(role.value)}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleLogin}
        >

          <label>
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(event) =>
              setUsername(
                event.target.value
              )
            }
            required
          />

          <label>
            Password
          </label>

          <input
            type="password"
            minLength={mode === "register" ? 6 : undefined}
            placeholder={mode === "register" ? "At least 6 characters" : "Enter password"}
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            required
          />

          {mode === "register" && <>
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </>}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? (mode === "register" ? "Creating account…" : "Signing in…") : (mode === "register" ? "Create account" : "Sign in")}
          </button>

        </form>

        <p className="login-switch">
          {mode === "register" ? "Already have an account?" : "New to Placement Desk?"}
          <button type="button" onClick={() => { setMode(mode === "register" ? "login" : "register"); setMessage(""); setMessageType("error"); }}>
            {mode === "register" ? "Sign in" : "Create an account"}
          </button>
        </p>

        {message && (
          <p className={`login-feedback login-${messageType}`}>
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Login;