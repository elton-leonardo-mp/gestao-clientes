import axios from "axios";

// baseURL '/api' é redirecionado pelo proxy do Vite para http://127.0.0.1:5000
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const listarClientes = () => api.get("/clientes");
export const criarCliente = (data) => api.post("/clientes", data);
export const deletarCliente = (id) => api.delete(`/clientes/${id}`);

export default api;
