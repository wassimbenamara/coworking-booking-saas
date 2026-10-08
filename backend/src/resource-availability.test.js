import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import { createAuthenticatedTestUser } from "./test/auth-test-helper.js";
const testEmail = "availability-test@example.com";
describe("Resource availability", () => {
    beforeEach(async () => {
        await prisma.resourceAvailability.deleteMany();
        await prisma.coworkingResource.deleteMany();
        await prisma.coworkingSpace.deleteMany();
        await prisma.user.deleteMany({
            where: {
                email: testEmail,
            },
        });
    });
    afterAll(async () => {
        await prisma.resourceAvailability.deleteMany();
        await prisma.coworkingResource.deleteMany();
        await prisma.coworkingSpace.deleteMany();
        await prisma.user.deleteMany({
            where: {
                email: testEmail,
            },
        });
        await prisma.$disconnect();
    });
    it("POST /api/resource-availabilities creates an availability", async () => {
        const { accessToken } = await createAuthenticatedTestUser({
            email: testEmail,
        });
        const coworkingSpace = await prisma.coworkingSpace.create({
            data: {
                name: "Test Coworking",
                address: "1 Test Street",
                city: 'test',
                country: "France"
            },
        });
        const resource = await prisma.coworkingResource.create({
            data: {
                name: "Desk 1",
                type: "DESK",
                coworkingSpaceId: coworkingSpace.id,
            },
        });
        const startsAt = "2026-10-10T09:00:00.000Z";
        const endsAt = "2026-10-10T12:00:00.000Z";
        const response = await request(app)
            .post("/api/resource-availabilities")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            resourceId: resource.id,
            startsAt,
            endsAt,
        })
            .expect(201);
        expect(response.body).toHaveProperty("availability");
        expect(response.body.availability).toMatchObject({
            resourceId: resource.id,
            startsAt,
            endsAt,
        });
        const availability = await prisma.resourceAvailability.findFirst({
            where: {
                resourceId: resource.id,
            },
        });
        expect(availability).not.toBeNull();
    });
    it("POST /api/resource-availabilities returns 409 for overlapping availability", async () => {
        const { accessToken } = await createAuthenticatedTestUser({
            email: testEmail,
        });
        const coworkingSpace = await prisma.coworkingSpace.create({
            data: {
                name: "Test Coworking",
                address: "1 Test Street",
                city: 'test',
                country: "France"
            },
        });
        const resource = await prisma.coworkingResource.create({
            data: {
                name: "Desk 1",
                type: "DESK",
                coworkingSpaceId: coworkingSpace.id,
            },
        });
        await request(app)
            .post("/api/resource-availabilities")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            resourceId: resource.id,
            startsAt: "2026-10-10T09:00:00.000Z",
            endsAt: "2026-10-10T12:00:00.000Z",
        })
            .expect(201);
        await request(app)
            .post("/api/resource-availabilities")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            resourceId: resource.id,
            startsAt: "2026-10-10T11:00:00.000Z",
            endsAt: "2026-10-10T13:00:00.000Z",
        })
            .expect(409);
    });
    it("POST /api/resource-availabilities returns 400 for invalid payload", async () => {
        const { accessToken } = await createAuthenticatedTestUser({
            email: testEmail,
        });
        await request(app)
            .post("/api/resource-availabilities")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            resourceId: -1,
            startsAt: "invalid-date",
            endsAt: "invalid-date",
        })
            .expect(400);
    });
});
//# sourceMappingURL=resource-availability.test.js.map