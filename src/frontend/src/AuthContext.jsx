
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = sessionStorage.getItem("payoff_user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            sessionStorage.removeItem("payoff_user");
            return null;
        }
    });

    function login(userData) {
        sessionStorage.setItem("payoff_user", JSON.stringify(userData));
        setUser(userData);
    }

    function logout() {
        sessionStorage.removeItem("payoff_user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
