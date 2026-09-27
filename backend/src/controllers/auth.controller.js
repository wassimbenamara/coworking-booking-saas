import { registerSchema } from "@coworking/shared";
import { registerUser } from "../services/auth.service.js";
import { loginSchema } from "@coworking/shared";
import { loginUser } from "../services/auth.service.js";
export async function register(req, res) {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: validation.error.flatten(),
        });
    }
    try {
        const user = await registerUser(validation.data);
        return res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({
                message: "Email already exists",
            });
        }
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
export async function login(req, res) {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: validation.error.flatten(),
        });
    }
    try {
        const result = await loginUser(validation.data);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
//# sourceMappingURL=auth.controller.js.map