import { createContext, useContext, useState } from "react";
import { loginUsuario, registrarUsuario } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("gc_user");
    return saved ? JSON.parse(saved) : null;
  });

  async function login(email, senha) {
    const res = await loginUsuario({ email, senha });
    const { token, usuario } = res.data;
    const dadosUsuario = { ...usuario, token };
    localStorage.setItem("gc_user", JSON.stringify(dadosUsuario));
    setUser(dadosUsuario);
  }

  async function registrar(email, senha) {
    const res = await registrarUsuario({ email, senha });
    const { token, usuario } = res.data;
    const dadosUsuario = { ...usuario, token };
    localStorage.setItem("gc_user", JSON.stringify(dadosUsuario));
    setUser(dadosUsuario);
  }

  function logout() {
    localStorage.removeItem("gc_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
