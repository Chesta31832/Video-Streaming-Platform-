import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import apiError from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  if (!isValidObjectId(channelId)) {
    throw new apiError(400, "Invalid channel ID");
  }
  const userId = req.user._id;
  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: userId,
  });
  if (existingSubscription) {
    // If subscription exists, remove it
    await Subscription.deleteOne({ _id: existingSubscription._id });
    return res
      .status(200)
      .json(new apiResponse(200, null, "Unsubscribed successfully"));
  } else {
    // If subscription does not exist, create a new one
    const newSubscription = await Subscription.create({
      channel: channelId,
      subscriber: userId,
    });
    return res
      .status(201)
      .json(new apiResponse(201, newSubscription, "Subscribed successfully"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new apiError(400, "Invalid subscriber ID");
  }
  const subscribers = await Subscription.find({ channel: subscriberId }).populate(
    "subscriber",
    "username profilePicture"
  );
  return res
    .status(200)
    .json(
      new apiResponse(200, subscribers, "Channel subscribers retrieved successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new apiError(400, "Invalid channel ID");
  }
  const subscriptions = await Subscription.find({ subscriber: channelId }).populate(
    "channel",
    "userName fullName avatar"
  );
  return res
    .status(200)
    .json(
      new apiResponse(200, subscriptions, "User subscribed channels retrieved successfully")
    );
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};