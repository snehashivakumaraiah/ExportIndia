import "../styles/BuyerRegister.css";
import { useState } from "react";

function BuyerRegister({ onBack, onLogin, onRegister }) {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const password = values.get("password");
    if (password !== values.get("confirmPassword")) {
      setFormError("The passwords do not match.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    await onRegister({
      name: values.get("name").trim(),
      company: values.get("company").trim(),
      email: values.get("email").trim(),
      phone: values.get("phone").trim(),
      country: values.get("country").trim(),
      password,
    });
    setSubmitting(false);
  };

  return (
    <div className="buyer-register-page">

      <div className="buyer-register-container">

        {/* BRAND */}

        <div className="buyer-register-brand">

          <div className="buyer-logo">
            EI
          </div>

          <h1>ExportIndia</h1>

          <p>
            Global Scrap & Commodity Exports
          </p>

        </div>


        {/* REGISTER CARD */}

        <div className="buyer-register-card">

          <h2>Create Buyer Account</h2>

          <p className="buyer-register-subtitle">
            Register to enquire about our products
          </p>


          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="buyer-form-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                autoComplete="name"
                maxLength="150"
                placeholder="Enter your full name"
                required
              />

            </div>


            {/* COMPANY */}

            <div className="buyer-form-group">

              <label>Company Name</label>

              <input
                type="text"
                name="company"
                autoComplete="organization"
                maxLength="150"
                placeholder="Enter your company name"
                required
              />

            </div>


            {/* EMAIL */}

            <div className="buyer-form-group">

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                autoComplete="email"
                maxLength="254"
                placeholder="Enter your email"
                required
              />

            </div>


            {/* PHONE */}

            <div className="buyer-form-group">

              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                minLength="5"
                placeholder="Enter your phone number"
                required
              />

            </div>


            {/* COUNTRY */}

            <div className="buyer-form-group">

              <label>Country</label>

              <input
                type="text"
                name="country"
                autoComplete="country-name"
                maxLength="100"
                placeholder="Enter your country"
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="buyer-form-group">

              <label>Password</label>

              <input
                type="password"
                name="password"
                autoComplete="new-password"
                minLength="12"
                maxLength="128"
                placeholder="Create a password"
                required
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="buyer-form-group">

              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                minLength="12"
                maxLength="128"
                placeholder="Confirm your password"
                required
              />

            </div>


            {formError && <p className="form-error" role="alert">{formError}</p>}

            <button
              type="submit"
              className="buyer-register-submit"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>

          </form>


          {/* LOGIN */}

          <div className="existing-account">

            <p>
              Already have an account?
            </p>

            <button type="button" onClick={onLogin}>
              Buyer Login
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

export default BuyerRegister;