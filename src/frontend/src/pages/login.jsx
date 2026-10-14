
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { Link, useNavigate, useLocation} from "react-router-dom";
import "../css/login.css";

function Login() {
  const navigate = useNavigate(); //used for navigating to other pages
  const { login } = useAuth();
  const location = useLocation(); //used for protecting links

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  
async function handleSubmit(event) {
  event.preventDefault();
  setError("");

  if (!email.trim() || !password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Login failed.");
    }

    // The backend must verify credentials before returning success.
    // The API request succeeded and data contains the JSON response.
    login(data.user);

    const destination = location.state?.from?.pathname || "/";

    navigate(destination, { replace: true });

    // We'll add authenticated navigation after implementing
    // the backend's session or token handling.
  } catch (error) {
    setError(
      error.message || "Unable to connect to the backend."
    );
  }
}


  return (
    <main className="login-page">
      <section className="login-card">
        <p className="login-brand">
          Pay<span>off</span>
        </p>

        <div className="login-heading">
          <h1>Sign in</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="login-submit" type="submit">
            Sign in
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;