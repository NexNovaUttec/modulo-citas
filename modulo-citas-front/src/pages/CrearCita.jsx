import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CrearCita() {
    const [vehiculos, setVehiculos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [form, setForm] = useState({
        vehiculo_id: "",
        servicio_id: "",
        fecha: "",
        hora: "",
        notas: ""
    });

    useEffect(() => {
        async function loadData() {
            const v = await api.get("/vehiculos/mios");
            const s = await api.get("/servicios");
            setVehiculos(v.data);
            setServicios(s.data);
        }
        loadData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post("/citas", form);
        alert("Cita creada");
    };

    return (
        <div>
            <h1>Crear Cita</h1>

            <form onSubmit={handleSubmit}>
                <select name="vehiculo_id" onChange={handleChange}>
                    <option value="">Selecciona vehículo</option>
                    {vehiculos.map((v) => (
                        <option key={v.id} value={v.id}>
                            {v.marca} {v.modelo} ({v.placas})
                        </option>
                    ))}
                </select>

                <select name="servicio_id" onChange={handleChange}>
                    <option value="">Selecciona servicio</option>
                    {servicios.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.nombre}
                        </option>
                    ))}
                </select>

                <input type="date" name="fecha" onChange={handleChange} />
                <input type="time" name="hora" onChange={handleChange} />
                <textarea name="notas" placeholder="Notas" onChange={handleChange} />

                <button>Guardar cita</button>
            </form>
        </div>
    );
}
