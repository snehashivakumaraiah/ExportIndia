import "../styles/SavedProducts.css";

function SavedProducts({ savedProducts, onBack }) {

  return (
    <div className="saved-products-page">

      <header className="saved-products-header">

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


      <main className="saved-products-main">

        <p className="dashboard-label">
          BUYER ACCOUNT
        </p>

        <h1>
          Saved Products
        </h1>

        <p className="saved-products-subtitle">
          Products you have saved for later.
        </p>


        {savedProducts.length === 0 ? (

          <div className="empty-saved-products">

            <div className="empty-icon">
              ⭐
            </div>

            <h3>
              No saved products
            </h3>

            <p>
              Products you save will appear here.
            </p>

          </div>

        ) : (

          <div className="saved-products-list">

            {savedProducts.map((product) => (

              <div
                className="saved-product-item"
                key={product.id}
              >

                <div>

                  <h2>
                    {product.name}
                  </h2>

                  <p>
                    Category: {product.category}
                  </p>

                  <p>
                    Price: {product.price}
                  </p>

                  <p>
                    Location: {product.location}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default SavedProducts;