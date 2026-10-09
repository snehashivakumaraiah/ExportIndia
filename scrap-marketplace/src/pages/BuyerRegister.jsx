import "../styles/BuyerRegister.css";

function BuyerRegister({ onBack, onLogin }) {

  const handleSubmit = (event) => {
    event.preventDefault();

    // Later we will send this data to FastAPI.
    alert("Registration API will be connected here.");
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
                placeholder="Enter your full name"
                required
              />

            </div>


            {/* COMPANY */}

            <div className="buyer-form-group">

              <label>Company Name</label>

              <input
                type="text"
                placeholder="Enter your company name"
                required
              />

            </div>


            {/* EMAIL */}

            <div className="buyer-form-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                required
              />

            </div>


            {/* PHONE */}

            <div className="buyer-form-group">

              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="Enter your phone number"
                required
              />

            </div>


            {/* COUNTRY */}

            <div className="buyer-form-group">

              <label>Country</label>

              <input
                type="text"
                placeholder="Enter your country"
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="buyer-form-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                required
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="buyer-form-group">

              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
                required
              />

            </div>


            <button
              type="submit"
              className="buyer-register-submit"
            >
              Create Account
            </button>

          </form>


          {/* LOGIN */}

          <div className="existing-account">

            <p>
              Already have an account?
            </p>

            <button onClick={onLogin}>
              Buyer Login
            </button>

          </div>


          {/* BACK */}

          <button
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