import "../styles/QuoteRequest.css";

function QuoteRequest({ product, onBack, onSubmit  }) {

  const handleSubmit = (event) => {
    event.preventDefault();

      const enquiry = {
    id: Date.now(),
    product: product.name,
    category: product.category,
    quantity: event.target.quantity.value,
    country: event.target.country.value,
    message: event.target.message.value,
    status: "Pending",
  };

  onSubmit(enquiry);
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

        <button onClick={onBack}>
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

          <p>
            Send us your requirement and we will
            get back to you with pricing and availability.
          </p>

        </div>


        <form
          className="quote-form"
          onSubmit={handleSubmit}
        >

          <div className="quote-form-group">

            <label>
              Quantity Required
            </label>

            <input
              type="text"
              name="quantity"
              placeholder="Example: 20 MT"
              required
            />

          </div>


          <div className="quote-form-group">

            <label>
              Destination Country
            </label>

            <input
              type="text"
              name="country"
              placeholder="Enter country"
              required
            />

          </div>


          <div className="quote-form-group">

            <label>
              Message
            </label>

            <textarea
              name="message"
              rows="5"
              placeholder="Tell us about your requirement..."
              required
            />

          </div>


          <button
            type="submit"
            className="submit-quote"
          >
            Submit Quote Request
          </button>

        </form>

      </main>

    </div>
  );
}

export default QuoteRequest;