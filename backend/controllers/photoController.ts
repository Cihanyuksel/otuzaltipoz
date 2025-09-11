import { Request, Response } from "express";
import Photo from "../models/Photo";
import cloudinary from "../config/cloudinary";
import { IGetUserAuthInfoRequest } from "./authController";
import Like from "../models/Likes";

// Get all photos
const getAllPhotos = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 15;
    const offset = parseInt(req.query.offset as string) || 0;

    const total = await Photo.countDocuments();

    const photos = await Photo.find()
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit)
      .populate("user_id", "username email profile_img_url created_at")
      .lean();

    const loggedInUserId = req.user?.id;

    const data = await Promise.all(photos.map(async (photo) => {
      const likeCount = await Like.countDocuments({ photo_id: photo._id });
      const isLikedByMe = loggedInUserId ? 
        await Like.exists({ user_id: loggedInUserId, photo_id: photo._id }) : 
        false;

      const { user_id, ...rest } = photo;
      
      return {
        ...rest,
        user: user_id,
        likeCount,
        isLikedByMe: !!isLikedByMe,
      };
    }));

    res.status(200).json({ total, status: true, data });
  } catch (error: any) {
    res.status(500).json({ message: "Photos not found", error: error.message });
  }
};

// Get photo by ID
const getPhoto = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate("user_id", "username email profile_img_url created_at")
      .lean();

    if (!photo) return res.status(404).json({ message: "Photo not found." });

    const loggedInUserId = req.user?.id;

    const likeCount = await Like.countDocuments({ photo_id: photo._id });
    const isLikedByMe = loggedInUserId ? 
      await Like.exists({ user_id: loggedInUserId, photo_id: photo._id }) : 
      false;

    const { user_id, ...rest } = photo;

    const photoWithUser = {
      ...rest,
      user: user_id,
      likeCount,
      isLikedByMe: !!isLikedByMe,
    };


    res.status(200).json({ status: true, data: photoWithUser });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: "Photo not found",
      error: error.message,
    });
  }
};

// Upload Photo
const uploadPhoto = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Photo required" });

    const result = cloudinary.uploader.upload_stream(
      { folder: "photos_app" },
      async (error, uploaded) => {
        if (error)
          return res.status(500).json({ message: "Upload Error", error });
        const photo = await Photo.create({
          user_id: req.user!.id,
          photo_url: uploaded?.secure_url,
          title: req.body.title,
          description: req.body.description,
          tags: req.body.tags ? req.body.tags.split(",") : [],
        });

        res.status(201).json({ success: true, photo });
      }
    );

    if (req.file?.buffer) result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err });
  }
};

// Updated Photoxx
const updatePhoto = async (req: Request, res: Response) => {
  try {
    const updatedPhoto = await Photo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedPhoto)
      return res
        .status(404)
        .json({ status: false, message: "Photo not found" });
    res.status(200).json(updatedPhoto);
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Photo not updated", error: error.message });
  }
};

// Delete Photo
const deletePhoto = async (req: Request, res: Response) => {
  try {
    const deletedPhoto = await Photo.findById(req.params.id);
    if (!deletedPhoto)
      return res.status(404).json({ message: "Photo not found" });

    const urlParts = deletedPhoto.photo_url.split("/");
    const fileNameWithExt = urlParts[urlParts.length - 1];
    const folder = "photos_app";
    const public_id = `${folder}/${fileNameWithExt.split(".")[0]}`;

    await cloudinary.uploader.destroy(public_id);

    await Photo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Photo deleted from Cloudinary and DB",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Could not delete photo",
      error: error.message,
    });
  }
};

export { getAllPhotos, getPhoto, uploadPhoto, updatePhoto, deletePhoto };