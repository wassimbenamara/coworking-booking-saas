import type { CreateCoworkingResourceInput } from "@coworking/shared";
export declare function getCoworkingResourcesBySpaceId(coworkingSpaceId: number): Promise<{
    id: number;
    name: string;
    type: import("../generated/prisma/enums.js").CoworkingResourceType;
    capacity: number;
    coworkingSpaceId: number;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare function getCoworkingResourceById(id: number): Promise<{
    id: number;
    name: string;
    type: import("../generated/prisma/enums.js").CoworkingResourceType;
    capacity: number;
    coworkingSpaceId: number;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare function createCoworkingResource(data: CreateCoworkingResourceInput): Promise<{
    id: number;
    name: string;
    type: import("../generated/prisma/enums.js").CoworkingResourceType;
    capacity: number;
    coworkingSpaceId: number;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function coworkingSpaceExists(coworkingSpaceId: number): Promise<boolean>;
//# sourceMappingURL=coworking-resource.service.d.ts.map