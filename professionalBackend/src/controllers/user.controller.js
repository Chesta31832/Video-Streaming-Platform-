import asyncHandler from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {apiResponse} from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateaccessToken();
        const refreshToken = user.generateRefreshToken();        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    }catch (error) {
        throw new apiError(500, 'Internal server error');
    }
};

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

    let avatarLocalPath;
    if(req.files && req.files.avatar && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path;
    }

    let coverImageLocalPath;
    if(req.files && req.files.coverImage && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath) {
        throw new apiError(400, 'Avatar are required');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath, 'avatars');

    let coverImage = null;
    if(coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath, 'coverImages');
    }

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

const loginUser = asyncHandler(async (req, res) => {  

    console.log("Request Body:", req.body);
    const {email, userName, password} = req.body;
    console.log("email", email);

    if (!userName && !email) {
        throw new apiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [
            {email},
            {userName}
        ]
    })

    if(!user) {
        throw new apiError(404, 'User not found');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new apiError(401, 'Invalid password');
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .status(200)
        .json(
            new apiResponse(200, {user: loggedInUser, accessToken, refreshToken}, 'User logged in successfully')
        );

});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {refreshToken: undefined}
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .status(200)
        .json(
            new apiResponse(200, null, 'User logged out successfully')
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, 'Refresh token is required');
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new apiError(401, 'User not found');
        }
    
        if(user?.refreshToken !== incomingRefreshToken) {
            throw new apiError(401, 'Invalid refresh token');
        }
    
        const options = {
            httpOnly: true,
            secure: true,
        };
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newRefreshToken, options)
            .status(200)
            .json(
                new apiResponse(200, {accessToken, refreshToken: newRefreshToken}, 'Access token refreshed successfully')
            );
    } catch (error) {
        throw new apiError(401, error?.message || 'Unauthorized access, invalid refresh token');
    }

});

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
    const{oldPassword, newPassword} = req.body;
    
    const user = await User.findById(req.user?._id);

    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new apiError(400, 'Old password is incorrect');
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new apiResponse(200, null, 'Password changed successfully')
    );

});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new apiResponse(
        200,
        req.user,
        "User fetched successfully"
    ));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {fullName, email} = req.body;

    if(!fullName || !email) {
        throw new apiError(400, 'Full name and email are required');
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {new:true}
    ).select('-password');

    return res.status(200).json(
        new apiResponse(200, user, 'Account details updated successfully')
    );

});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath) {
        throw new apiError(400, 'Avatar is required');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath, 'avatars');

    if(!avatar.url) {
        throw new apiError(500, 'Failed to upload avatar');
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: avatar.url } },
        { new: true }
    ).select('-password');

    return res.status(200).json(
        new apiResponse(200, user, 'Avatar updated successfully')
    );
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath) {
        throw new apiError(400, 'Cover image is required');
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath, 'coverImages');

    if(!coverImage.url) {
        throw new apiError(500, 'Failed to upload cover image');
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { coverImage: coverImage.url } },
        { new: true }
    ).select('-password');

    return res.status(200).json(
        new apiResponse(200, user, 'Cover image updated successfully')
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const {userName} = req.params;

    if(!userName?.trim()) {
        throw new apiError(400, 'Username is required');
    }

    const channel=await User.aggregate([
        {
            $match: { 
                userName: userName?.toLowerCase() 
            }
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'channel',
                as: 'subscribers'
            }
        },
        {            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'subscriber',
                as: 'subscribedTo'
            }
        },
        {
            $addFields: {
                subscriberCount: { $size: '$subscribers' },
                channelsSubscribedToCount: { $size: '$subscribedTo' },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, '$subscribers.subscriber'] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                fullName: 1,
                userName: 1,
                subscriberCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if(!channel.length) {
        throw new apiError(404, 'Channel not found');
    }

    return res.status(200).json(
        new apiResponse(200, channel[0], 'Channel profile fetched successfully')
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'watchHistory',
                foreignField: '_id',
                as: 'watchHistory',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'owner',
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        userName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: '$owner' }
                        }
                    }
                ]
            }
        }
    ]);

    return res.status(200).json(
        new apiResponse(200, user[0]?.watchHistory || [], 'Watch history fetched successfully')
    );
});


export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentUserPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage , getUserChannelProfile,getWatchHistory };