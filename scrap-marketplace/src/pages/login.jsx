import "../styles/login.css";
import { useState } from "react";

function Login({ onBack, onLogin }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    await onLogin({
      email: formData.get("email").trim(),
      password: formData.get("password"),
    });
    setSubmitting(false);
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-brand">

          <div className="logo-circle">
            EI
          </div>

          <h1>ExportIndia</h1>

          <p>
            Global Scrap Exporter
          </p>

        </div>

        <div className="login-card">

          <h2>Admin Login</h2>

          <p className="login-subtitle">
            Login to manage your products and enquiries
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                name="email"
                autoComplete="username"
                maxLength="254"
                placeholder="Enter your email"
                required
              />

            </div>

            <div className="form-group">

              <label>Password</label>

              <input
                type="password"
                name="password"
                autoComplete="current-password"
                maxLength="128"
                placeholder="Enter your password"
                required
              />

            </div>

            <div className="forgot-password">

              Admin credentials are configured by the deployment administrator.

            </div>

            <button
              type="submit"
              className="login-button"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Login"}
            </button>

          </form>

          <button
            type="button"
            className="app-back-button app-back-button--full"
            onClick={onBack}
          >
            ← Back to Website
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;