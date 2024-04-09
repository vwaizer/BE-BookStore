import { ObjectId } from "mongodb";
import { Books, HiredBook, ImportedBook } from "../../schema/Schema.js";
import databaseProject from "../GetDataBase.js";
import { createImageTag, getAssetInfo } from "./cloudinary.js";
export const getDetailBook = async (req, res) => {
  console.log("vao");
  const userID = req.params.ID;
  console.log("userID", req.params);
  const user = await databaseProject.book.findOne({
    _id: new ObjectId(`${userID}`),
  });
  return res.json(user);
};
export const deleteBook = async (req, res) => {
  const userID = req.params.ID;

  const result = await databaseProject.book.deleteOne({
    _id: new ObjectId(`${userID}`),
  });
  return res.json(result);
};
export const addBook = async (req, res,next) => {
  const imgUrl= await getAssetInfo(req.body.book[0].images[0])
  // const imageTag = await createImageTag(req.body.book[0].images[0], colors[0][0], colors[1][0]);
  console.log("imgTag",imgUrl);
  const formatData=req.body.book.map((item,index)=>{
    return {...item,images:imgUrl}
  })
  try {
    const nameList=req.body.book.map((item,index)=>item.name)
    const checkIsExist = await databaseProject.book.find({
      name: {$in:nameList},
    }).toArray();
   
    if (checkIsExist.length>0) {
      console.log("checkIsExits", checkIsExist);
      // return updateBook(req,res);
      return res.json("Exist");
    } else {  
      req.body.book.map(async(item,index)=>{
        const newBody={staffID:req.staffID,book:formatData}
        const newBook = new ImportedBook(newBody);
      const result = await databaseProject.importedBook.insertOne(newBook);
        // const addedBook = {
        //   name: item.name,
        //   amount: item.amount,
        //   author: item.author,
        //   price: item.price,
        //   type:item.type
        // };
        // const setBook = await databaseProject.book.insertOne(new Books(addedBook));
      })
     
  
     
      return res.json("OK");
    }
  } catch (error) {
    next(error)
  }
};

export const updateBook = async (req, res) => {
  const result = await databaseProject.book.updateOne(
    { name: req.body.name, author: req.body.author },
    { $set: { amount: req.body.amount } }
  );
  return res.json(result);
};
export const getAllBook = (data, page) => {
  console.log(page);
  console.log(data.length);
  // const data = await databaseProject.book.find({}).toArray();
  if (page) {
    const result = data.filter((item, index) => {
      if (index >= (Number(page) - 1) * 32) {
        if (index < Number(page) * 32) {
          return item;
        }
      }
    });

    return result;
  }

  // console.log(result);
  return data;
};
export const getFilterBook = async (req, res, next) => {
  console.log("vao");
  const query =req.query;
 
  if (Object.keys(query).length > 0) {
    // if (query.publisher) {
    //   const publisher = decodeURIComponent(query.publisher);
    //   const filterData = await databaseProject.book
    //     .find({ publisher: publisher })
    //     .toArray();
    //   return res.json(filterData);
    // } else if (query.type) {
    //   const typeInput = decodeURIComponent(query.type);
    //   const filterData = await databaseProject.book
    //     .find({ type: typeInput })
    //     .toArray();
    //   return res.json(filterData);
    // } else if (query.author) {
    //   const author = decodeURIComponent(query.author);
    //   const filterData = await databaseProject.book
    //     .find({ author: author })
    //     .toArray();
    //   return res.json(filterData);
    // }
    // else{getAllBook(req, res,next);}

    if (Object.keys(query).length == 1 && query.page) {
      const data = await databaseProject.book.find({}).toArray();
      return res.json(getAllBook(data, query.page));
    } else {
      console.log(query);
      let findObject = {};
      if (query.publisher) {
        findObject = Object.assign({ publisher: query.publisher }, findObject);
      }
      if (query.type) {
        findObject = Object.assign({ type: decodeURI(query.type) }, findObject);
      }
      if (query.author) {
        findObject = Object.assign({ author: query.author }, findObject);
      }
      if(query.startPrice){
        findObject = Object.assign({$and:[{price:{$gte:query.startPrice}},{price:{$lte:query.endPrice}}] }, findObject);
      }
      const filterData = await databaseProject.book.find(findObject).toArray();
     
      return res.json(getAllBook(filterData,query.page));
    }
  } else {
    next("Missing query");
  }
};
export const getAllTypes = async (req, res) => {
  const data = await databaseProject.book.find({}).toArray();

  let typeList = [];
  for (let index = 0; index < data.length; index++) {
    let element = data[index].type;
    let isAdded = true;
    for (let index1 = 0; index1 < typeList.length; index1++) {
      let element1 = typeList[index1].type;
      if (element == element1) {
        isAdded = false;
        break;
      }
    }
    if (isAdded == true) {
      let tmp = { type: element };
      if (element != null) {
        typeList.push(tmp);
      }
    }
  }
  return res.json(typeList);
};

export const getAllPublisher = async (req, res) => {
  const data = await databaseProject.book.find().toArray();

  let brandList = [];
  for (let index = 1; index < data.length; index++) {
    let element = data[index].publisher;
    let isAdded = true;
    for (let index1 = 1; index1 < brandList.length; index1++) {
      let element1 = brandList[index1].publisher;

      if (element == element1) {
        isAdded = false;
        break;
      }
    }
    if (isAdded == true) {
      let tmp = { publisher: element };
      if (element != null) {
        brandList.push(tmp);
      }
    }
  }

  return res.json(brandList);
};
export const getAllAuthor = async (req, res) => {
  const data = await databaseProject.book.find().toArray();

  let authorList = [];
  for (let index = 1; index < data.length; index++) {
    let element = data[index].author;
    let isAdded = true;
    for (let index1 = 0; index1 < authorList.length; index1++) {
      let element1 = authorList[index1].author;

      if (element == element1) {
        isAdded = false;
        break;
      }
    }
    if (isAdded == true) {
      let tmp = { author: element };
      if (element != null) {
        authorList.push(tmp);
      }
    }
  }

  return res.json(authorList);
};
export const postHiredBook = async (req, res) => {
  const userID = req.userID.valueOf();
  console.log(req.body);
  const userHiredBook=await databaseProject.hiredBook.findOne({userID:userID})
  if(userHiredBook){
    return res.status(204).json("")
  }
  else{
    const hiredBook = new HiredBook({ ...req.body, userID: userID, status: "Step 1" });
    const result = await databaseProject.hiredBook.insertOne(hiredBook);
    return res.json(result);
  }

};
export const changeStatusHiredBook = async (req, res) => {
  const id = req.params.ID;
 console.log(id);
  try {
    const result = await databaseProject.hiredBook.updateOne(
      { _id: new ObjectId(`${id}`) },
      { $set:{status: `${req.body.status}`} }
    );
    return res.json(result);
  } catch (error) {
    console.log("error", error);
  }
};
export const getField = async (req, res) => {
  const type = req.body.type;
  const data = await databaseProject.book.find({ type: type }).toArray();
  let filedList = [];
  for (let index = 1; index < data.length; index++) {
    let element = data[index].field;
    let isAdded = true;
    for (let index1 = 0; index1 < filedList.length; index1++) {
      let element1 = filedList[index1].author;

      if (element == element1) {
        isAdded = false;
        break;
      }
    }
    if (isAdded == true) {
      let tmp = { field: element };
      if (element != null) {
        filedList.push(tmp);
      }
    }
  }

  return res.json(filedList);
};
