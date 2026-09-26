import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
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

        <h2>Login</h2>

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
            placeholder="Enter password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {message && (
          <p className="login-error">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Login;