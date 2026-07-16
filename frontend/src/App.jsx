import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Registrar from "@/pages/Registrar";
import Dashboard from "@/pages/Dashboard";
import Clientes from "@/pages/Clientes";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Registrar />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
      </Route>
    </Routes>
  );
}
