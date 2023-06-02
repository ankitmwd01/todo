import express from "express";
import jwt from "jsonwebtoken";

// import bcrpyt from "bcrpyt";
import { Task,User } from "./database/dataSchema.js";
const route = express.Router();
route.get("/login",(req,res)=>{
    res.render("login")
})
route.get("/signup",(req,res)=>{
    res.render("signup");
})
route.get("/profile",async(req,res)=>{
    // console.log(req.cookies);
    let token = req.cookies.val
    let decode = jwt.verify(token,"Ankit",{
     complete:true,
    });
    let nwID=decode.payload._id
    // console.log(nwID);
    let task= await Task.find({ID:nwID});
    res.render("profile",{task:task});
})

// Add a Task 
route.post("/task/add",async (req,res)=>{
       let token = req.cookies.val
       let decode = jwt.verify(token,"Ankit",{
        complete:true,
       });
       let nwID=decode.payload._id
       let temp = await Task.create({
        title:req.body.work,
        desc:req.body.desc,
        ID:nwID,
       })
       res.redirect("/user/profile");
})

//Delete task
route.delete("/task/delete/:id",async(req,res)=>{
    let id =req.params.id;
    console.log(id);
     await Task.deleteOne({_id:id});
    res.redirect("/user/profile");
})

function genCookie(user,res){
    let token =jwt.sign({_id:user._id},"Ankit")
    res.cookie("val",token,{
        httpOnly:true,
        expires:new Date(Date.now()+10*60*100000),
    })
}
// User Login 
route.post("/login",async (req,res)=>{
    let user =await User.findOne({email:req.body.email});
    if(user){
        if(req.body.password===user.password){
            genCookie(user,res);
            res.redirect("/user/profile");
        }
        else{
            res.render("login",{msg:"Incorrect Password"})
        }

    }
    else{
       res.redirect("/user/signup");
    }
})

// Sign Up
route.post("/signup",async(req,res)=>{
    let user= await User.findOne({email:req.body.email});
    if(user){
        res.redirect("/user/login");
    }
    else{
        // let pas=await bcrpyt.hash(req.body.password,10);
        let user= await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
        })
       genCookie(user,res);
        res.redirect("/user/profile")
    }
    console.log(user);
})
// delete User
route.get('/logout',(req,res)=>{
    res.cookie("val","",{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    res.redirect("/");
})
export default route;