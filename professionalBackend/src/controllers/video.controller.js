import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import apiError from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  const filter = {};
  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }
  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new apiError(400, "Invalid user ID");
    }
    filter.owner = userId;
  }
  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortType === "desc" ? -1 : 1;
  }
  const videos = await Video.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("owner", "username profilePicture");
  return res
    .status(200)
    .json(new apiResponse(200, videos, "Videos retrieved successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if (!title || !description) {
    throw new apiError(400, "Title and description are required");
  }
  const videoFiles = req.files;
  if (!videoFiles || !videoFiles.videoFile) {
    throw new apiError(400, "Video file is required");
  }
  const videoFile = videoFiles.videoFile[0];
  const thumbnailFile = videoFiles.thumbnail ? videoFiles.thumbnail[0] : null;

  const videoUpload = await uploadOnCloudinary(videoFile.path);
  if (!videoUpload) {
    throw new apiError(500, "Failed to upload video");
  }

  let thumbnailUpload = null;
  if (thumbnailFile) {
    thumbnailUpload = await uploadOnCloudinary(thumbnailFile.path);
  }

  const newVideo = await Video.create({
    title,
    description,
    videoFile: videoUpload.url,
    thumbnail: thumbnailUpload?.url || "",
    duration: videoUpload.duration || 0,
    owner: req.user._id,
  });
  return res
    .status(201)
    .json(new apiResponse(201, newVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId).populate("owner", "username profilePicture");
  if (!video) {
    throw new apiError(404, "Video not found");
  }
  return res.status(200).json(new apiResponse(200, video, "Video retrieved successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid video ID");
  }
  const { title, description } = req.body;
  if (!title || !description) {
    throw new apiError(400, "Title and description are required");
  }

  const updateData = { title, description };

  // Handle thumbnail update if provided
  if (req.file) {
    const thumbnailUpload = await uploadOnCloudinary(req.file.path);
    if (thumbnailUpload) {
      updateData.thumbnail = thumbnailUpload.url;
    }
  }

  const updatedVideo = await Video.findByIdAndUpdate(videoId, updateData, { new: true }).populate("owner", "username profilePicture");
  if (!updatedVideo) {
    throw new apiError(404, "Video not found");
  }
  return res.status(200).json(new apiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid video ID");
  }
  const deletedVideo = await Video.findByIdAndDelete(videoId);
  if (!deletedVideo) {
    throw new apiError(404, "Video not found");
  }
  return res.status(200).json(new apiResponse(200, deletedVideo, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "Video not found");
  }
  video.isPublished = !video.isPublished;
  await video.save();
  return res.status(200).json(new apiResponse(200, video, "Video publish status toggled successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};