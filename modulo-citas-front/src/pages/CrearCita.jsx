import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CrearCita() {
    const navigate = useNavigate();
    const [vehiculos, setVehiculos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [form, setForm] = useState({
        vehiculo_id: "",
        servicio_id: "",
        fecha: "",
        hora: "",
        notas: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const v = await api.get("/vehiculos/mios");
                const s = await api.get("/servicios");
                setVehiculos(v.data);
                setServicios(s.data);
            } catch (err) {
                setError("Error al cargar los datos");
            }
        }
        loadData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.vehiculo_id || !form.servicio_id || !form.fecha || !form.hora) {
            setError("Por favor completa todos los campos obligatorios");
            return;
        }
        
        setLoading(true);
        try {
            await api.post("/citas", form);
            alert("¡Cita creada exitosamente!");
            navigate("/citas");
        } catch (error) {
            setError(error.response?.data?.message || "Error al crear la cita");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="card">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark-800 mb-2">Agendar Nueva Cita</h1>
                    <p className="text-gray-600">Completa el formulario para reservar tu servicio</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Vehículo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vehículo <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="vehiculo_id"
                            value={form.vehiculo_id}
                            onChange={handleChange}
                            required
                            className="input-field"
                        >
                            <option value="">Selecciona un vehículo</option>
                            {vehiculos.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.marca} {v.modelo} ({v.placa})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Servicio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Servicio <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="servicio_id"
                            value={form.servicio_id}
                            onChange={handleChange}
                            required
                            className="input-field"
                        >
                            <option value="">Selecciona un servicio</option>
                            {servicios.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha y Hora */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="fecha"
                                value={form.fecha}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hora <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                name="hora"
                                value={form.hora}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notas adicionales (opcional)
                        </label>
                        <textarea
                            name="notas"
                            placeholder="Describe cualquier detalle importante sobre el servicio..."
                            value={form.notas}
                            onChange={handleChange}
                            rows={4}
                            className="input-field resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1"
                        >
                            {loading ? "Guardando..." : "Confirmar Cita"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/citas")}
                            className="btn-secondary"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
