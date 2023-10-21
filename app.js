require('dotenv').config();

const express=require("express");
const bodyParser=require("body-parser");
const { log } = require("console");
const app =express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport=require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const  findOrCreate = require('mongoose-findorcreate');







app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  
  }));



app.set('view engine','views');
app.set('view engine','ejs');



mongoose.connect('mongodb://127.0.0.1:27017/UserDB07')
.then((d)=>{
    console.log("Database Connected");
})
.catch((err)=>{
    console.log(err.Message);
})

app.use(passport.initialize());
  app.use(passport.session());

const userSchema=new mongoose.Schema({
    Fullname:String,
    email:String,
    password:String,
    Address:String,
    mobile:Number,
    Dob:Number,
    Gender :String,

});

userSchema.plugin(passportLocalMongoose);
  userSchema.plugin(findOrCreate);


  const User=new mongoose.model("User",userSchema);


  passport.use(User.createStrategy());














app.get("/",function(req,res){
    res.render("index");
   
});

app.get("/user_login",function(req,res){
   res.render("user_login");
});


app.get("/Ngo_login",function(req,res){
    res.render("NGO_login")
});

app.get("/admin_login",function(req,res){
    res.render("admin_login")
});

app.get("/User_singUp",function(req,res){
    res.render("User_singUp");
    res.redirect("/success");
   
});


app.get("/success",function(req,res){
    res.render("success");
   
})





app.post("/",function(req,res){
 
})


app.post("/User_singUp",function(req,res){
  
   User.register({username:req.body.email},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/User_singUp");
        }else{
            passport.authenticate("local")(req,res,function(){   //if varify
                res.redirect("/");
            })
        }
    })

    
  
})




app.listen( process.env.port|| 3000,function(){
    console.log("server is running on port 3000 ");
})





