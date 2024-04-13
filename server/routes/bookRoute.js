import express from "express";
import { addBook, deleteBook,  getAllAuthor,  getAllPublisher,  getAllTypes, getComment, getDetailBook, getField, getFilterBook, postHiredBook, setComment } from "../mongodb/service/bookService.js";
import { staffValidator, userValidator } from "../middleware/validator/roleValidator.js";
import { sentRentMail } from "../mongodb/service/mailService.js";

export const bookRoute=express.Router();

bookRoute.get("/" ,getFilterBook);
bookRoute.get("/detailBook/:ID",userValidator,getDetailBook);
bookRoute.post("/",addBook);
bookRoute.delete("/:ID",deleteBook);
bookRoute.get("/types",getAllTypes)
bookRoute.get("/publisher",getAllPublisher)
bookRoute.get("/author",getAllAuthor)
bookRoute.post("/hiredBook",userValidator,postHiredBook)
bookRoute.get("/field",getField)
bookRoute.post("/setComment/:ID",userValidator,setComment)
bookRoute.get("/getComment/:ID",userValidator,getComment)
bookRoute.post("/mailRent/:ID",userValidator,sentRentMail)