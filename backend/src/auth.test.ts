import argon2 from "argon2";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const testEmail = "integration-test@example.com";
const testPassword = "password123";

describe("Authentication", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testEmail,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testEmail,
      },
    });

    await prisma.$disconnect();
  });

  it("POST /api/auth/register creates a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Integration",
        lastName: "Test",
        email: testEmail,
        password: testPassword,
      })
      .expect(201);

    expect(response.body).not.toHaveProperty("password");

    const user = await prisma.user.findUnique({
      where: {
        email: testEmail,
      },
    });

    expect(user).not.toBeNull();

    if (!user) {
      throw new Error("Expected registered user to exist");
    }

    expect(user.firstName).toBe("Integration");
    expect(user.lastName).toBe("Test");
    expect(user.email).toBe(testEmail);

    expect(user.password).not.toBe(testPassword);

    const passwordMatches = await argon2.verify(user.password, testPassword);

    expect(passwordMatches).toBe(true);
  });

  it("POST /api/auth/register returns 409 for duplicate email", async () => {
    const payload = {
      firstName: "Integration",
      lastName: "Test",
      email: testEmail,
      password: testPassword,
    };

    await request(app).post("/api/auth/register").send(payload).expect(201);

    await request(app).post("/api/auth/register").send(payload).expect(409);
  });
});
