const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000")
  .replace(/\/+$/, "");

let accessToken = sessionStorage.getItem("accessToken");

export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    sessionStorage.setItem("accessToken", token);
  } else {
    sessionStorage.removeItem("accessToken");
  }
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  if (options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(`Cannot reach the API at ${API_BASE_URL}: ${error.message}`);
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body.detail === "string") {
        detail = body.detail;
      } else if (body.detail) {
        detail = JSON.stringify(body.detail);
      }
    } catch {
      // Keep the HTTP status as the error when the response has no JSON body.
    }
    throw new Error(detail);
  }

  return response.status === 204 ? null : response.json();
}

const post = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body) });

export const api = {
  adminLogin: (credentials) => post("/auth/admin/login", credentials),
  buyerLogin: (credentials) => post("/auth/login", credentials),
  registerBuyer: (registration) => post("/auth/register", registration),
  getCurrentUser: () => request("/auth/me"),
  updateProfile: (profile) =>
    request("/auth/me", { method: "PUT", body: JSON.stringify(profile) }),
  getProducts: () => request("/products"),
  createProduct: (product) => post("/products", product),
  updateProduct: (productId, product) =>
    request(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),
  deleteProduct: (productId) =>
    request(`/products/${productId}`, { method: "DELETE" }),
  getEnquiries: () => request("/enquiries"),
  createEnquiry: (enquiry) => post("/enquiries", enquiry),
  updateEnquiry: (enquiryId, enquiry) =>
    request(`/enquiries/${enquiryId}`, {
      method: "PATCH",
      body: JSON.stringify(enquiry),
    }),
  getSavedProducts: () => request("/buyers/me/saved-products"),
  saveProduct: (productId) =>
    request(`/buyers/me/saved-products/${productId}`, { method: "PUT" }),
  unsaveProduct: (productId) =>
    request(`/buyers/me/saved-products/${productId}`, { method: "DELETE" }),
};
