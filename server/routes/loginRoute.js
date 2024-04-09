import express from "express"
import { loginValidator, validateRegister } from "../middleware/validator/loginAndRegisterValidator.js"
import { createLoginAccess } from "../mongodb/service/loginService.js"
import { registerController, registerService } from "../mongodb/service/registerService.js"
import { checkedEmail, verifyEmail } from "../mongodb/service/mailService.js"
export const loginRoute=express.Router()
loginRoute.post("/login",loginValidator,createLoginAccess)
loginRoute.post("/register",validateRegister,registerController)
loginRoute.post("/verify",verifyEmail)
loginRoute.get("/verified/:id",checkedEmail)
