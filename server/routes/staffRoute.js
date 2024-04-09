import express from "express";
import { staffValidator } from "../middleware/validator/roleValidator.js";
import { changeStatusHiredBook, getFilterBook } from "../mongodb/service/bookService.js";
import { sendMail } from "../mongodb/service/mailService.js";
import { getAllReceipt } from "../mongodb/service/receiptService.js";
import { accounting, changeStatusImportedBook, createStaff, getAllStaff, getHiredBook, getImportedBook, getOverall, importBook } from "../mongodb/service/staffService.js";
import { getAllUser } from "../mongodb/service/userService.js";


export const staffRoute=express.Router();

staffRoute.get("/book",getFilterBook);
staffRoute.get("/user",getAllUser)
staffRoute.get("/receipt",getAllReceipt);
staffRoute.get("/hireBook",getHiredBook);
staffRoute.put("/hiredBook/:ID",changeStatusHiredBook)
staffRoute.get("/chart",accounting);
staffRoute.post("/mail/:ID",staffValidator,sendMail);
staffRoute.post("/createStaff",createStaff)
staffRoute.get("/overall",getOverall)
staffRoute.get("/getAllStaff",getAllStaff)
staffRoute.get('/getImportedBook',getImportedBook)
staffRoute.put("/importedBook/:ID",changeStatusImportedBook)
staffRoute.post("/book/",importBook)