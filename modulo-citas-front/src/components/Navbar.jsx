import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-dark-800 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo y marca */}
                    <div className="flex items-center space-x-3">
                        <div className="bg-primary-600 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <Link to="/" className="text-white font-bold text-xl tracking-tight">
                            Minerva <span className="text-primary-400">Taller</span>
                        </Link>
                    </div>

                    {/* Links de navegación */}
                    <div className="flex items-center space-x-1">
                        <Link to="/" className="text-gray-300 hover:bg-dark-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Inicio
                        </Link>

                        {user && (
                            <>
                                <Link to="/citas" className="text-gray-300 hover:bg-dark-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Mis Citas
                                </Link>
                                <Link to="/crear-cita" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    + Nueva Cita
                                </Link>
                            </>
                        )}

                        {!user ? (
                            <>
                                <Link to="/login" className="text-gray-300 hover:bg-dark-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Registrarse
                                </Link>
                            </>
                        ) : (
                            <button 
                                onClick={logout} 
                                className="ml-2 bg-accent-red hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
