import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import { createAuthenticatedTestUser } from "./test/auth-test-helper.js";
const testEmail = "coworking-test@example.com";
describe("Coworking spaces and resources", () => {
    beforeEach(async () => {
        await prisma.coworkingResource.deleteMany();
        await prisma.coworkingSpace.deleteMany();
        await prisma.user.deleteMany({
            where: { email: testEmail },
        });
    });
    afterAll(async () => {
        await prisma.coworkingResource.deleteMany();
        await prisma.coworkingSpace.deleteMany();
        await prisma.user.deleteMany({
            where: { email: testEmail },
        });
        await prisma.$disconnect();
    });
    it("POST /api/coworking-spaces creates a coworking space", async () => {
        const { accessToken } = await createAuthenticatedTestUser({
            email: testEmail,
        });
        const response = await request(app)
            .post("/api/coworking-spaces")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            name: "Integration Coworking",
            address: "10 Test Street",
            city: "test",
            country: "France",
        })
            .expect(201);
        expect(response.body).toBeDefined();
        const coworkingSpace = await prisma.coworkingSpace.findFirst({
            where: {
                name: "Integration Coworking",
            },
        });
        expect(coworkingSpace).not.toBeNull();
    });
    it("GET /api/coworking-spaces returns coworking spaces", async () => {
        const { accessToken } = await createAuthenticatedTestUser({
            email: testEmail,
        });
        await prisma.coworkingSpace.create({
            data: {
                name: "Integration Coworking",
                address: "10 Test Street",
                city: "test",
                country: "France",
            },
        });
        const response = await request(app)
            .get("/api/coworking-spaces")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(200);
        expect(Array.isArray(response.body.coworkingSpaces)).toBe(true);
        expect(response.body.coworkingSpaces.length).toBeGreaterThan(0);
    });
    it("POST /api/coworking-resources creates a resource", async () => {
        const { accessToken } = await createAuthenticatedTestUser({
            email: testEmail,
        });
        const coworkingSpace = await prisma.coworkingSpace.create({
            data: {
                name: "Integration Coworking",
                address: "10 Test Street",
                city: "test",
                country: "France",
            },
        });
        await request(app)
            .post("/api/coworking-resources")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            name: "Meeting Room A",
            type: "MEETING_ROOM",
            coworkingSpaceId: coworkingSpace.id,
            capacity: 8,
        })
            .expect(201);
        const resource = await prisma.coworkingResource.findFirst({
            where: {
                name: "Meeting Room A",
            },
        });
        expect(resource).not.toBeNull();
        expect(resource?.coworkingSpaceId).toBe(coworkingSpace.id);
    });
    it("GET /api/coworking-spaces/:id/resources returns resources", async () => {
        const { accessToken } = await createAuthenticatedTestUser({
            email: testEmail,
        });
        const coworkingSpace = await prisma.coworkingSpace.create({
            data: {
                name: "Integration Coworking",
                address: "10 Test Street",
                city: "test",
                country: "France",
            },
        });
        await prisma.coworkingResource.create({
            data: {
                name: "Desk A",
                type: "DESK",
                coworkingSpaceId: coworkingSpace.id,
            },
        });
        const response = await request(app)
            .get(`/api/coworking-spaces/${coworkingSpace.id}/resources`)
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(200);
        expect(Array.isArray(response.body.resources)).toBe(true);
        expect(response.body.resources.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=coworking.test.js.map