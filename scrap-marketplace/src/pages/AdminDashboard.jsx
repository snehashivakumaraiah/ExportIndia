import "../styles/AdminDashboard.css";

function AdminDashboard({ products, enquiries, onLogout, onProducts, onEnquiries }) {
  const pendingEnquiries = enquiries.filter(
    (enquiry) => enquiry.status === "Pending"
  ).length;
  const availableProducts = products.filter(
    (product) => product.available !== false
  ).length;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-logo">EI</div>
          <span>ExportIndia</span>
        </div>
        <div className="admin-header-actions">
          <span>Seller Admin</span>
          <button type="button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-intro">
          <p className="admin-eyebrow">ADMIN DASHBOARD</p>
          <h1>Manage your marketplace</h1>
          <p>Manage your product catalog and respond to buyer enquiries.</p>
        </section>

        <section className="admin-stats" aria-label="Marketplace summary">
          <article className="admin-stat">
            <span className="admin-stat-icon" aria-hidden="true">📦</span>
            <div>
              <p>Total products</p>
              <strong>{products.length}</strong>
            </div>
          </article>
          <article className="admin-stat">
            <span className="admin-stat-icon" aria-hidden="true">✅</span>
            <div>
              <p>Available products</p>
              <strong>{availableProducts}</strong>
            </div>
          </article>
          <article className="admin-stat">
            <span className="admin-stat-icon" aria-hidden="true">📋</span>
            <div>
              <p>Pending enquiries</p>
              <strong>{pendingEnquiries}</strong>
            </div>
          </article>
        </section>

        <section className="admin-workflows" aria-label="Admin workflows">
          <article className="admin-workflow-card">
            <div className="admin-workflow-icon" aria-hidden="true">🧰</div>
            <h2>Manage Products</h2>
            <p>Add new scrap materials, update product details, availability and supply quantity.</p>
            <button type="button" onClick={onProducts}>Open product manager →</button>
          </article>
          <article className="admin-workflow-card">
            <div className="admin-workflow-icon" aria-hidden="true">💬</div>
            <h2>Buyer Enquiries</h2>
            <p>Review buyer and order details, then update enquiry status or send a response.</p>
            <button type="button" onClick={onEnquiries}>
              Manage enquiries ({enquiries.length}) →
            </button>
          </article>
        </section>

        <section className="admin-recent">
          <div>
            <p className="admin-eyebrow">INBOX</p>
            <h2>Recent buyer enquiries</h2>
          </div>
          {enquiries.length === 0 ? (
            <p className="admin-empty">Buyer quote requests will appear here.</p>
          ) : (
            <ul>
              {[...enquiries].slice(-3).reverse().map((enquiry) => (
                <li key={enquiry.id}>
                  <div>
                    <strong>{enquiry.product}</strong>
                    <span>{enquiry.buyer?.name || "Buyer"} · {enquiry.quantity}</span>
                  </div>
                  <span className={`admin-status admin-status-${enquiry.status.toLowerCase()}`}>
                    {enquiry.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
