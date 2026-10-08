import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import BuyerLogin from "./pages/BuyerLogin";
import BuyerRegister from "./pages/BuyerRegister";
import BuyerDashboard from "./pages/BuyerDashboard";
import Products from "./pages/Products";
import QuoteRequest from "./pages/QuoteRequest";
import ProductDetails from "./pages/ProductDetails";

function App() {

  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [enquiries, setEnquiries] = useState([]);

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
          enquiries={enquiries}
        />
      )}


      {/* PRODUCTS */}

      {page === "products" && (
        <Products
          onBack={() => setPage("buyer-dashboard")}
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

    </>
  );
}

export default App;