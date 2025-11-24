import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MisCitas from "./pages/MisCitas";
import CrearCita from "./pages/CrearCita";
import AdminCitas from "./pages/AdminCitas";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/citas"
                        element={
                            <ProtectedRoute>
                                <MisCitas />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/crear-cita"
                        element={
                            <ProtectedRoute>
                                <CrearCita />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminCitas />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
