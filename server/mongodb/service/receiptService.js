import { Receipt } from "../../schema/Schema.js";
import databaseProject from "../GetDataBase.js";
import { ObjectId } from "mongodb";
export const getAllReceipt = async (req, res, next) => {
  try {
    const result = await databaseProject.receipt
      .aggregate([
        {
          $match: {},
        },
        {
          $lookup: {
            from: "books",
            localField: "cart.bookID",
            foreignField: "_id",
            as: "cartDetail",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userID",
            foreignField: "_id",
            as: "userDetail",
          },
        },
      ])
      .toArray();
     let formatData={};
    const tmp = result.map((item, index) => {
      if (item.cartDetail.length > 0 && index > 0) {
        console.log("item",item);
        const newData = item.cart.map((value, number) => {
            
            return {
              bookName: item.cartDetail[number].name,
              price: value.price,
              amount: value.amount,
              email: item?.userDetail[0]?.email,
              status:item?.status,
              date:item.date
            };
          
        });
        formatData=Object.assign(newData,formatData)
        return newData;
      
      }
    });
    console.log(formatData);
    return res.json(formatData);
  } catch (error) {
    next(error);
  }
};
export const getFilterReceipt = async (req, res, next) => {
  try {
    if (req.userID.valueOf()) {
      const result = await databaseProject.receipt
        .aggregate([
          {
            $match: {
              userID: new ObjectId(`${req.userID.valueOf()}`),
              status:"In Cart"
            },
          },
          {
            $lookup: {
              from: "books",
              localField: "cart.bookID",
              foreignField: "_id",
              as: "result",
            },
          },
        ])
        .toArray();
      console.log("result",result);
      if(result.length <=0){
        
        return res.json("No Cart")
      }else{
        // const resItem = result[0]?.cart.map((item, index) => {
        //   return {
        //     ...item,
        //     img: result[0].result[index].images[0],
        //     name: result[0].result[index].name,
        //   };
        // });
        // if (!resItem) {
        //   return res.json("null");
        // }
        // return res.json(resItem);
        return res.json(result)
      }
      }
     
  } catch (error) {
    next(error);
  }
};
export const addToCart = async (req, res, next) => {
  try {
    const bookID = req.params.ID;
    const amount = req.body.amount ? req.body.amount : 1;
    console.log("amount", amount);
    const bookData = await databaseProject.book.findOne({
      _id: new ObjectId(bookID),
    });
    console.log(req.userID.valueOf());
    const userCart = await databaseProject.receipt.findOne({
      userID: req.userID,
      status: "In Cart",
    });
    if (bookData.amount < amount) {
      return next("Amount Error");
    }
    if (bookData.amount >= amount) {
      bookData.amount -= amount;
      try {
        const result = await databaseProject.book.updateOne(
          { _id: bookData._id },
          { $set: { amount: bookData.amount } }
        );
        console.log(result);
      } catch (error) {
        return next(error);
      }
    }
    console.log("userCart", userCart);
    if (userCart == null) {
      const receipt = new Receipt({
        userID: req.userID,
        date: new Date(),
        status: "In Cart",
        cart: [
          {
            amount: amount,
            discount: bookData.discount,
            price: bookData.price,
            bookID: new ObjectId(bookID),
            img:bookData.images[0],
            name:bookData.name
          },
        ],
      });
      const result = await databaseProject.receipt.insertOne(receipt);
      res.json(result);
    } else {
      const bookItem = userCart.cart.find(
        (item, index) => item.bookID == bookID
      );
      if (bookItem) {
        bookItem.amount += amount;
        const index = userCart.cart.indexOf(bookItem);
        userCart.cart[index] = bookItem;
        const result = await databaseProject.receipt.updateOne(
          { userID: req.userID, status: "In Cart" },
          { $set: { cart: userCart.cart } }
        );
        return res.json({ message: "Success", result: result });
      }
      userCart.cart.push( {
        amount: amount,
        discount: bookData.discount,
        price: bookData.price,
        bookID: new ObjectId(bookID),
        img:bookData.images[0],
        name:bookData.name
      });
      console.log(userCart);
      const result = await databaseProject.receipt.updateOne(
        { userID: req.userID, status: "In Cart" },
        { $set: { cart: userCart.cart } }
      );
      return res.json({ message: "Success", result: result });
    }
  } catch (error) {
    return next(error);
  }
};
export const getHistory = async (req, res, next) => {
  const userID = req.userID.valueOf();
  console.log(userID);
  try {
    const result = await databaseProject.receipt
      .aggregate([
        {
          '$match': {
            'userID': new ObjectId(`${userID}`),
            'status':'History'
          }
        }, {
          '$lookup': {
            'from': 'books', 
            'localField': 'cart.bookID', 
            'foreignField': '_id', 
            'as': 'book'
          }
        }
      ])
      .toArray();
      
      if(result.length>0){
        const returnData=result.map((item,index)=>{
          console.log("item cart",item.cart);
          console.log("item book",item.book);
           const loop=item.book.map((value,number)=>{
            return {userID:item.userID,date:item.date,status:item.status,name:value.name,price:value.price,amount:item.cart[number].amount,discount:item.cart[number].discount,img:value.images[0]}
          })
          return loop
         })
      return res.json(returnData);
      }
     else{
      return res.json("No History")
     }
  } catch (error) {
    next(error);
  }
};
export const setHistory = async (req, res, next) => {
  const userID = req.userID.valueOf();
   const oldCart = req.body.cart;
   console.log("oldCart",oldCart);
  const cart=oldCart.map((item,index)=>{
    return{amount:item.amount,discount:item.discount,bookID:new ObjectId(`${item.bookID}`),price:item.price,img:item.img,name:item.name}
  })
  console.log("cart",cart);
if(cart.length>0){
  try {
    const result = await databaseProject.receipt.insertOne({
      date: new Date(),
      cart: cart,
      userID: userID,
      status: "History",
    });
    const cartUser = await databaseProject.receipt.findOne({
      userID: new ObjectId(userID),
      status: "In Cart",
    });
    console.log("cartUser",cartUser);
    if (cart.length < cartUser.cart.length) {
      const tmpCart = cartUser.cart.map((item,index)=>{
      
        let checked=0;
        cart.forEach((value,number)=>{
          console.log("oldcart Bookid",JSON.stringify(item.bookID));
        if(JSON.stringify(value.bookID).slice(1,-1) != JSON.stringify(item.bookID).slice(1,-1)){
           checked++
           return;
        }
        else{
          return; 
        }
        })
        if(checked == cart.length)
        {
          return item
        }
      })
      
      const newCart=tmpCart.filter((item,index)=>item != undefined)
      console.log("newCart",newCart);
      const updateResult = await databaseProject.receipt.updateOne(
        { userID: userID, status: "In Cart" },
        {$set:{ cart: newCart}}
      );
      return res.json(updateResult);
     } 
    else {
      await databaseProject.receipt.deleteOne({
        userID: userID,
        status: "In Cart",
      });
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
}
else return res.json("Cart is empty")
  
};
export const deleteFromCart=async(req,res)=>{
  const userID = req.userID;
  console.log(userID);
  const userCart=await databaseProject.receipt.findOne({userID:new ObjectId(userID),status:"In Cart"})
  const oldCart=userCart.cart;
console.log("oldCart",oldCart);
 const deleteItem=req.body.deleteItem;
 console.log(deleteItem);
 const newCart=oldCart.filter((item,index)=>{

  return !deleteItem.includes(JSON.stringify(item.bookID).slice(1,-1))
})
 console.log(newCart);
 if (newCart.length>0){
  const result=await databaseProject.receipt.updateOne({userID: new ObjectId(userID)},{$set:{cart:newCart}})
 return res.json(result)
 }
 else{
  const result=await databaseProject.receipt.deleteOne({userID: new ObjectId(userID)})
  return res.json(result)
 }
 
}