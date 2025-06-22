import mongoose from "mongoose";
import {Video} from "../models/video.model.js";
import {Subscription} from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import apiError from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user._id; // Use current user's ID as channel ID
    
    const channelVideos = await Video.find({ owner: channelId }).populate('owner', 'username profilePicture');
    if (!channelVideos || channelVideos.length === 0) {
        throw new apiError(404, "Channel not found or no videos uploaded");
    }
    const totalViews = channelVideos.reduce((acc, video) => acc + video.views, 0);
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    const totalVideos = channelVideos.length;
    const totalLikes = await Like.countDocuments({ video: { $in: channelVideos.map(video => video._id) } });

    return res.status(200).json(new apiResponse(200, {
        totalViews,
        totalSubscribers,
        totalVideos,
        totalLikes
    }, "Channel stats retrieved successfully"));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id; // Use current user's ID as channel ID
    
    const channelVideos = await Video.find({ owner: channelId }).populate('owner', 'username profilePicture');
    if (!channelVideos || channelVideos.length === 0) {
        throw new apiError(404, "Channel not found or no videos uploaded");
    }
    return res.status(200).json(new apiResponse(200, channelVideos, "Channel videos retrieved successfully"));
})

export {
    getChannelStats, 
    getChannelVideos
    }