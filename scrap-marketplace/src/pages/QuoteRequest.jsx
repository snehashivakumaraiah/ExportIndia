import "../styles/QuoteRequest.css";

function QuoteRequest({ product, onBack, onSubmit  }) {

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const enquiry = {
      id: Date.now(),
      productId: product.id,
      product: product.name,
      category: product.category,
      quantity: formData.get("quantity").trim(),
      country: formData.get("country").trim(),
      message: formData.get("message").trim(),
      buyer: {
        name: formData.get("buyerName").trim(),
        company: formData.get("company").trim(),
        email: formData.get("email").trim(),
        phone: formData.get("phone").trim(),
      },
      status: "Pending",
      response: "",
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
            <label htmlFor="buyer-name">Your Name</label>
            <input
              id="buyer-name"
              type="text"
              name="buyerName"
              autoComplete="name"
              required
            />
          </div>

          <div className="quote-form-group">
            <label htmlFor="buyer-company">Company Name</label>
            <input
              id="buyer-company"
              type="text"
              name="company"
              autoComplete="organization"
              required
            />
          </div>

          <div className="quote-form-group">
            <label htmlFor="buyer-email">Email Address</label>
            <input
              id="buyer-email"
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="quote-form-group">
            <label htmlFor="buyer-phone">Phone Number</label>
            <input
              id="buyer-phone"
              type="tel"
              name="phone"
              autoComplete="tel"
              required
            />
          </div>

          <div className="quote-form-group">

            <label htmlFor="quote-quantity">
              Quantity Required
            </label>

            <input
              id="quote-quantity"
              type="text"
              name="quantity"
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