import mongoose , {isValidObjectId} from "mongoose";
import {Playlist} from "../models/playlist.model.js";
import apiError from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if (!name || !description) {
        throw new apiError(400, "Name and description are required");
    }
    const userId = req.user._id;
    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: userId
    });
    return res.status(201).json(new apiResponse(201, newPlaylist, "Playlist created successfully"));
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if (!isValidObjectId(userId)) {
        throw new apiError(400, "Invalid user ID");
    }
    const playlists = await Playlist.find({owner: userId})
        .populate('owner', 'username profilePicture')
        .populate('videos', 'title thumbnail');
    if (!playlists || playlists.length === 0) {
        throw new apiError(404, "No playlists found for this user");
    }
    return res.status(200).json(new apiResponse(200, playlists, "User playlists retrieved successfully"));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findById(playlistId)
        .populate('owner', 'username profilePicture')
        .populate('videos', 'title thumbnail');
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }
    return res.status(200).json(new apiResponse(200, playlist, "Playlist retrieved successfully"));

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID");
    }
    if (!isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    // Check if video is already in playlist
    if (playlist.videos.includes(videoId)) {
        throw new apiError(400, "Video already exists in this playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();
    return res.status(200).json(new apiResponse(200, playlist, "Video added to playlist successfully"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID");
    }
    if (!isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }   
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }
    const videoIndex = playlist.videos.indexOf(videoId);
    if (videoIndex === -1) {
        throw new apiError(404, "Video not found in this playlist");
    }
    playlist.videos.splice(videoIndex, 1);
    await playlist.save();
    return res.status(200).json(new apiResponse(200, playlist, "Video removed from playlist successfully"));

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findByIdAndDelete(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }
    return res.status(200).json(new apiResponse(200, playlist, "Playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID");
    }
    if (!name || !description) {
        throw new apiError(400, "Name and description are required");
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {name, description},
        {new: true}
    );
    if (!updatedPlaylist) {
        throw new apiError(404, "Playlist not found");
    }
    return res.status(200).json(new apiResponse(200, updatedPlaylist, "Playlist updated successfully"));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}