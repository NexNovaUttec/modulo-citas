import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
            <Link to="/" style={{ color: "#fff", marginRight: "15px" }}>
                Inicio
            </Link>

            {user && (
                <>
                    <Link to="/citas" style={{ color: "#fff", marginRight: "15px" }}>
                        Mis Citas
                    </Link>
                    <Link to="/crear-cita" style={{ color: "#fff", marginRight: "15px" }}>
                        Crear Cita
                    </Link>
                </>
            )}

            {!user ? (
                <>
                    <Link to="/login" style={{ color: "#fff", marginRight: "15px" }}>
                        Login
                    </Link>
                    <Link to="/register" style={{ color: "#fff" }}>
                        Registro
                    </Link>
                </>
            ) : (
                <button onClick={logout} style={{ marginLeft: "10px" }}>
                    Cerrar sesión
                </button>
            )}
        </nav>
    );
}
