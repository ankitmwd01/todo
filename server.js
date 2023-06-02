import express from "express";
import bodyParser from "body-parser";
import MongoConnection from "./database/connectionToMongo.js"
import userConnection from "./user.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import methodOverride from 'method-override';
// import bcrypt from "bcrpyt";
MongoConnection();
const app=express();
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use("/user",userConnection)
app.get("/",(req,res)=>{
    res.render("home");
})
app.listen(3000,()=>{
    console.log("server is connected");
})