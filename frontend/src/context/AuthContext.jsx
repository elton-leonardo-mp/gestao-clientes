import { createContext, useContext, useState } from "react";

// O backend Flask atual não expõe rota de autenticação.
// Este contexto simula login localmente (localStorage) até uma rota /login existir no backend.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("gc_user");
    return saved ? JSON.parse(saved) : null;
  });

  function login(email) {
    const fakeUser = { email };
    localStorage.setItem("gc_user", JSON.stringify(fakeUser));
    setUser(fakeUser);
  }

  function logout() {
    localStorage.removeItem("gc_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
