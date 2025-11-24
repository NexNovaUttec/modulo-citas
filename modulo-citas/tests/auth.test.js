import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/config/db.js";

describe("PRUEBAS DE AUTH", () => {

  test("Registro de usuario", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Usuario Test",
        email: "test@example.com",
        password: "123456",
        telefono: "5551231234"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Usuario registrado");
  });

  test("Login correcto", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});

afterAll(() => {
  pool.end();
});
