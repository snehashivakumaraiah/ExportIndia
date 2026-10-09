import { useState } from "react";
import "../styles/BuyerProfile.css";

function BuyerProfile({ profile, onBack, onSave }) {
  const [formProfile, setFormProfile] = useState({
    name: profile.name,
    company: profile.company,
    phone: profile.phone,
    country: profile.country,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormProfile((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    await onSave(formProfile);
    setSaving(false);
  };

  return (
    <div className="buyer-profile-page">

      <header className="profile-header">

        <div className="dashboard-brand">

          <div className="dashboard-logo">
            EI
          </div>

          <span>
            ExportIndia
          </span>

        </div>

        <button className="app-back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>

      </header>


      <main className="profile-main">

        <p className="dashboard-label">
          BUYER ACCOUNT
        </p>

        <h1>
          My Profile
        </h1>

        <p className="profile-subtitle">
          Manage your personal and company information.
        </p>


        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >

          <div className="profile-form-group">

            <label>
              Your Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              maxLength="150"
              value={formProfile.name}
              onChange={handleChange}
              required
            />

          </div>


          <div className="profile-form-group">

            <label>
              Company Name
            </label>

            <input
              type="text"
              name="company"
              placeholder="Enter company name"
              maxLength="150"
              value={formProfile.company}
              onChange={handleChange}
              required
            />

          </div>


          <div className="profile-form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              value={profile.email}
              readOnly
            />

          </div>


          <div className="profile-form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              minLength="5"
              maxLength="50"
              value={formProfile.phone}
              onChange={handleChange}
              required
            />

          </div>


          <div className="profile-form-group">

            <label>
              Country
            </label>

            <input
              type="text"
              name="country"
              placeholder="Enter country"
              maxLength="100"
              value={formProfile.country}
              onChange={handleChange}
              required
            />

          </div>


          <button
            type="submit"
            className="save-profile-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

        </form>

      </main>

    </div>
  );
}

export default BuyerProfile;