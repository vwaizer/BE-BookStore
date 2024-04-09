import express from "express";
import { uploadImg, uploadIMGController } from "../mongodb/service/cloudinaryService.js";



export const MediaRoute=express.Router();

MediaRoute.post("/upload-image",uploadImg.array("avatar",[10]),uploadIMGController);
