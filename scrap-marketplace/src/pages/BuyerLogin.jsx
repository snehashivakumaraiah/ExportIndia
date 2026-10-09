import "../styles/BuyerLogin.css";
import { useState } from "react";

function BuyerLogin({ onBack, onRegister, onLogin }) {
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
    <div className="buyer-login-page">

      <div className="buyer-login-container">

        {/* BRAND */}

        <div className="buyer-login-brand">

          <div className="buyer-logo">
            EI
          </div>

          <h1>ExportIndia</h1>

          <p>
            Global Scrap & Commodity Exports
          </p>

        </div>


        {/* LOGIN CARD */}

        <div className="buyer-login-card">

          <h2>Buyer Login</h2>

          <p className="buyer-login-subtitle">
            Login to enquire about our products
          </p>


          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="buyer-form-group">

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                autoComplete="username"
                maxLength="254"
                placeholder="Enter your email"
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="buyer-form-group">

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


            {/* FORGOT PASSWORD */}

            <div className="buyer-forgot">

              Use the email address and password you registered with.

            </div>


            {/* LOGIN */}

            <button
              type="submit"
              className="buyer-login-submit"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Login"}
            </button>

          </form>


          {/* REGISTER */}

          <div className="buyer-register">

            <p>
              Don't have an account?
            </p>

            <button type="button" className="buyer-register-button" onClick={onRegister}>
              Create Buyer Account
            </button>

          </div>


          {/* BACK */}

          <button
            type="button"
            className="buyer-back app-back-button app-back-button--full"
            onClick={onBack}
          >
            ← Back to ExportIndia
          </button>

        </div>

      </div>

    </div>
  );
}

export default BuyerLogin;