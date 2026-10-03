import type { CreateCoworkingSpaceInput } from "@coworking/shared";
export declare function getCoworkingSpaces(): Promise<{
    id: number;
    name: string;
    description: string | null;
    address: string;
    city: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare function getCoworkingSpaceById(id: number): Promise<{
    id: number;
    name: string;
    description: string | null;
    address: string;
    city: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare function createCoworkingSpace(data: CreateCoworkingSpaceInput): Promise<{
    id: number;
    name: string;
    description: string | null;
    address: string;
    city: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=coworking-space.service.d.ts.map