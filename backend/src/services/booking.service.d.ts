import type { CreateBookingInput } from "@coworking/shared";
export declare function getUserBookings(userId: number): Promise<({
    resource: {
        coworkingSpace: {
            id: number;
            name: string;
            description: string | null;
            address: string;
            city: string;
            country: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        name: string;
        type: import("../generated/prisma/enums.js").CoworkingResourceType;
        capacity: number;
        coworkingSpaceId: number;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: number;
    userId: number;
    resourceId: number;
    startsAt: Date;
    endsAt: Date;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare function coworkingResourceExists(resourceId: number): Promise<boolean>;
export declare function isBookingInsideAvailability(resourceId: number, startsAt: string, endsAt: string): Promise<boolean>;
export declare function hasOverlappingBooking(resourceId: number, startsAt: string, endsAt: string): Promise<boolean>;
export declare function createBooking(userId: number, data: CreateBookingInput): Promise<{
    id: number;
    userId: number;
    resourceId: number;
    startsAt: Date;
    endsAt: Date;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=booking.service.d.ts.map