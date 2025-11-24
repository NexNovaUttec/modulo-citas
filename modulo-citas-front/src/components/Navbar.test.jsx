import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { MockAuthProvider } from "../tests/mocks/AuthContextMock";

describe("Navbar Component", () => {
  test("muestra el link inicio", () => {

    render(
      <MockAuthProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </MockAuthProvider>
    );

    const link = screen.getByText("Inicio");

    expect(link).toBeInTheDocument();
  });
});
