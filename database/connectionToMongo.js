import mongoose from "mongoose";
 const MongoConnection=()=>mongoose.connect("mongodb://127.0.0.1:27017/todo").then(()=>{
    console.log("connected to Mongo");
})
.catch((e)=>{
    console.log(e);
})
export default MongoConnection;


