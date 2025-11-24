import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminCitas() {
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        async function load() {
            const res = await api.get("/citas");
            setCitas(res.data);
        }
        load();
    }, []);

    const confirmar = async (id) => {
        await api.put(`/citas/${id}/confirmar`);
        alert("Cita confirmada");
    };

    const cancelar = async (id) => {
        await api.put(`/citas/${id}/cancelar`);
        alert("Cita cancelada");
    };

    return (
        <div>
            <h1>Panel Administrador</h1>

            {citas.map((c) => (
                <div key={c.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                    <h3>{c.servicio}</h3>
                    <p>Cliente: {c.cliente}</p>
                    <p>Fecha: {c.fecha}</p>
                    <p>Hora: {c.hora}</p>
                    <p>Estado: {c.estado}</p>

                    <button onClick={() => confirmar(c.id)}>Confirmar</button>
                    <button onClick={() => cancelar(c.id)}>Cancelar</button>
                </div>
            ))}
        </div>
    );
}

