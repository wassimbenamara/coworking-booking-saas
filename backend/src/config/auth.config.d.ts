import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";
type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;
export declare const authConfig: {
    jwtSecret: string;
    jwtExpiresIn: JwtExpiresIn;
};
export {};
//# sourceMappingURL=auth.config.d.ts.map