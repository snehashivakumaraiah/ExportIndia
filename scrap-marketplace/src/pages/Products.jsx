import "../styles/Products.css";

import { useState } from "react";

function Products({ products, loading, onBack, onQuote, onDetails, onSave }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const visibleProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category} ${product.grade}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    return matchesSearch && (!category || product.category === category);
  });

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
          className="app-back-button"
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
            aria-label="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >

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

            <option value="Other">
              Other
            </option>

          </select>

        </div>


        {/* PRODUCTS */}

        <div className="products-grid">

          {loading && <p role="status">Loading products...</p>}

          {visibleProducts.map((product) => (

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
                  {product.category === "Other" && "♻️"}
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

                {!product.available && (
                  <p className="product-unavailable">
                    Currently unavailable
                  </p>
                )}

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

                  <div>
                    <span>Price (INR)</span>
                    <strong>{product.price === null || product.price === undefined ? "On request" : `₹${product.price}`}</strong>
                  </div>

                </div>


                <div className="product-actions">

                  <button className="view-product" onClick={() => onDetails(product)}>
                    View Details
                  </button>

                  <button
                    className="quote-product"
                    onClick={() => onQuote(product)}
                    disabled={product.available === false}
                  >
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
        {!loading && visibleProducts.length === 0 && (
          <p className="products-empty">
            No products match your search.
          </p>
        )}

      </main>

    </div>
  );
}

export default Products;