import { User } from "../../schema/Schema.js";
import databaseProject from "../GetDataBase.js";
import { createAccessToken, verifyToken } from "../jwt/jwtController.js";
import {ObjectId} from "mongodb"
import bcrypt from "bcrypt"
class UserService {
    async register(payload) {
      const existingAccount = await databaseProject.users.findOne({ email: payload.email });
      console.log(existingAccount);
      if (!existingAccount) {
       const encryptPass= bcrypt.hashSync(payload.password, 10);
      console.log("encrypt",encryptPass);
        await databaseProject
          .users
          .insertOne(
            new User({
              username:payload.email,
              password:encryptPass,
              fullName:"",
              email:payload.email,
              gender:"other",
              sex:"",
              role:payload.role||"",
              verifyToken:"Chưa xác thực",
              forgetToken:""
            })
          );
       
      }
      return false
    }
  }
  export const registerService = new UserService()

  export const registerController = async(req,res,next) => {
   
    try {
      const accessToken = await registerService.register(req.body);
      return res.json({
        message: 'Đăng ký thành công',
        
    })
    } catch (error) {
      next(error)
    }
    
}
