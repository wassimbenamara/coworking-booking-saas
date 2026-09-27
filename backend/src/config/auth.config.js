import "dotenv/config";
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
}
const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ?? "1h");
export const authConfig = {
    jwtSecret,
    jwtExpiresIn,
};
//# sourceMappingURL=auth.config.js.map