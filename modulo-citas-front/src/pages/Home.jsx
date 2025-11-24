import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-dark-800 via-dark-900 to-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Bienvenido a <span className="text-primary-400">Minerva</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Sistema de gestión de citas para tu taller mecánico. Agenda tu servicio de forma rápida y sencilla.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {!user ? (
                                <>
                                    <Link to="/register" className="btn-primary text-lg px-8 py-3">
                                        Comenzar Ahora
                                    </Link>
                                    <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                                        Iniciar Sesión
                                    </Link>
                                </>
                            ) : (
                                <Link to="/crear-cita" className="btn-primary text-lg px-8 py-3">
                                    Agendar Nueva Cita
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center text-dark-800 mb-12">
                    Nuestros Servicios
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="card text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-dark-800 mb-2">Agenda Rápida</h3>
                        <p className="text-gray-600">
                            Programa tu cita en minutos desde cualquier dispositivo.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="card text-center">
                        <div className="w-16 h-16 bg-accent-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-dark-800 mb-2">Seguimiento</h3>
                        <p className="text-gray-600">
                            Revisa el estado de tus citas en tiempo real.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="card text-center">
                        <div className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-dark-800 mb-2">Servicio Experto</h3>
                        <p className="text-gray-600">
                            Mecánicos certificados y equipamiento de última generación.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
