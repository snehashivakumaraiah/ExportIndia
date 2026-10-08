import "../styles/Enquiries.css";

function Enquiries({ enquiries, onBack }) {
  return (
    <div className="enquiries-page">

      <header className="enquiries-header">

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


      <main className="enquiries-main">

        <p className="dashboard-label">
          BUYER ACCOUNT
        </p>

        <h1>
          My Enquiries
        </h1>

        <p className="enquiries-subtitle">
          Track the quote requests you have submitted.
        </p>


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

              <div
                className="enquiry-item"
                key={enquiry.id}
              >

                <div>

                  <h2>
                    {enquiry.product}
                  </h2>

                  <p>
                    Category: {enquiry.category}
                  </p>

                  <p>
                    Quantity: {enquiry.quantity}
                  </p>

                  <p>
                    Destination: {enquiry.country}
                  </p>

                  <p>
                    Message: {enquiry.message}
                  </p>

                </div>

                <span className="enquiry-status">
                  {enquiry.status}
                </span>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Enquiries;