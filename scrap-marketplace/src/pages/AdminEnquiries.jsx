import { useState } from "react";
import "../styles/AdminEnquiries.css";

const enquiryStatuses = ["Pending", "Responded", "Closed"];

function AdminEnquiryCard({ enquiry, onUpdate }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [status, setStatus] = useState(enquiry.status);
  const [response, setResponse] = useState(enquiry.response || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    await onUpdate({ ...enquiry, status, response: response.trim() });
    setSaving(false);
  };

  return (
    <article className="admin-enquiry-card">
      <div className="admin-enquiry-summary">
        <div>
          <p className="admin-enquiry-buyer">{enquiry.buyer?.name || "Buyer"}</p>
          <h2>{enquiry.product}</h2>
          <p>{enquiry.category} · Requested {enquiry.quantity}</p>
          <p>Destination: {enquiry.country}</p>
        </div>
        <div className="admin-enquiry-summary-actions">
          <span className={`admin-status admin-status-${enquiry.status.toLowerCase()}`}>
            {enquiry.status}
          </span>
          <button
            type="button"
            aria-expanded={detailsOpen}
            onClick={() => setDetailsOpen(!detailsOpen)}
          >
            {detailsOpen ? "Hide details" : "View enquiry"}
          </button>
        </div>
      </div>

      {detailsOpen && (
        <div className="admin-enquiry-details">
          <section>
            <h3>Buyer details</h3>
            <dl>
              <div><dt>Name</dt><dd>{enquiry.buyer?.name || "Not provided"}</dd></div>
              <div><dt>Company</dt><dd>{enquiry.buyer?.company || "Not provided"}</dd></div>
              <div><dt>Email</dt><dd>{enquiry.buyer?.email || "Not provided"}</dd></div>
              <div><dt>Phone</dt><dd>{enquiry.buyer?.phone || "Not provided"}</dd></div>
            </dl>
          </section>
          <section>
            <h3>Request details</h3>
            <dl>
              <div><dt>Product</dt><dd>{enquiry.product}</dd></div>
              <div><dt>Quantity</dt><dd>{enquiry.quantity}</dd></div>
              <div><dt>Destination country</dt><dd>{enquiry.country}</dd></div>
            </dl>
            <p className="admin-enquiry-message">{enquiry.message}</p>
          </section>
        </div>
      )}

      <form className="admin-enquiry-update" onSubmit={handleSubmit}>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {enquiryStatuses.map((enquiryStatus) => (
              <option key={enquiryStatus} value={enquiryStatus}>{enquiryStatus}</option>
            ))}
          </select>
        </label>
        <label className="admin-response-field">
          Response to buyer
          <textarea
            rows="2"
            value={response}
            required={status === "Responded"}
            onChange={(event) => setResponse(event.target.value)}
            placeholder="Add a response or update for the buyer"
          />
        </label>
        <button className="admin-primary-button" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save update"}
        </button>
      </form>
    </article>
  );
}

function AdminEnquiries({ enquiries, onBack, onUpdate }) {
  return (
    <div className="admin-enquiries-page">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-logo">EI</div>
          <span>ExportIndia</span>
        </div>
        <button className="admin-back-button app-back-button" type="button" onClick={onBack}>
          ← Back to Dashboard
        </button>
      </header>

      <main className="admin-enquiries-main">
        <p className="admin-eyebrow">BUYER INBOX</p>
        <h1>Manage Enquiries</h1>
        <p className="admin-enquiries-subtitle">
          Review quote requests and keep buyers updated on their status.
        </p>

        {enquiries.length === 0 ? (
          <div className="admin-enquiries-empty">
            <span aria-hidden="true">📋</span>
            <h2>No buyer enquiries yet</h2>
            <p>New quote requests will appear in this inbox.</p>
          </div>
        ) : (
          <div className="admin-enquiries-list">
            {[...enquiries].reverse().map((enquiry) => (
              <AdminEnquiryCard
                key={enquiry.id}
                enquiry={enquiry}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminEnquiries;
