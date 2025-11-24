import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        await loadUser();
    };

    const register = async (data) => {
        await api.post("/auth/register", data);
    };

    const loadUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const decoded = JSON.parse(atob(token.split(".")[1])); // lectura básica del JWT
            setUser(decoded);
        } catch (err) {
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
