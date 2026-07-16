import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registrarUsuario = (data) => api.post("/registrar", data);
export const loginUsuario = (data) => api.post("/login", data);

export const listarClientes = () => api.get("/clientes");
export const criarCliente = (data) => api.post("/clientes", data);
export const atualizarCliente = (id, data) => api.put(`/clientes/${id}`, data);
export const deletarCliente = (id) => api.delete(`/clientes/${id}`);

export default api;
