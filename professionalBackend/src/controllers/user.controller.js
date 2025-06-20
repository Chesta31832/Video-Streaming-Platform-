import asyncHandler from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {apiResponse} from '../utils/apiResponse.js';

const registerUser = asyncHandler(async (req, res) => {

    const {userName, email, fullName, password} = req.body;
    //console.log("email", email);

    if([userName, email, fullName, password].some(field => field?.trim() === '')) {
        throw new apiError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({
        $or:[{userName},{email}]
    });

    if(existingUser) {
        throw new apiError(409, 'User already exists');
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new apiError(400, 'Avatar are required');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath, 'avatars');
    const coverImage = await uploadOnCloudinary(coverImageLocalPath, 'coverImages');

    if(!avatar ) {
        throw new apiError(500, 'Failed to upload images');
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '' ,
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findOne(user._id).select(
        '-password -refreshToken'
    );

    if(!createdUser) {
        throw new apiError(500, 'Failed to create user');
    }

    return res.status(201).json(
        new apiResponse(201, createdUser, 'User registered successfully')
    );

});

export { registerUser }