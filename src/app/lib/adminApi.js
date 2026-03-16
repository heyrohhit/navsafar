// src/app/lib/adminApi.js
// ─────────────────────────────────────────────────────────────────
// Helper functions for Admin Panel to call protected API routes
// Token stored in sessionStorage after login
// ─────────────────────────────────────────────────────────────────

const BASE = "/api/admin";

function getToken() {
  return sessionStorage.getItem("ns_admin_token") || "";
}

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ── Packages CRUD ─────────────────────────────────────────────────

export const adminApi = {
  // Verify token (login)
  async login(password) {
    // Simple: store token if password matches (token set by server env)
    // In production you'd call a login API route that returns JWT
    // For this app: password = ADMIN_SECRET_TOKEN (you already know it)
    sessionStorage.setItem("ns_admin_token", password);
    const res = await fetch(`${BASE}/packages`, { headers: headers() });
    if (res.status === 401) {
      sessionStorage.removeItem("ns_admin_token");
      return false;
    }
    return true;
  },

  logout() {
    sessionStorage.removeItem("ns_admin_token");
  },

  isLoggedIn() {
    return !!sessionStorage.getItem("ns_admin_token");
  },

  // ── Packages ──────────────────────────────────────────────────
  async getPackages() {
    const res = await fetch(`${BASE}/packages`, { headers: headers() });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async createPackage(data) {
    const res = await fetch(`${BASE}/packages`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async updatePackage(data) {
    const res = await fetch(`${BASE}/packages`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async deletePackage(id) {
    const res = await fetch(`${BASE}/packages?id=${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return true;
  },
};