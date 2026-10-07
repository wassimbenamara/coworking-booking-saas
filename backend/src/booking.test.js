import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import { createAuthenticatedTestUser } from "./test/auth-test-helper.js";
const testEmail = "booking-test@example.com";
describe("Booking", () => {
    beforeEach(async () => {
        await prisma.booking.deleteMany();
        await prisma.resourceAvailability.deleteMany();
        await prisma.coworkingResource.deleteMany();
        await prisma.coworkingSpace.deleteMany();
        await prisma.user.deleteMany({
            where: { email: testEmail },
        });
    });
    afterAll(async () => {
        await prisma.booking.deleteMany();
        await prisma.resourceAvailability.deleteMany();
        await prisma.coworkingResource.deleteMany();
        await prisma.coworkingSpace.deleteMany();
        await prisma.user.deleteMany({
            where: { email: testEmail },
        });
        await prisma.$disconnect();
    });
    async function createFixture() {
        const { accessToken } = await createAuthenticatedTestUser({
            email: testEmail,
        });
        const coworkingSpace = await prisma.coworkingSpace.create({
            data: {
                name: "Booking Test Coworking",
                address: "1 Test Street",
                city: "test",
                country: "France",
            },
        });
        const resource = await prisma.coworkingResource.create({
            data: {
                name: "Desk 1",
                type: "DESK",
                coworkingSpaceId: coworkingSpace.id,
            },
        });
        await prisma.resourceAvailability.create({
            data: {
                resourceId: resource.id,
                startsAt: new Date("2026-10-10T09:00:00.000Z"),
                endsAt: new Date("2026-10-10T17:00:00.000Z"),
            },
        });
        return {
            accessToken,
            resource,
        };
    }
    it("POST /api/bookings creates a booking inside availability", async () => {
        const { accessToken, resource } = await createFixture();
        await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            resourceId: resource.id,
            startsAt: "2026-10-10T10:00:00.000Z",
            endsAt: "2026-10-10T11:00:00.000Z",
        })
            .expect(201);
        const booking = await prisma.booking.findFirst({
            where: {
                resourceId: resource.id,
            },
        });
        expect(booking).not.toBeNull();
    });
    it("POST /api/bookings returns 409 outside availability", async () => {
        const { accessToken, resource } = await createFixture();
        await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            resourceId: resource.id,
            startsAt: "2026-10-10T18:00:00.000Z",
            endsAt: "2026-10-10T19:00:00.000Z",
        })
            .expect(409);
    });
    it("POST /api/bookings returns 409 for overlapping booking", async () => {
        const { accessToken, resource } = await createFixture();
        await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            resourceId: resource.id,
            startsAt: "2026-10-10T10:00:00.000Z",
            endsAt: "2026-10-10T12:00:00.000Z",
        })
            .expect(201);
        await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            resourceId: resource.id,
            startsAt: "2026-10-10T11:00:00.000Z",
            endsAt: "2026-10-10T13:00:00.000Z",
        })
            .expect(409);
    });
});
//# sourceMappingURL=booking.test.js.map