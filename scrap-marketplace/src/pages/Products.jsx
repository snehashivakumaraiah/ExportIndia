import "../styles/Products.css";

function Products({ onBack, onQuote, onDetails, onSave  }) {

  const products = [
    {
      id: 1,
      name: "Copper Scrap",
      category: "Copper",
      grade: "Millberry",
      origin: "India",
      description:
        "High-quality copper scrap suitable for recycling and industrial applications.",
      quantity: "Available on request"
    },
    {
      id: 2,
      name: "Aluminium Scrap",
      category: "Aluminium",
      grade: "Tense",
      origin: "India",
      description:
        "Aluminium scrap suitable for recycling and manufacturing requirements.",
      quantity: "Available on request"
    },
    {
      id: 3,
      name: "Iron Scrap",
      category: "Iron",
      grade: "Heavy Melting Scrap",
      origin: "India",
      description:
        "Ferrous scrap suitable for steel mills and industrial recycling.",
      quantity: "Available on request"
    },
    {
      id: 4,
      name: "Steel Scrap",
      category: "Steel",
      grade: "HMS",
      origin: "India",
      description:
        "Quality steel scrap available for bulk industrial requirements.",
      quantity: "Available on request"
    }
  ];

  return (
    <div className="products-page">

      {/* HEADER */}

      <header className="products-header">

        <div className="products-brand">

          <div className="products-logo">
            EI
          </div>

          <span>
            ExportIndia
          </span>

        </div>


        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

      </header>


      {/* PAGE INTRO */}

      <main className="products-main">

        <div className="products-intro">

          <p className="products-label">
            EXPORTINDIA
          </p>

          <h1>
            Our Products
          </h1>

          <p>
            Explore our range of quality scrap materials
            available for domestic and international supply.
          </p>

        </div>


        {/* SEARCH */}

        <div className="products-tools">

          <input
            type="text"
            placeholder="Search products..."
          />

          <select>

            <option value="">
              All Categories
            </option>

            <option value="Copper">
              Copper
            </option>

            <option value="Aluminium">
              Aluminium
            </option>

            <option value="Iron">
              Iron
            </option>

            <option value="Steel">
              Steel
            </option>

          </select>

        </div>


        {/* PRODUCTS */}

        <div className="products-grid">

          {products.map((product) => (

            <div
              className="product-item"
              key={product.id}
            >

              <div className="product-image-placeholder">

                <span>
                  {product.category === "Copper" && "🟤"}
                  {product.category === "Aluminium" && "⚙️"}
                  {product.category === "Iron" && "🔩"}
                  {product.category === "Steel" && "🏗️"}
                </span>

              </div>


              <div className="product-content">

                <p className="product-category">
                  {product.category}
                </p>

                <h2>
                  {product.name}
                </h2>

                <p className="product-description">
                  {product.description}
                </p>


                <div className="product-details">

                  <div>
                    <span>Grade</span>
                    <strong>{product.grade}</strong>
                  </div>

                  <div>
                    <span>Origin</span>
                    <strong>{product.origin}</strong>
                  </div>

                  <div>
                    <span>Quantity</span>
                    <strong>{product.quantity}</strong>
                  </div>

                </div>


                <div className="product-actions">

                  <button className="view-product" onClick={() => onDetails(product)}>
                    View Details
                  </button>

                  <button className="quote-product" onClick={() => onQuote(product)}>
                    Request Quote
                  </button>

                  <button className="save-product" onClick={() => onSave(product)}>
                    ⭐ Save
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}

export default Products;