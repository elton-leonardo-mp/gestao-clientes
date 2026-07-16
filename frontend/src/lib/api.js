import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const saved = localStorage.getItem("gc_user");
  if (saved) {
    const { token } = JSON.parse(saved);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("gc_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const registrarUsuario = (data) => api.post("/registrar", data);
export const loginUsuario = (data) => api.post("/login", data);

export const listarClientes = () => api.get("/clientes");
export const criarCliente = (data) => api.post("/clientes", data);
export const atualizarCliente = (id, data) => api.put(`/clientes/${id}`, data);
export const deletarCliente = (id) => api.delete(`/clientes/${id}`);

export default api;
