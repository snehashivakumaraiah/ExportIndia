import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import BuyerLogin from "./pages/BuyerLogin";
import BuyerRegister from "./pages/BuyerRegister";
import BuyerDashboard from "./pages/BuyerDashboard";
import Products from "./pages/Products";
import QuoteRequest from "./pages/QuoteRequest";
import ProductDetails from "./pages/ProductDetails";
import Enquiries from "./pages/Enquiries";
import BuyerProfile from "./pages/BuyerProfile";
import SavedProducts from "./pages/SavedProducts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminEnquiries from "./pages/AdminEnquiries";

const initialProducts = [
  {
    id: 1,
    name: "Copper Scrap",
    category: "Copper",
    grade: "Millberry",
    origin: "India",
    description:
      "High-quality copper scrap suitable for recycling and industrial applications.",
    quantity: "Available on request",
    available: true,
  },
  {
    id: 2,
    name: "Aluminium Scrap",
    category: "Aluminium",
    grade: "Tense",
    origin: "India",
    description:
      "Aluminium scrap suitable for recycling and manufacturing requirements.",
    quantity: "Available on request",
    available: true,
  },
  {
    id: 3,
    name: "Iron Scrap",
    category: "Iron",
    grade: "Heavy Melting Scrap",
    origin: "India",
    description:
      "Ferrous scrap suitable for steel mills and industrial recycling.",
    quantity: "Available on request",
    available: true,
  },
  {
    id: 4,
    name: "Steel Scrap",
    category: "Steel",
    grade: "HMS",
    origin: "India",
    description:
      "Quality steel scrap available for bulk industrial requirements.",
    quantity: "Available on request",
    available: true,
  },
];

function App() {

  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [products, setProducts] = useState(initialProducts);

  const handleSaveProduct = (product) => {
    setSavedProducts((previous) => {
      const alreadySaved = previous.some(
        (item) => item.id === product.id
      );

      if (alreadySaved) {
        return previous;
      }

      return [...previous, product];
    });
  };

  const handleSaveProductDetails = (product) => {
    setProducts((previous) => {
      const exists = previous.some((item) => item.id === product.id);

      if (!exists) {
        return [...previous, product];
      }

      return previous.map((item) =>
        item.id === product.id ? product : item
      );
    });
    setSavedProducts((previous) =>
      previous.map((item) => item.id === product.id ? product : item)
    );
  };

  const handleDeleteProduct = (productId) => {
    setProducts((previous) =>
      previous.filter((product) => product.id !== productId)
    );
    setSavedProducts((previous) =>
      previous.filter((product) => product.id !== productId)
    );
  };

  const handleUpdateEnquiry = (updatedEnquiry) => {
    setEnquiries((previous) =>
      previous.map((enquiry) =>
        enquiry.id === updatedEnquiry.id ? updatedEnquiry : enquiry
      )
    );
  };

  return (
    <>

      {/* HOME */}

      {page === "home" && (
        <Home
          onLogin={() => setPage("admin-login")}
          onBuyerLogin={() => setPage("buyer-login")}
        />
      )}


      {/* ADMIN LOGIN */}

      {page === "admin-login" && (
        <Login
          onBack={() => setPage("home")}
          onLogin={() => setPage("admin-dashboard")}
        />
      )}

      {page === "admin-dashboard" && (
        <AdminDashboard
          products={products}
          enquiries={enquiries}
          onLogout={() => setPage("home")}
          onProducts={() => setPage("admin-products")}
          onEnquiries={() => setPage("admin-enquiries")}
        />
      )}

      {page === "admin-products" && (
        <AdminProducts
          products={products}
          onBack={() => setPage("admin-dashboard")}
          onSave={handleSaveProductDetails}
          onDelete={handleDeleteProduct}
        />
      )}

      {page === "admin-enquiries" && (
        <AdminEnquiries
          enquiries={enquiries}
          onBack={() => setPage("admin-dashboard")}
          onUpdate={handleUpdateEnquiry}
        />
      )}


      {/* BUYER LOGIN */}

      {page === "buyer-login" && (
        <BuyerLogin
          onBack={() => setPage("home")}
          onRegister={() => setPage("buyer-register")}
          onLogin={() => setPage("buyer-dashboard")}
        />
      )}


      {/* BUYER REGISTER */}

      {page === "buyer-register" && (
        <BuyerRegister
          onBack={() => setPage("home")}
          onLogin={() => setPage("buyer-login")}
        />
      )}


      {/* BUYER DASHBOARD */}

      {page === "buyer-dashboard" && (
        <BuyerDashboard
          onLogout={() => setPage("home")}
          onProducts={() => setPage("products")}
          onEnquiries={() => setPage("enquiries")}
          onProfile={() => setPage("buyer-profile")}
          onSavedProducts={() => setPage("saved-products")}
          enquiries={enquiries}
        />
      )}


      {/* PRODUCTS */}

      {page === "products" && (
        <Products
          products={products}
          onBack={() => setPage("buyer-dashboard")}
          onSave={handleSaveProduct}
          onDetails={(product) => {
          setSelectedProduct(product);
          setPage("product-details");
          }}

          onQuote={(product) => {
            setSelectedProduct(product);
            setPage("quote-request");
          }}
        />
      )}
      {page === "product-details" && (
        <ProductDetails
        product={selectedProduct}
        onBack={() => setPage("products")}
        onQuote={(product) => {
        setSelectedProduct(product);
        setPage("quote-request");
        }}
       />
       )}


      {/* REQUEST QUOTE */}

      {page === "quote-request" && (
        <QuoteRequest
          product={selectedProduct}
          onBack={() => setPage("products")}
          onSubmit={(enquiry) => {
            setEnquiries((previous) => [...previous, enquiry]);
            setPage("buyer-dashboard");
          }}
        />
      )}

      {/* ENQUIRIES */}

      {page === "enquiries" && (
        <Enquiries
        enquiries={enquiries}
        onBack={() => setPage("buyer-dashboard")}
      />
    )}
    {/* BUYER PROFILE */}

      {page === "buyer-profile" && (
        <BuyerProfile
        onBack={() => setPage("buyer-dashboard")}
        />
      )}
    {/* SAVED PRODUCTS */}

      {page === "saved-products" && (
        <SavedProducts
        savedProducts={savedProducts}
        onBack={() => setPage("buyer-dashboard")}
        />
      )}
    </>
  );
}

export default App;