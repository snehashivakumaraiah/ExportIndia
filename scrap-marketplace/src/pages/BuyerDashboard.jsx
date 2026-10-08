import "../styles/BuyerDashboard.css";

function BuyerDashboard({ onLogout, onProducts, enquiries, onEnquiries,onProfile, onSavedProducts }) {
    const products = [
        { id: 1, name: "Copper Scrap", category: "Copper", price: "₹650 / kg", location: "Bangalore, India", seller: "ABC Metals", }, 
        { id: 2, name: "Aluminium Scrap", category: "Aluminium", price: "₹180 / kg", location: "Mumbai, India", seller: "Global Metals", }, 
        { id: 3, name: "Iron Scrap", category: "Iron", price: "₹45 / kg", location: "Chennai, India", seller: "India Scrap Traders", }, 
        { id: 4, name: "Steel Scrap", category: "Steel", price: "₹55 / kg", location: "Hyderabad, India", seller: "Metal World", }, 
    ];

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
            Welcome, Buyer
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
            Welcome to ExportIndia
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

            <p>
              Explore copper, aluminium, iron,
              steel and other scrap materials.
            </p>

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

            <button>
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