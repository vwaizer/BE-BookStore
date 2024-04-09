import express from "express";
import { addBook, deleteBook,  getAllAuthor,  getAllPublisher,  getAllTypes, getDetailBook, getField, getFilterBook, postHiredBook } from "../mongodb/service/bookService.js";
import { staffValidator, userValidator } from "../middleware/validator/roleValidator.js";

export const bookRoute=express.Router();

bookRoute.get("/" ,getFilterBook);
bookRoute.get("/detailBook/:ID",userValidator,getDetailBook);
bookRoute.post("/",addBook);
bookRoute.delete("/:ID",deleteBook);
bookRoute.get("/types",userValidator,getAllTypes)
bookRoute.get("/publisher",userValidator,getAllPublisher)
bookRoute.get("/author",userValidator,getAllAuthor)
bookRoute.post("/hiredBook",userValidator,postHiredBook)
bookRoute.get("/field",getField)