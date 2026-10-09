import "../styles/QuoteRequest.css";
import { useState } from "react";

function QuoteRequest({ product, buyer, onBack, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const enquiry = {
      product_id: product.id,
      quantity: formData.get("quantity").trim(),
      country: formData.get("country").trim(),
      message: formData.get("message").trim(),
      buyer: {
        name: formData.get("buyerName").trim(),
        company: formData.get("company").trim(),
        email: formData.get("email").trim(),
        phone: formData.get("phone").trim(),
      },
    };

    setSubmitting(true);
    await onSubmit(enquiry);
    setSubmitting(false);
  };

  return (
    <div className="quote-page">

      <header className="quote-header">

        <div className="quote-brand">

          <div className="quote-logo">
            EI
          </div>

          <span>
            ExportIndia
          </span>

        </div>

        <button className="app-back-button" onClick={onBack}>
          ← Back to Products
        </button>

      </header>


      <main className="quote-main">

        <div className="quote-intro">

          <p className="quote-label">
            REQUEST A QUOTE
          </p>

          <h1>
            {product ? product.name : "Product"}
          </h1>

          <p>Submitting as {buyer.name} ({buyer.email})</p>

        </div>


        <form
          className="quote-form"
          onSubmit={handleSubmit}
        >
          <div className="quote-form-group">

            <label htmlFor="quote-quantity">
              Quantity Required
            </label>

            <input
              id="quote-quantity"
              type="text"
              name="quantity"
              maxLength="100"
              placeholder="Example: 20 MT"
              required
            />

          </div>


          <div className="quote-form-group">

            <label htmlFor="quote-country">
              Destination Country
            </label>

            <input
              id="quote-country"
              type="text"
              name="country"
              maxLength="100"
              placeholder="Enter country"
              required
            />

          </div>


          <div className="quote-form-group">

            <label htmlFor="quote-message">
              Message
            </label>

            <textarea
              id="quote-message"
              name="message"
              rows="5"
              maxLength="5000"
              placeholder="Tell us about your requirement..."
              required
            />

          </div>


          <button
            type="submit"
            className="submit-quote"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Quote Request"}
          </button>

        </form>

      </main>

    </div>
  );
}

export default QuoteRequest;