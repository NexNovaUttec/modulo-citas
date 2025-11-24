import { AuthContext } from "../../context/AuthContext";

export function MockAuthProvider({ children }) {
  const mockUser = { nombre: "Usuario de prueba" };

  return (
    <AuthContext.Provider value={{
      user: mockUser,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn()
    }}>
      {children}
    </AuthContext.Provider>
  );
}
