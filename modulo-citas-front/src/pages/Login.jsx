import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form.email, form.password);
            navigate("/");
        } catch (err) {
            alert("Credenciales inválidas");
        }
    };

    return (
        <div>
            <h1>Iniciar sesión</h1>
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" placeholder="Contraseña" type="password" onChange={handleChange} />
                <button>Entrar</button>
            </form>
        </div>
    );
}
