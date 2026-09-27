import argon2 from "argon2";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.config.js";
export async function registerUser(data) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }
    const hashedPassword = await argon2.hash(data.password);
    const user = await prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
        },
    });
    return user;
}
export async function loginUser(data) {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }
    const passwordIsValid = await argon2.verify(user.password, data.password);
    if (!passwordIsValid) {
        throw new Error("INVALID_CREDENTIALS");
    }
    const accessToken = jwt.sign({
        sub: user.id.toString(),
        email: user.email,
    }, authConfig.jwtSecret, {
        expiresIn: authConfig.jwtExpiresIn,
    });
    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
        accessToken,
    };
}
//# sourceMappingURL=auth.service.js.map