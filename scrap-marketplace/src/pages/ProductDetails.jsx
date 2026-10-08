import "../styles/ProductDetails.css";

function ProductDetails({ product, onBack, onQuote }) {

  if (!product) {
    return (
      <div className="product-details-page">
        <h2>Product not found</h2>

        <button onClick={onBack}>
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-page">

      {/* HEADER */}

      <header className="details-header">

        <div className="details-brand">

          <div className="details-logo">
            EI
          </div>

          <span>
            ExportIndia
          </span>

        </div>

        <button
          className="details-back"
          onClick={onBack}
        >
          ← Back to Products
        </button>

      </header>


      {/* PRODUCT DETAILS */}

      <main className="details-main">

        <div className="details-image">

          <span>
            {product.category === "Copper" && "🟤"}
            {product.category === "Aluminium" && "⚙️"}
            {product.category === "Iron" && "🔩"}
            {product.category === "Steel" && "🏗️"}
          </span>

        </div>


        <div className="details-content">

          <p className="details-category">
            {product.category}
          </p>

          <h1>
            {product.name}
          </h1>

          <p className="details-description">
            {product.description}
          </p>


          {/* SPECIFICATIONS */}

          <div className="specifications">

            <h2>
              Product Specifications
            </h2>


            <div className="specification-row">

              <span>
                Grade
              </span>

              <strong>
                {product.grade}
              </strong>

            </div>


            <div className="specification-row">

              <span>
                Origin
              </span>

              <strong>
                {product.origin}
              </strong>

            </div>


            <div className="specification-row">

              <span>
                Availability
              </span>

              <strong>
                {product.quantity}
              </strong>

            </div>


            <div className="specification-row">

              <span>
                Supply Type
              </span>

              <strong>
                Bulk
              </strong>

            </div>


            <div className="specification-row">

              <span>
                Export Origin
              </span>

              <strong>
                India
              </strong>

            </div>

          </div>


          {/* ACTIONS */}

          <div className="details-actions">

            <button
              className="details-quote"
              onClick={() => onQuote(product)}
            >
              Request Quote
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ProductDetails;