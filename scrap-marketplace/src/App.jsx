import { useCallback, useEffect, useState } from "react";

import { api, setAccessToken } from "./api";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEnquiries from "./pages/AdminEnquiries";
import AdminProducts from "./pages/AdminProducts";
import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerLogin from "./pages/BuyerLogin";
import BuyerProfile from "./pages/BuyerProfile";
import BuyerRegister from "./pages/BuyerRegister";
import Enquiries from "./pages/Enquiries";
import Home from "./pages/home";
import Login from "./pages/login";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import QuoteRequest from "./pages/QuoteRequest";
import SavedProducts from "./pages/SavedProducts";

function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [postLoginAction, setPostLoginAction] = useState(null);
  const [user, setUser] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [canRetry, setCanRetry] = useState(false);

  const loadPrivateData = useCallback(async (role) => {
    const results = await Promise.allSettled([
      api.getEnquiries(),
      role === "buyer" ? api.getSavedProducts() : Promise.resolve([]),
    ]);
    const errors = [];
    if (results[0].status === "fulfilled") {
      setEnquiries(results[0].value);
    } else {
      errors.push(`enquiries: ${results[0].reason.message}`);
    }
    if (results[1].status === "fulfilled") {
      setSavedProducts(results[1].value);
    } else {
      errors.push(`saved products: ${results[1].reason.message}`);
    }
    if (errors.length) {
      setApiError(`Could not load account data (${errors.join("; ")})`);
      setCanRetry(true);
    }
  }, []);

  const reloadData = useCallback(async () => {
    setLoading(true);
    setApiError("");
    setCanRetry(false);
    const results = await Promise.allSettled([
      api.getProducts(),
      user ? api.getCurrentUser() : Promise.resolve(null),
    ]);
    if (results[0].status === "fulfilled") {
      setProducts(results[0].value);
    } else {
      setApiError(`Could not load products: ${results[0].reason.message}`);
      setCanRetry(true);
    }
    if (user && results[1].status === "fulfilled") {
      await loadPrivateData(user.role);
    } else if (user && results[1].status === "rejected") {
      setApiError(`Could not validate your session: ${results[1].reason.message}`);
      setCanRetry(true);
    }
    setLoading(false);
  }, [loadPrivateData, user]);

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      const productRequest = api.getProducts();
      const token = sessionStorage.getItem("accessToken");
      const userRequest = token ? api.getCurrentUser() : Promise.resolve(null);
      const [productResult, userResult] = await Promise.allSettled([
        productRequest,
        userRequest,
      ]);

      if (!active) {
        return;
      }

      if (productResult.status === "fulfilled") {
        setProducts(productResult.value);
      } else {
        setApiError(`Could not load products: ${productResult.reason.message}`);
        setCanRetry(true);
      }

      if (userResult.status === "fulfilled" && userResult.value) {
        setUser(userResult.value);
        const [enquiryResult, savedResult] = await Promise.allSettled([
          api.getEnquiries(),
          userResult.value.role === "buyer" ? api.getSavedProducts() : Promise.resolve([]),
        ]);
        if (active) {
          if (enquiryResult.status === "fulfilled") {
            setEnquiries(enquiryResult.value);
          } else {
            setApiError(`Could not load enquiries: ${enquiryResult.reason.message}`);
            setCanRetry(true);
          }
          if (savedResult.status === "fulfilled") {
            setSavedProducts(savedResult.value);
          } else {
            setApiError(`Could not load saved products: ${savedResult.reason.message}`);
            setCanRetry(true);
          }
        }
      } else if (userResult.status === "rejected") {
        setAccessToken(null);
        setApiError(`Your saved session is no longer valid: ${userResult.reason.message}`);
        setCanRetry(false);
      }
      if (active) {
        setLoading(false);
      }
    };

    loadInitialData();
    return () => {
      active = false;
    };
  }, []);

  const finishBuyerLogin = async (authResult) => {
    setAccessToken(authResult.access_token);
    setUser(authResult.user);
    setApiError("");
    setCanRetry(false);
    setCanRetry(false);
    await loadPrivateData("buyer");
    if (postLoginAction === "quote") {
      setPage("quote-request");
    } else if (postLoginAction === "save" && selectedProduct) {
      try {
        await api.saveProduct(selectedProduct.id);
        setSavedProducts((previous) =>
          previous.some((product) => product.id === selectedProduct.id)
            ? previous
            : [...previous, selectedProduct]
        );
        setPage("products");
      } catch (error) {
        setApiError(`Could not save product: ${error.message}`);
        setPage("products");
      }
    } else {
      setPage("buyer-dashboard");
    }
    setPostLoginAction(null);
  };

  const handleAdminLogin = async (credentials) => {
    try {
      const authResult = await api.adminLogin(credentials);
      setAccessToken(authResult.access_token);
      setUser(authResult.user);
      setApiError("");
      setCanRetry(false);
      await loadPrivateData("admin");
      setPage("admin-dashboard");
      return true;
    } catch (error) {
      setApiError(`Admin login failed: ${error.message}`);
      setCanRetry(false);
      return false;
    }
  };

  const handleBuyerLogin = async (credentials) => {
    try {
      await finishBuyerLogin(await api.buyerLogin(credentials));
      return true;
    } catch (error) {
      setApiError(`Buyer login failed: ${error.message}`);
      setCanRetry(false);
      return false;
    }
  };

  const handleBuyerRegistration = async (registration) => {
    try {
      await finishBuyerLogin(await api.registerBuyer(registration));
      return true;
    } catch (error) {
      setApiError(`Could not create buyer account: ${error.message}`);
      setCanRetry(false);
      return false;
    }
  };

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
    setEnquiries([]);
    setSavedProducts([]);
    setPage("home");
    setPostLoginAction(null);
    setApiError("");
    setCanRetry(false);
  };

  const handleSaveProduct = async (product) => {
    if (user?.role !== "buyer") {
      setSelectedProduct(product);
      setPostLoginAction("save");
      setPage("buyer-login");
      return;
    }
    setApiError("");
    setCanRetry(false);
    try {
      await api.saveProduct(product.id);
      setSavedProducts((previous) =>
        previous.some((item) => item.id === product.id)
          ? previous
          : [...previous, product]
      );
    } catch (error) {
      setApiError(`Could not save product: ${error.message}`);
      setCanRetry(false);
    }
  };

  const handleUnsaveProduct = async (productId) => {
    setApiError("");
    setCanRetry(false);
    try {
      await api.unsaveProduct(productId);
      setSavedProducts((previous) =>
        previous.filter((product) => product.id !== productId)
      );
    } catch (error) {
      setApiError(`Could not remove saved product: ${error.message}`);
    }
  };

  const handleSaveProductDetails = async (product) => {
    setApiError("");
    try {
      const savedProduct = product.id
        ? await api.updateProduct(product.id, product)
        : await api.createProduct(product);
      setProducts((previous) => {
        const exists = previous.some((item) => item.id === savedProduct.id);
        return exists
          ? previous.map((item) => item.id === savedProduct.id ? savedProduct : item)
          : [savedProduct, ...previous];
      });
      setSavedProducts((previous) =>
        previous.map((item) => item.id === savedProduct.id ? savedProduct : item)
      );
      return true;
    } catch (error) {
      setApiError(`Could not save product: ${error.message}`);
      setCanRetry(false);
      return false;
    }
  };

  const handleDeleteProduct = async (productId) => {
    setApiError("");
    setCanRetry(false);
    try {
      await api.deleteProduct(productId);
      setProducts((previous) =>
        previous.filter((product) => product.id !== productId)
      );
      setSavedProducts((previous) =>
        previous.filter((product) => product.id !== productId)
      );
      return true;
    } catch (error) {
      setApiError(`Could not delete product: ${error.message}`);
      setCanRetry(false);
      return false;
    }
  };

  const handleSubmitEnquiry = async (enquiry) => {
    setApiError("");
    setCanRetry(false);
    try {
      const savedEnquiry = await api.createEnquiry(enquiry);
      setEnquiries((previous) => [...previous, savedEnquiry]);
      setPage("buyer-dashboard");
      return true;
    } catch (error) {
      setApiError(`Could not submit quote request: ${error.message}`);
      setCanRetry(false);
      return false;
    }
  };

  const handleUpdateEnquiry = async (updatedEnquiry) => {
    setApiError("");
    setCanRetry(false);
    try {
      const savedEnquiry = await api.updateEnquiry(
        updatedEnquiry.id,
        { status: updatedEnquiry.status, response: updatedEnquiry.response }
      );
      setEnquiries((previous) =>
        previous.map((enquiry) =>
          enquiry.id === savedEnquiry.id ? savedEnquiry : enquiry
        )
      );
      return true;
    } catch (error) {
      setApiError(`Could not update enquiry: ${error.message}`);
      setCanRetry(false);
      return false;
    }
  };

  const openQuote = (product) => {
    setSelectedProduct(product);
    if (user?.role === "buyer") {
      setPage("quote-request");
    } else {
      setPostLoginAction("quote");
      setPage("buyer-login");
    }
  };

  return (
    <>
      {(loading || apiError) && (
        <div
          className={apiError ? "api-notice api-notice-error" : "api-notice"}
          role={apiError ? "alert" : "status"}
        >
          {apiError || "Connecting to the marketplace API..."}
          {apiError && canRetry && (
            <button type="button" onClick={reloadData} disabled={loading}>
              {loading ? "Retrying..." : "Retry"}
            </button>
          )}
        </div>
      )}

      {page === "home" && (
        <Home
          products={products}
          loading={loading}
          onProducts={() => setPage("products")}
          onQuote={openQuote}
          onLogin={() => setPage("admin-login")}
          onBuyerLogin={() => setPage("buyer-login")}
        />
      )}

      {page === "admin-login" && (
        <Login
          onBack={() => setPage("home")}
          onLogin={handleAdminLogin}
        />
      )}

      {user?.role === "admin" && page === "admin-dashboard" && (
        <AdminDashboard
          products={products}
          enquiries={enquiries}
          onLogout={handleLogout}
          onProducts={() => setPage("admin-products")}
          onEnquiries={() => setPage("admin-enquiries")}
        />
      )}

      {user?.role === "admin" && page === "admin-products" && (
        <AdminProducts
          products={products}
          loading={loading}
          onBack={() => setPage("admin-dashboard")}
          onSave={handleSaveProductDetails}
          onDelete={handleDeleteProduct}
        />
      )}

      {user?.role === "admin" && page === "admin-enquiries" && (
        <AdminEnquiries
          enquiries={enquiries}
          onBack={() => setPage("admin-dashboard")}
          onUpdate={handleUpdateEnquiry}
        />
      )}

      {page === "buyer-login" && (
        <BuyerLogin
          onBack={() => setPage("home")}
          onRegister={() => setPage("buyer-register")}
          onLogin={handleBuyerLogin}
        />
      )}

      {page === "buyer-register" && (
        <BuyerRegister
          onBack={() => setPage("home")}
          onLogin={() => setPage("buyer-login")}
          onRegister={handleBuyerRegistration}
        />
      )}

      {user?.role === "buyer" && page === "buyer-dashboard" && (
        <BuyerDashboard
          user={user}
          products={products}
          enquiries={enquiries}
          onLogout={handleLogout}
          onProducts={() => setPage("products")}
          onEnquiries={() => setPage("enquiries")}
          onProfile={() => setPage("buyer-profile")}
          onSavedProducts={() => setPage("saved-products")}
        />
      )}

      {page === "products" && (
        <Products
          products={products}
          loading={loading}
          onBack={() => setPage(user?.role === "buyer" ? "buyer-dashboard" : "home")}
          onSave={handleSaveProduct}
          onDetails={(product) => {
            setSelectedProduct(product);
            setPage("product-details");
          }}
          onQuote={openQuote}
        />
      )}

      {page === "product-details" && (
        <ProductDetails
          product={selectedProduct}
          onBack={() => setPage("products")}
          onQuote={openQuote}
        />
      )}

      {user?.role === "buyer" && page === "quote-request" && selectedProduct && (
        <QuoteRequest
          product={selectedProduct}
          buyer={user}
          onBack={() => setPage("products")}
          onSubmit={handleSubmitEnquiry}
        />
      )}

      {user?.role === "buyer" && page === "enquiries" && (
        <Enquiries
          enquiries={enquiries}
          onBack={() => setPage("buyer-dashboard")}
        />
      )}

      {user?.role === "buyer" && page === "buyer-profile" && (
        <BuyerProfile
          profile={user}
          onBack={() => setPage("buyer-dashboard")}
          onSave={async (profile) => {
            setApiError("");
                setCanRetry(false);
            try {
              const updatedUser = await api.updateProfile(profile);
              setUser(updatedUser);
              return true;
            } catch (error) {
              setApiError(`Could not save profile: ${error.message}`);
              return false;
            }
          }}
        />
      )}

      {user?.role === "buyer" && page === "saved-products" && (
        <SavedProducts
          savedProducts={savedProducts}
          onBack={() => setPage("buyer-dashboard")}
          onUnsave={handleUnsaveProduct}
        />
      )}
    </>
  );
}

export default App;
