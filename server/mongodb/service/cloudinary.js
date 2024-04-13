import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dbupj4dev",
  api_key: "477211245261498",
  api_secret: "RwWhTDOdPH96F9ubKQOxqGWuGAI",
  secure: true,
});
export const uploadImage = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};
export const deleteIMG = async (req, res) => {
  const { imgID } = req.body;
  const result = await cloudinary.api.delete_resources([imgID], {
    type: "upload",
    resource_type: "image",
  });
  const message = result.deleted;
  console.log(message.imgID);

  return res.json({ message });
};
const getAssetInfoSub=async(publicId)=>{
  const options = {
    colors: true,
  };
  
  try {
    let result=[]
    const imgList=publicId.map( (item, index) => {
      if (item.length > 0) {
        console.log("item", item);
        result.push( cloudinary.url(item, options))
      }
    })
    console.log(imgList);
    
    
   
    return result
  } catch (error) {
    console.log(error);
    throw new Error(error)
  }
      
  

}
export const getAssetInfo = async (publicId) => {
  
  // Return colors in the response

 
   
    const imgList=await getAssetInfoSub(publicId)
    return imgList;
   
  
};
export const createImageTag = (publicId, ...colors) => {
  // Set the effect color and background color
  const [effectColor, backgroundColor] = colors;

  // Create an image tag with transformations applied to the src URL
  let imageTag = publicId.map((item, index) => {
    return cloudinary.image(publicId, {
      transformation: [
        { width: 250, height: 250, gravity: "faces", crop: "thumb" },
        { radius: "max" },
        { effect: "outline:10", color: effectColor },
        { background: backgroundColor },
      ],
    });
  });

  return imageTag;
};
