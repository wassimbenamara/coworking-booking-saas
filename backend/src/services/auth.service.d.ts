import type { RegisterInput } from "../schemas/auth.schema.js";
export declare function registerUser(data: RegisterInput): Promise<{
    createdAt: Date;
    email: string;
    firstName: string;
    id: number;
    lastName: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map