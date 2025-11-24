import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MisCitas() {
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        async function load() {
            const res = await api.get("/citas/mias");
            setCitas(res.data);
        }
        load();
    }, []);

    return (
        <div>
            <h1>Mis Citas</h1>

            {citas.map((c) => (
                <div key={c.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
                    <h3>{c.servicio}</h3>
                    <p>Fecha: {c.fecha}</p>
                    <p>Hora: {c.hora}</p>
                    <p>Estado: {c.estado}</p>
                </div>
            ))}
        </div>
    );
}
