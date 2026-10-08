import request from "supertest";
import app from "../app.js";
export async function createAuthenticatedTestUser(options = {}) {
    const email = options.email ?? "authenticated-test-user@example.com";
    const password = options.password ?? "password123";
    await request(app)
        .post("/api/auth/register")
        .send({
        firstName: "Integration",
        lastName: "Test",
        email,
        password,
    })
        .expect(201);
    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
        email,
        password,
    })
        .expect(200);
    const accessToken = loginResponse.body.accessToken;
    if (typeof accessToken !== "string" || accessToken.length === 0) {
        throw new Error("Expected login response to contain an access token");
    }
    return {
        email,
        password,
        accessToken,
    };
}
//# sourceMappingURL=auth-test-helper.js.map