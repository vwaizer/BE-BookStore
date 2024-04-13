
import { Books } from "../../schema/Schema.js";
import databaseProject from "../GetDataBase.js"
import { contractMail } from "./mailService.js";
import { registerService } from "./registerService.js"
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";
export const getHiredBook=async(req,res,next)=>{
    try {
        const result =await databaseProject.hiredBook.aggregate([
            {
                '$match': {}
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
                    'as': 'bookData'
                }
            }
        ]).toArray()
        
        return res.json(result)
    } catch (error) {
        next(error)
    }
   
}

export const accounting=async(req,res)=>{
  const data = await databaseProject.book.find({}).toArray();

  let typeList = [];
  for (let index = 0; index < data.length; index++) {
    let element = data[index].type;
    let isAdded = true;
  
    for (let index1 = 0; index1 < typeList.length; index1++) {
      let element1 = typeList[index1].type;
      if (element == element1) {
        isAdded = false;
        typeList[index1].amount++;
        break;
      }
    }
    if (isAdded == true) {
      let tmp = { type: element,amount:1 };
      if (element != null) {
        typeList.push(tmp);
      }
    }
  }
  return res.json(typeList);

}
export const createStaff=async(req,res)=>{
    
    const result = await registerService.register(req.body);
   if(result.accessToken){
     return res.json("Success")
   }
   else{
    return res.json("Error")
   }
}
export const getOverall= async(req,res,next)=>{
 
 try {
    const bookNumber=(await databaseProject.book.find().toArray()).length
    const userNumber=(await databaseProject.users.find().toArray()).length
    const receiptNumber=(await databaseProject.receipt.find().toArray())
    
    return res.json({bookNumber:bookNumber,userNumber:userNumber,receiptNumber:receiptNumber.length})
 } catch (error) {
    next(error)
 }
}
export const getAllStaff=async(req,res,next)=>{
    try {
        const result=await databaseProject.users.find({role:"staff"}).toArray()
        return res.json(result)
    } catch (error) {
        next(error)
    }
}
export const getImportedBook=async(req,res,next)=>{
    try {
        const result =await databaseProject.importedBook.find().toArray()
        return res.json(result)
    } catch (error) {
        return next(error)
    }
}
export const changeStatusImportedBook=async(req,res,next)=>{
    const id = req.params.ID;
 console.log(id);
  try {
    const result = await databaseProject.importedBook.updateOne(
      { _id: new ObjectId(`${id}`) },
      { $set:{status: `${req.body.status}`} }
    );
    return res.json(result);
  } catch (error) {
    console.log("error", error);
  }
}
export const importBook=async(req,res,next)=>{
    try {
        const item=req.body.book[0];
        console.log(item);
        // console.log(caseID);
          const addedBook = {
          name: item.name,
          amount: item.amount,
          author: item.author,
          images:item.images,
          price: item.price,
          type:item.type,
          publisher:item.publisher
        };
        const checkBook=await databaseProject.book.findOne({name:item.name})
        if(checkBook){
            return res.json("Exist Book!")
        }
        
        const setBook = await databaseProject.book.insertOne(new Books(addedBook));
      
        return res.json(setBook)
    } catch (error) {
        return next(error)
    }
}
export const sendAutoMail=async(caseID)=>{
    try{
    
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
     const template= fs.readFileSync(path.resolve('mailTemplate/remindTemplate.html'),"utf-8").replace("{{bookName}}",caseData[0].book[0].name).replace("{{image}}",caseData[0].book[0].images[0])
      if(caseData.length>0){
        
       const userMail=caseData[0].user[0].email;
      const bookName=caseData[0].book[0].name;
       const sentMail={
           from:"lightwing2208@gmail.com",
           to:userMail,
           subject:"DEADLINE RETURN BOOK",
           html:template
       }
       contractMail.sendMail(sentMail,(error)=>{
           if(error){
              console.log(error);
           }
           else{
              console.log("sent");
           }
       })
      }
      
    }
    catch(err){
      console.log(err);
    }
     
  }
export const autoSendMail=async()=>{
    const data =await databaseProject.hiredBook.find({status:"Accept"}).toArray()
    const  caseData=data.map((item,index)=>{
        if(new Date() > item.dateOut){
            return item
        }
    })
    console.log(caseData);
    caseData?.forEach((item,index)=>{
      console.log("item",item);
        sendAutoMail(item._id)
    })
   
}