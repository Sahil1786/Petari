require('dotenv').config();

const express=require("express");
const bodyParser=require("body-parser");
const { log, error } = require("console");
const app =express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport=require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const  findOrCreate = require('mongoose-findorcreate');

const bcrypt= require('bcrypt');
const { stringify } = require('querystring');
const saltRounds=30;







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

//schema

const indexQuerySchema=mongoose.Schema({
    // name:{
    //     type:String,
    //     required:true
    // },
    // emailId:{
    //     type:String,
    //     required:true
    // },
    // Subject:{
    //     type:String,
    //     required:true
    // },
    // Message:{
    //     type:String,
    //     required:true
    // }
    name:String,
    email:String,
    subject:String,
    message:String


},{timestamps: true})


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



// mongose model

  const User=new mongoose.model("User",userSchema);
  const Query=new mongoose.model("Query",indexQuerySchema);



  passport.use(User.createStrategy());


  passport.serializeUser(function(User, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: User.id,
        username: User.email,
        picture: User.picture
      });
    });
  });
  
  passport.deserializeUser(function(User, cb) {
    process.nextTick(function() {
      return cb(null, User);
    });
  });











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
 app.get("/try",(req,res)=>{
    res.render("UserDashBoard");
 })




app.post("/",function(req,res){
   
    const newQurey= new Query({
        name:req.body.Fname,
        email:req.body.Email,
        subject:req.body.sub,
        message:req.body.sms
    });
    
    newQurey.save().then(()=>{
               res.send("Sucessfully Recived Meassage ...Thank You!");

            ///have to check leatter sahil;
          
            //    res. redirect("/");
           
               console.log(newQurey)
            }).catch(err=>{
                console.log(err);
            });
        
})


app.post("/User_singUp",function(req,res){
  

    User.register({username:req.body.email},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/User_singUp");
        }else{
            passport.authenticate("local")(req,res,function(){   //if varify
                res.redirect("/try");
            })
        }
    })




//    User.register({username:req.body.email},req.body.password,function(err,user){
//         if(err){
//             console.log(err);
//             res.redirect("/User_singUp");
//         }else{
//             passport.authenticate("local")(req,res,function(){   //if varify
//                 res.redirect("UserDashBoard");
//             })
//         }
//     })

// bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//     const newUser=new User({
//         fullNmae:req.body.fname,
//         email:req.body.email,
//         password:hash,
        
//         // Address:req.body.address,
//         // mob:req.body.mob,
//         // dob:req.body.dob
//     });
//     console.log(newUser);
//     newUser.save().then(()=>{
//        res.render("/");
//     }).catch(err=>{
//         console.log(err);
//     });
// });
    
  


});



app.post("/login",function(req,res){
    const user = new User({
       username:req.body.email,
       password:req.body.password
     });
     req.login(user,function(err){
       if(err){
           console.log(err);
       }else{
           passport.authenticate("local")(req,res,function(){   //if varify
               res.redirect("/");
           });
       }
     });

       const username=req.body.email;
    const password=req.body.password;
    
    
    User.findOne({email:username}).then((foundUser)=>{
        if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(result=== true){
                    res.render("/");
            
                }
                // else{
                //     res.render("User_singUp");
                // }
            });
              
        }
    })
    .catch((err)=>{
        console.log(err);
    });
  
   });
   



app.listen( process.env.port|| 3000,function(){
    console.log("server is running on port 3000 ");
})





