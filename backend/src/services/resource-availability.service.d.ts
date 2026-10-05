import type { CreateResourceAvailabilityInput } from "@coworking/shared";
export declare function getResourceAvailabilities(resourceId: number): Promise<{
    id: number;
    startsAt: Date;
    endsAt: Date;
    resourceId: number;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare function createResourceAvailability(data: CreateResourceAvailabilityInput): Promise<{
    id: number;
    startsAt: Date;
    endsAt: Date;
    resourceId: number;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function coworkingResourceExists(resourceId: number): Promise<boolean>;
export declare function hasOverlappingAvailability(resourceId: number, startsAt: string, endsAt: string): Promise<boolean>;
//# sourceMappingURL=resource-availability.service.d.ts.map