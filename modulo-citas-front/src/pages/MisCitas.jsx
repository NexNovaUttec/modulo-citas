import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function MisCitas() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/citas/mias");
                setCitas(res.data);
            } catch (error) {
                console.error("Error al cargar citas:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const getEstadoBadge = (estado) => {
        const badges = {
            pendiente: "bg-yellow-100 text-yellow-800",
            confirmada: "bg-green-100 text-green-800",
            cancelada: "bg-red-100 text-red-800",
            completada: "bg-blue-100 text-blue-800"
        };
        return badges[estado] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando citas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-dark-800 mb-2">Mis Citas</h1>
                    <p className="text-gray-600">Gestiona todas tus citas agendadas</p>
                </div>
                <Link to="/crear-cita" className="btn-primary">
                    + Nueva Cita
                </Link>
            </div>

            {/* Lista de citas */}
            {citas.length === 0 ? (
                <div className="card text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes citas agendadas</h3>
                    <p className="text-gray-500 mb-6">Agenda tu primera cita para empezar</p>
                    <Link to="/crear-cita" className="btn-primary inline-block">
                        Agendar Cita
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {citas.map((c) => (
                        <div key={c.id} className="card hover:shadow-2xl transition-all">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-dark-800">{c.servicio}</h3>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getEstadoBadge(c.estado)}`}>
                                                {c.estado?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-3 text-gray-600 ml-15">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span><strong>Fecha:</strong> {new Date(c.fecha).toLocaleDateString('es-MX')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span><strong>Hora:</strong> {c.hora}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
