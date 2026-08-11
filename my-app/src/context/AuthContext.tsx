import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { apiRequest } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const savedToken = await SecureStore.getItemAsync("token");
      if (savedToken) {
        try {
          const me = await apiRequest("/me/", { token: savedToken });
          setToken(savedToken);
          setUser(me);
        } catch {
          await SecureStore.deleteItemAsync("token");
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (phone, password) => {
    const data = await apiRequest("/login/", { method: "POST", body: { phone, password } });
    await SecureStore.setItemAsync("token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (phone, fullName, password) => {
    const data = await apiRequest("/register/", {
      method: "POST",
      body: { phone, full_name: fullName, password },
    });
    await SecureStore.setItemAsync("token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await apiRequest("/logout/", { method: "POST", token });
    } catch {}
    await SecureStore.deleteItemAsync("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}