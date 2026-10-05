import type { RegisterInput } from "@coworking/shared";
import type { LoginInput } from "@coworking/shared";
export declare function registerUser(data: RegisterInput): Promise<{
    createdAt: Date;
    email: string;
    firstName: string;
    id: number;
    lastName: string;
}>;
export declare function loginUser(data: LoginInput): Promise<{
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    accessToken: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map