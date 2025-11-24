import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ nombre: "", email: "", password: "", telefono: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(form);
        navigate("/login");
    };

    return (
        <div>
            <h1>Registro</h1>
            <form onSubmit={handleSubmit}>
                <input name="nombre" placeholder="Nombre" onChange={handleChange} />
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
                <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
                <button>Registrarme</button>
            </form>
        </div>
    );
}
 