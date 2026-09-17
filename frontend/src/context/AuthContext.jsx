import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("ancps_user");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  const register = (userData) => {
    localStorage.setItem("ancps_user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = (email, password) => {
    const savedUser = localStorage.getItem("ancps_user");

    if (!savedUser) {
      return {
        success: false,
        message: "Aucun compte trouvé."
      };
    }

    const existingUser = JSON.parse(savedUser);

    if (
      existingUser.email === email &&
      existingUser.password === password
    ) {
      setUser(existingUser);

      return {
        success: true
      };
    }

    return {
      success: false,
      message: "Email ou mot de passe incorrect."
    };
  };

  const logout = () => {
    localStorage.removeItem("ancps_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}