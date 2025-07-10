import api from "./axios.js";

// Standard auth functions
export function login({ email, password }) {
  return api.post("/users/login", { email, password });
}

export function register(formData) {
  return api.post("/users/register", formData);
}

export function fetchCurrent() {
  return api.get("/users/current-user");
}

export function logout() {
  return api.post("/users/logout");
}

// OAuth functions
export function initiateGoogleAuth() {
  // Redirect to backend Google OAuth endpoint
  window.location.href = `${api.defaults.baseURL}/users/auth/google`;
}

export function refreshToken() {
  return api.post("/users/refresh-token");
}
