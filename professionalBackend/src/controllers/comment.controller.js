import { Comment } from "../models/comment.model.js";
import apiError from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }
    const comments = await Comment.find({ video: videoId })
        .populate('owner', 'username profilePicture')
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
    if (!comments || comments.length === 0) {
        throw new apiError(404, "No comments found for this video");
    }

    return res.status(200).json(new apiResponse(200, comments, "Comments retrieved successfully"));
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    const newComment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    });

    return res.status(201).json(new apiResponse(201, newComment, "Comment added successfully"));
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }

    const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId, owner: userId },
        { content },
        { new: true }
    );

    if (!updatedComment) {
        throw new apiError(404, "Comment not found or you are not authorized to update it");
    }

    return res.status(200).json(new apiResponse(200, updatedComment, "Comment updated successfully"));
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }

    const deletedComment = await Comment.findOneAndDelete({ _id: commentId, owner: userId });

    if (!deletedComment) {
        throw new apiError(404, "Comment not found or you are not authorized to delete it");
    }

    return res.status(200).json(new apiResponse(200, deletedComment, "Comment deleted successfully"));
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
};