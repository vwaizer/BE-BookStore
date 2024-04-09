import express from "express";
import { userValidator } from "../middleware/validator/roleValidator.js";
import { addUser, changeAddress, deleteUser, getAddress, getDetailUser, updateUser } from "../mongodb/service/userService.js";


export const userRoute=express.Router();

userRoute.get("/detailUser",userValidator,getDetailUser);

userRoute.post("/",userValidator,addUser)
userRoute.delete("/delete",userValidator,deleteUser);
userRoute.put("/changeInfo",userValidator,updateUser)
userRoute.get("/address",userValidator,getAddress)
userRoute.put("/changeAddress",userValidator,changeAddress)
