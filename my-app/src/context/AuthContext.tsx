// import { createContext, useContext, useEffect, useState } from "react";
// import * as SecureStore from "expo-secure-store";
// import { apiRequest } from "../utils/api";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const savedToken = await SecureStore.getItemAsync("token");
//       if (savedToken) {
//         try {
//           const me = await apiRequest("/auth/me/", { token: savedToken });
//           setToken(savedToken);
//           setUser(me);
//         } catch {
//           await SecureStore.deleteItemAsync("token");
//         }
//       }
//       setLoading(false);
//     })();
//   }, []);

//   const login = async (phone, password) => {
//     const data = await apiRequest("/auth/login/", { method: "POST", body: { phone, password } });
//     await SecureStore.setItemAsync("token", data.token);
//     setToken(data.token);
//     setUser(data.user);
//   };

//   const register = async (phone, fullName, password) => {
//     const data = await apiRequest("/auth/register/", {
//       method: "POST",
//       body: { phone, full_name: fullName, password },
//     });
//     await SecureStore.setItemAsync("token", data.token);
//     setToken(data.token);
//     setUser(data.user);
//   };

//   const logout = async () => {
//     try {
//       await apiRequest("/auth/logout/", { method: "POST", token });
//     } catch {}
//     await SecureStore.deleteItemAsync("token");
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }


import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { apiRequest } from "../utils/api";

type User = {
  id: number;
  phone: string;
  full_name?: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (
    phone: string,
    fullName: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await SecureStore.getItemAsync("token");

        if (savedToken) {
          try {
            const me = await apiRequest("/auth/me/", {
              token: savedToken,
            });

            setToken(savedToken);
            setUser(me);
          } catch {
            await SecureStore.deleteItemAsync("token");
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (phone: string, password: string) => {
    const data = await apiRequest("/auth/login/", {
      method: "POST",
      body: {
        phone,
        password,
      },
    });

    await SecureStore.setItemAsync("token", data.token);

    setToken(data.token);
    setUser(data.user);
  };

  const register = async (
    phone: string,
    fullName: string,
    password: string
  ) => {
    const data = await apiRequest("/auth/register/", {
      method: "POST",
      body: {
        phone,
        full_name: fullName,
        password,
      },
    });

    await SecureStore.setItemAsync("token", data.token);

    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await apiRequest("/auth/logout/", {
        method: "POST",
        token,
      });
    } catch {}

    await SecureStore.deleteItemAsync("token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

