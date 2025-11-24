import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" />;

    // Si la ruta es solo para admins y el usuario no es admin
    if (adminOnly && user.rol !== 1) {
        return <Navigate to="/" />;
    }

    return children;
}
