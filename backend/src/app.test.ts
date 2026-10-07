import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "./app.js";

describe("Application", () => {
  it("GET /api/health returns API health status", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toEqual({
      status: "ok",
      service: "coworking-booking-api",
    });
  });

  it("GET / returns API message", async () => {
    const response = await request(app).get("/").expect(200);

    expect(response.body).toEqual({
      message: "Coworking Booking API",
    });
  });

  it("GET /api/bookings/me returns 401 without authentication", async () => {
    await request(app).get("/api/bookings/me").expect(401);
  });

  it("GET /api/health includes security headers", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.headers).toHaveProperty(
      "x-content-type-options",
      "nosniff",
    );

    expect(response.headers).toHaveProperty("x-frame-options");
  });
});
