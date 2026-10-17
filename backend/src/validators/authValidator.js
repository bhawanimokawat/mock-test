const { z } = require("zod");

const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email")
        .max(255, "Email cannot exceed 255 characters")
        .transform((value) => value.toLowerCase()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password cannot exceed 72 characters"),
});

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please enter a valid email")
        .max(255, "Email cannot exceed 255 characters")
        .transform((value) => value.toLowerCase()),

    password: z
        .string()
        .min(1, "Password is required")
        .max(72, "Invalid email or password"),
});

module.exports = {
    registerSchema,
    loginSchema,
};
