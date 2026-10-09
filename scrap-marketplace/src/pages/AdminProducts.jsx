import { useState } from "react";
import "../styles/AdminProducts.css";

const emptyProduct = {
  name: "",
  category: "Copper",
  grade: "",
  origin: "India",
  description: "",
  quantity: "",
  available: true,
};

function AdminProducts({ products, onBack, onSave, onDelete }) {
  const [formProduct, setFormProduct] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const startNewProduct = () => {
    setFormProduct(emptyProduct);
    setEditingId(null);
    setFormOpen(true);
  };

  const startEditing = (product) => {
    setFormProduct({ ...product, available: product.available !== false });
    setEditingId(product.id);
    setFormOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const product = {
      id: editingId ?? Date.now(),
      name: values.get("name").trim(),
      category: values.get("category"),
      grade: values.get("grade").trim(),
      origin: values.get("origin").trim(),
      description: values.get("description").trim(),
      quantity: values.get("quantity").trim(),
      available: values.get("available") === "on",
    };

    onSave(product);
    setFormOpen(false);
    setEditingId(null);
    setFormProduct(emptyProduct);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Delete ${product.name}? This will remove it from the buyer catalog.`)) {
      onDelete(product.id);
    }
  };

  return (
    <div className="admin-products-page">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-logo">EI</div>
          <span>ExportIndia</span>
        </div>
        <button className="admin-back-button app-back-button" type="button" onClick={onBack}>
          ← Back to Dashboard
        </button>
      </header>

      <main className="admin-products-main">
        <div className="admin-products-heading">
          <div>
            <p className="admin-eyebrow">SELLER CATALOG</p>
            <h1>Manage Products</h1>
            <p>Add, update or remove products shown to buyers.</p>
          </div>
          {!formOpen && (
            <button className="admin-primary-button" type="button" onClick={startNewProduct}>
              + Add Product
            </button>
          )}
        </div>

        {formOpen && (
          <form className="admin-product-form" onSubmit={handleSubmit}>
            <h2>{editingId === null ? "Add a product" : "Edit product"}</h2>
            <div className="admin-product-fields">
              <label>
                Product name
                <input name="name" value={formProduct.name} onChange={(event) => setFormProduct({ ...formProduct, name: event.target.value })} required />
              </label>
              <label>
                Category
                <select name="category" value={formProduct.category} onChange={(event) => setFormProduct({ ...formProduct, category: event.target.value })}>
                  <option value="Copper">Copper</option>
                  <option value="Aluminium">Aluminium</option>
                  <option value="Iron">Iron</option>
                  <option value="Steel">Steel</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                Grade
                <input name="grade" value={formProduct.grade} onChange={(event) => setFormProduct({ ...formProduct, grade: event.target.value })} required />
              </label>
              <label>
                Origin
                <input name="origin" value={formProduct.origin} onChange={(event) => setFormProduct({ ...formProduct, origin: event.target.value })} required />
              </label>
              <label className="admin-field-wide">
                Description
                <textarea name="description" rows="3" value={formProduct.description} onChange={(event) => setFormProduct({ ...formProduct, description: event.target.value })} required />
              </label>
              <label>
                Available quantity / supply note
                <input name="quantity" placeholder="e.g. 50 MT or Available on request" value={formProduct.quantity} onChange={(event) => setFormProduct({ ...formProduct, quantity: event.target.value })} required />
              </label>
              <label className="admin-availability-field">
                <input
                  type="checkbox"
                  name="available"
                  checked={formProduct.available}
                  onChange={(event) => setFormProduct({ ...formProduct, available: event.target.checked })}
                />
                Available for buyer enquiries
              </label>
            </div>
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit">
                {editingId === null ? "Add product" : "Save changes"}
              </button>
              <button className="admin-secondary-button" type="button" onClick={() => setFormOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {products.length === 0 ? (
          <div className="admin-products-empty">
            <h2>No products yet</h2>
            <p>Add your first product to make it visible in the buyer catalog.</p>
            {!formOpen && <button className="admin-primary-button" type="button" onClick={startNewProduct}>Add Product</button>}
          </div>
        ) : (
          <div className="admin-products-list">
            {products.map((product) => (
              <article className="admin-product-row" key={product.id}>
                <div className="admin-product-info">
                  <div className="admin-product-title">
                    <h2>{product.name}</h2>
                    <span className={product.available === false ? "admin-product-tag unavailable" : "admin-product-tag"}>
                      {product.available === false ? "Unavailable" : "Available"}
                    </span>
                  </div>
                  <p>{product.category} · {product.grade} · {product.origin}</p>
                  <p>{product.quantity}</p>
                  <p className="admin-product-description">{product.description}</p>
                </div>
                <div className="admin-product-actions">
                  <button type="button" onClick={() => startEditing(product)}>Edit</button>
                  <button className="admin-delete-button" type="button" onClick={() => handleDelete(product)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminProducts;
