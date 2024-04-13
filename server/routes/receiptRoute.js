import express  from "express";
import { addToCart, deleteFromCart, getAllReceipt, getFilterReceipt, getHistory, setHistory, setPayment } from "../mongodb/service/receiptService.js";
import { userValidator } from "../middleware/validator/roleValidator.js";

export const receiptRoute=express.Router();
receiptRoute.get("/",userValidator,getFilterReceipt)
receiptRoute.post("/addToCart/:ID",userValidator,addToCart)
receiptRoute.get("/getAllReceipt",getAllReceipt)
receiptRoute.get("/history",userValidator,getHistory)
receiptRoute.post("/setHistory",userValidator,setHistory)
receiptRoute.post("/deleteItem",userValidator,deleteFromCart)
receiptRoute.post("/payment",setPayment)
