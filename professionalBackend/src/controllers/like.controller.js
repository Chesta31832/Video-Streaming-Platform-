import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import apiError from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video
    if (!isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }
    const userId = req.user._id;
    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    if (existingLike) {
        // If like exists, remove it
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new apiResponse(200, null, "Like removed successfully"));
    } else {
        // If like does not exist, create a new one
        const newLike = await Like.create({
            video: videoId,
            likedBy: userId
        });
        return res.status(201).json(new apiResponse(201, newLike, "Like added successfully"));
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    if (!isValidObjectId(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }
    const userId = req.user._id;
    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

    if (existingLike) {
        // If like exists, remove it
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new apiResponse(200, null, "Like removed successfully"));
    } else {
        // If like does not exist, create a new one
        const newLike = await Like.create({
            comment: commentId,
            likedBy: userId
        });
        return res.status(201).json(new apiResponse(201, newLike, "Like added successfully"));
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
    if (!isValidObjectId(tweetId)) {
        throw new apiError(400, "Invalid tweet ID");
    }
    const userId = req.user._id;
    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });

    if (existingLike) {
        // If like exists, remove it
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new apiResponse(200, null, "Like removed successfully"));
    } else {
        // If like does not exist, create a new one
        const newLike = await Like.create({
            tweet: tweetId,
            likedBy: userId
        });
        return res.status(201).json(new apiResponse(201, newLike, "Like added successfully"));
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id;
    const likedVideos = await Like.find({ likedBy: userId, video: { $exists: true } })
        .populate('video', 'title description thumbnailUrl')
        .populate('likedBy', 'userName fullName avatar')
        .sort({ createdAt: -1 });

    if (!likedVideos || likedVideos.length === 0) {
        throw new apiError(404, "No liked videos found");
    }

    return res.status(200).json(new apiResponse(200, likedVideos, "Liked videos retrieved successfully"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}