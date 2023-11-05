require('dotenv').config();

const express=require("express");
const bodyParser=require("body-parser");
const { log, error } = require("console");
const app =express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport=require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const  findOrCreate = require('mongoose-findorcreate');
const bcrypt= require('bcrypt');
const saltRounds=10;
 


// const { stringify } = require('querystring');








app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  
  }));



app.set('view engine','views');
app.set('view engine','ejs');



mongoose.connect('mongodb://127.0.0.1:27017/PetariDB')
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
    // Fullname:String,
    email:String,
    password:String,

    googleId:String,

    // Address:String,
    // mobile:Number,
    // Dob:Number,
    // Gender :String,

});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);



// mongose model

  const User=new mongoose.model("User",userSchema);
  const Query=new mongoose.model("Query",indexQuerySchema);


  passport.use(User.createStrategy());

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });


// google auth Registration



passport.use(new GoogleStrategy({
    clientID:process.env.Clint_ID,
    clientSecret: process.env.Clint_Secret,
    callbackURL: "http://localhost:3000/auth/google/UserDash",
    passReqToCallback   : true,
    scope:
    [ 'email', 'profile' ]
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));









app.get("/",function(req,res){
    res.render("index");
   
});

app.get("/auth/google",
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));




app.get( "/auth/google/UserDash",
    passport.authenticate( 'google', {
        successRedirect: '/UserDash',
        failureRedirect: '/user_login'
}));


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
    // res.redirect("/success");
   
});


app.get("/success",function(req,res){
    res.render("success");
   
})
 app.get("/UserDash",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("UserDashBoard");
    }else{
        res.redirect("/user_login")
    }

  
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

                                                       // user Registration
app.post("/User_singUp",function(req,res){
  
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser=new User({
            email:req.body.email,
            password:hash
        });
        console.log(newUser);
        newUser.save().then(()=>{
           res.render("UserDashBoard");

        }).catch(err=>{
            console.log(err);
        });
    });


});

                                                               //  user login

app.post("/login",function(req,res){
    // const user = new User({
    //    username:req.body.email,
    //    password:req.body.password
    //  });
    //  req.login(user,function(err){
    //    if(err){
    //        console.log(err);
    //    }else{
    //        passport.authenticate("local")(req,res,function(){   //if varify
    //            res.redirect("/");
    //        });
    //    }
    //  });

       const username=req.body.email;
    const password=req.body.password;
    
    
    User.findOne({email:username}).then((foundUser)=>{
        if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(result=== true){
                    res.render("UserDashBoard");
            
                }
    
            });
              
        }
    })
    .catch((err)=>{
        console.log(err);
    });
  
   });



   app.get("/logout", function(req,res){
    req.logout((err)=>{
if(err){
    console.log(err);
}
    });
    res.redirect("/");

})

   

                //    server rendiring

app.listen( process.env.port|| 3000,function(){
    console.log("server is running on port 3000 ");
})





