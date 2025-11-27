import axios from "axios";

const api = axios.create({
  // langsung hardcode aja, biar nggak ribet sama import.meta.env
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// inject token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    // pastikan headers selalu berupa object biasa
    config.headers = {
      ...(config.headers as any),
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

// jika token invalid/expired → auto-logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
