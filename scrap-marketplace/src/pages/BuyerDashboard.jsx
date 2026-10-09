import "../styles/BuyerDashboard.css";

function BuyerDashboard({ user, products, onLogout, onProducts, enquiries, onEnquiries, onProfile, onSavedProducts }) {

  return (
    <div className="buyer-dashboard">

      {/* HEADER */}

      <header className="dashboard-header">

        <div className="dashboard-brand">

          <div className="dashboard-logo">
            EI
          </div>

          <span>
            ExportIndia
          </span>

        </div>


        <div className="dashboard-user">    

          <span>
            Welcome, {user.name}
          </span>

          <button onClick={onLogout}>
            Logout
          </button>

        </div>

      </header>


      {/* MAIN */}

      <main className="dashboard-main">

        <div className="dashboard-heading">

          <p className="dashboard-label">
            BUYER DASHBOARD
          </p>

          <h1>
            Welcome to ExportIndia, {user.name}
          </h1>

          <p>
            Browse our products and send enquiries
            for your requirements.
          </p>

        </div>


        {/* DASHBOARD CARDS */}

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              📦
            </div>

            <h2>
              Browse Products
            </h2>

            <p>Browse {products.length} listed scrap products and submit your requirements.</p>

            <button onClick={onProducts}>
              View Products →
            </button>

          </div>


          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              📋
            </div>

            <h2>
              My Enquiries
            </h2>

            <p>
              View and track the enquiries
              you have sent to ExportIndia.
            </p>

            <button onClick={onEnquiries}>
              View Enquiries →
            </button>

          </div>


          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              ⭐
            </div>

            <h2>
              Saved Products
            </h2>

            <p>
              Quickly access products
              you are interested in.
            </p>

            <button onClick={onSavedProducts}>
              View Saved →
            </button>

          </div>


          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              👤
            </div>

            <h2>
              My Profile
            </h2>

            <p>
              Manage your company and
              contact information.
            </p>

            <button onClick={onProfile}>
              View Profile →
            </button>

          </div>

        </div>


        {/* RECENT ENQUIRIES */}

        <section className="recent-section">

          <div className="recent-header">

            <div>

              <p className="dashboard-label">
                ACTIVITY
              </p>

              <h2>
                Recent Enquiries
              </h2>

            </div>

            <button onClick={onEnquiries}>
              View All
            </button>

          </div>


          {enquiries.length === 0 ? (
  <div className="empty-enquiries">

    <div className="empty-icon">
      📋
    </div>

    <h3>
      No enquiries yet
    </h3>

    <p>
      Your product enquiries will appear here.
    </p>

  </div>
) : (
  <div className="enquiries-list">

    {enquiries.map((enquiry) => (
      <div className="enquiry-item" key={enquiry.id}>

        <div>
          <h3>{enquiry.product}</h3>

          <p>
            Quantity: {enquiry.quantity}
          </p>
          <p>
            Destination: {enquiry.country}
          </p>
          <p>
            {enquiry.message}
          </p>
        </div>

        <span className="enquiry-status">
          {enquiry.status}
        </span>

      </div>
    ))}

  </div>
)}

        </section>

      </main>

    </div>
  );
}

export default BuyerDashboard;