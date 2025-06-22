import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import apiError from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  const userId = req.user._id;
  if (!content || content.trim() === "") {
    throw new apiError(400, "Content is required");
  }
  const newTweet = await Tweet.create({
    content,
    owner: userId,
  });
  return res
    .status(201)
    .json(new apiResponse(201, newTweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new apiError(400, "Invalid user ID");
  }
  const tweets = await Tweet.find({ owner: userId }).populate(
    "owner",
    "username profilePicture"
  );
  return res
    .status(200)
    .json(new apiResponse(200, tweets, "User tweets retrieved successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  if (!isValidObjectId(tweetId)) {
    throw new apiError(400, "Invalid tweet ID");
  }
  if (!content || content.trim() === "") {
    throw new apiError(400, "Content is required");
  }
  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    { new: true }
  );
  if (!updatedTweet) {
    throw new apiError(404, "Tweet not found");
  }
  return res
    .status(200)
    .json(new apiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new apiError(400, "Invalid tweet ID");
  }
  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
  if (!deletedTweet) {
    throw new apiError(404, "Tweet not found");
  }
  return res
    .status(200)
    .json(new apiResponse(200, deletedTweet, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };