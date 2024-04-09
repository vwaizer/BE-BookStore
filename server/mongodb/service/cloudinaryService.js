import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadImage } from "./cloudinary.js";

let filePath=[];
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve("img"));
    },
    filename: function (req, file, cb) {
      
      const uniqueSuffix = Date.now();
      const filepaths=path.resolve(`img/${uniqueSuffix+file.originalname}`)
      filePath.push(filepaths);
      req.filepath=filePath;
      
      cb(null,  uniqueSuffix+file.originalname)
    }
  })
  export const uploadImg = multer({ storage: storage })

export const uploadIMGController= async(req,res)=>{
    let img=[];
    let secureUrL;

    for (let index = 0; index < req.filepath.length; index++) {

     secureUrL= await uploadImage(req.filepath[index]);
    fs.unlinkSync(req.filepath[index]);
    img.push(secureUrL);
        
    }
    
    return res.json({message:"Upload complete",img})
}
