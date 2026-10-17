const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { createUser, findUserByEmail, } = require("../models/userModel");
const { registerSchema, loginSchema, } = require("../validators/authValidator");

const register = async (req, res, next) => {
    try {
        const validation = registerSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        const { name, email, password } = validation.data;

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        // Public registration always creates a student.
        const user = await createUser({
            name,
            email,
            passwordHash,
            role: "student",
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user,
        });
    } catch (error) {
        // Also handles concurrent registrations for the same email.
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const validation = loginSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email and password",
            });
        }

        const { email, password } = validation.data;

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        const token = jwt.sign(
            {
                sub: String(user.id),
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};



const getMe = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        },
    });
};


module.exports = { register, login, getMe };
