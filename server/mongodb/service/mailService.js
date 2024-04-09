import nodemailer from "nodemailer";
import databaseProject from "../GetDataBase.js";
import {ObjectId} from "mongodb"
import express from "express";
import path from "path";
import fs from "fs";
export const contractMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lightwing2208@gmail.com",
    pass: process.env.PASS_EMAIL,
  },
});

contractMail.verify((error)=>{
    if(error){
        console.log(error);
        return next(error)
    }
    else{
        console.log("ready to send");
        
    }
})
export const sendMail=async(req,res,next)=>{
  try{
    const caseID=(req.params.ID);
    console.log(process.env.PASS_EMAIL);
    const caseData=await databaseProject.hiredBook.aggregate([
     {
       '$match': {
         '_id':  new ObjectId(`${caseID}`)
       }
     }, {
       '$lookup': {
         'from': 'users', 
         'localField': 'userID', 
         'foreignField': '_id', 
         'as': 'user'
       }
     }, {
       '$lookup': {
         'from': 'books', 
         'localField': 'bookID', 
         'foreignField': '_id', 
         'as': 'book'
       }
     }
   ]).toArray()
   console.log(caseData);
    if(caseData.length>0){
      
     const userMail=caseData[0].user[0].email;
    const bookName=caseData[0].book[0].name;
     const sentMail={
         from:"lightwing2208@gmail.com",
         to:userMail,
         subject:"DEADLINE RETURN BOOK",
         html:`<div>You have return book :${bookName}  </div>`
     }
     contractMail.sendMail(sentMail,(error)=>{
         if(error){
            return res.json(error.message);
         }
         else{
            return res.json("sent")
         }
     })
    }
    
  }
  catch(err){
    return next(err)
  }
   
}
export const verifyEmail=async(req,res,next)=>{
  try{
    
    console.log(process.env.PASS_EMAIL);
    const caseData=await databaseProject.users.findOne({email:req.body.email})
   console.log(caseData);
    if(caseData){
      
     const userMail=caseData.email;
     const template= fs.readFileSync(path.resolve('mailTemplate/template.html'),"utf-8").replace("{{name}}",userMail).replace("{id}",caseData._id)
     
     const sentMail={
         from:"lightwing2208@gmail.com",
         to:userMail,
         subject:"Verify Mail",
         html:template
     }
     contractMail.sendMail(sentMail,(error)=>{
         if(error){
            return res.json(error.message);
         }
         else{
            return res.json("sent")
         }
     })
    }
    
  }
  catch(err){
    return res.json(err)
  }
}


export const checkedEmail=async(req,res,next)=>{
   const userID=req.params.id;
   try {
    const result= await databaseProject.users.updateOne({_id:new ObjectId(userID)},{$set:{verifyToken:"verified"}})
    return res.json(result)

   } catch (error) {
    next(error)
   }
}