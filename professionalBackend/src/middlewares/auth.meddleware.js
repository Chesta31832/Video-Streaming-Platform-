import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '')
    
        if (!token) {
            throw new apiError(401, 'Unauthorized access, no token provided');
        }
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decoded?._id).select('-password -refreshToken');
    
        if (!user) {
            throw new apiError(401, 'User not found');
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, error?.message || 'Unauthorized access, invalid token');
    }
    
})
