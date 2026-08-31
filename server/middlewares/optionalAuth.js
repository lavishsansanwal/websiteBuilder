import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const optionalAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            if (req.headers.authorization.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            } else {
                token = req.headers.authorization;
            }
        }

        if (!token && req.headers["x-auth-token"]) {
            token = req.headers["x-auth-token"];
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id);
                if (req.user) {
                    return next();
                }
            } catch (err) {
                // Token invalid/expired, continue to fallback
            }
        }

        // Fallback to x-user-id header if present
        const fallbackUserId = req.headers["x-user-id"];
        if (fallbackUserId) {
            req.user = await User.findById(fallbackUserId);
            if (req.user) {
                return next();
            }
        }

        // No user authenticated - proceed as guest
        req.user = null;
        return next();
    } catch (error) {
        req.user = null;
        return next();
    }
};

export default optionalAuth;
