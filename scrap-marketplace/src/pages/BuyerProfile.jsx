import { useState } from "react";
import "../styles/BuyerProfile.css";

function BuyerProfile({ onBack }) {

  const [profile, setProfile] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    localStorage.setItem(
      "buyerProfile",
      JSON.stringify(profile)
    );

    alert("Profile saved successfully!");
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

        <button onClick={onBack}>
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
              value={profile.name}
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
              value={profile.company}
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
              name="email"
              placeholder="Enter email"
              value={profile.email}
              onChange={handleChange}
              required
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
              value={profile.phone}
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
              value={profile.country}
              onChange={handleChange}
              required
            />

          </div>


          <button
            type="submit"
            className="save-profile-button"
          >
            Save Profile
          </button>

        </form>

      </main>

    </div>
  );
}

export default BuyerProfile;