import "../styles/Login.css";

function Login({ onBack, onLogin }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin();
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
                placeholder="Enter your email"
                required
              />

            </div>

            <div className="form-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                required
              />

            </div>

            <div className="forgot-password">

              <a href="#">
                Forgot password?
              </a>

            </div>

            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>

          <button
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