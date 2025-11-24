import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminCitas() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCitas();
    }, []);

    const loadCitas = async () => {
        try {
            const res = await api.get("/citas");
            setCitas(res.data);
        } catch (error) {
            console.error("Error al cargar citas:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmar = async (id) => {
        try {
            await api.put(`/citas/${id}/confirmar`);
            alert("✅ Cita confirmada exitosamente");
            loadCitas();
        } catch (error) {
            alert("❌ Error al confirmar la cita");
        }
    };

    const cancelar = async (id) => {
        if (!window.confirm("¿Estás seguro de cancelar esta cita?")) return;
        
        try {
            await api.put(`/citas/${id}/cancelar`);
            alert("✅ Cita cancelada");
            loadCitas();
        } catch (error) {
            alert("❌ Error al cancelar la cita");
        }
    };

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
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando citas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-800 mb-2">Panel de Administración</h1>
                <p className="text-gray-600">Gestiona todas las citas del taller</p>
            </div>

            {/* Estadísticas */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Pendientes</p>
                            <p className="text-3xl font-bold text-yellow-800">
                                {citas.filter(c => c.estado === 'pendiente').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-green-50 to-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Confirmadas</p>
                            <p className="text-3xl font-bold text-green-800">
                                {citas.filter(c => c.estado === 'confirmada').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-red-50 to-red-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-600 text-sm font-medium">Canceladas</p>
                            <p className="text-3xl font-bold text-red-800">
                                {citas.filter(c => c.estado === 'cancelada').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total</p>
                            <p className="text-3xl font-bold text-blue-800">{citas.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de citas */}
            {citas.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-600">No hay citas registradas</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {citas.map((c) => (
                        <div key={c.id} className="card hover:shadow-2xl transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-dark-800">{c.servicio}</h3>
                                            <p className="text-gray-600">Cliente: <strong>{c.cliente}</strong></p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getEstadoBadge(c.estado)}`}>
                                                {c.estado?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-3 text-gray-600 ml-15">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{new Date(c.fecha).toLocaleDateString('es-MX')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{c.hora}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones */}
                                {c.estado === 'pendiente' && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => confirmar(c.id)}
                                            className="btn-success"
                                        >
                                            ✓ Confirmar
                                        </button>
                                        <button
                                            onClick={() => cancelar(c.id)}
                                            className="btn-danger"
                                        >
                                            ✕ Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

