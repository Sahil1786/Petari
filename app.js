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
fullName:String,

address:String,
Mobile:Number,
dob:String,
gender :{
  type:String,
  enum: ['opt1', 'opt2', 'opt3'],
},
    googleId:String,
    profile:String,


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



 app.post("/", async function (req, res) {
    try {
      const newQuery = new Query({
        name: req.body.Fname,
        email: req.body.Email,
        subject: req.body.sub,
        message: req.body.sms,
      });
  
      await newQuery.save();
  
      res.send("Successfully Received Message... Thank You!");
      console.log(newQuery);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });



                                                       // user Registration

app.post("/User_singUp", async function (req, res) {
    const { username } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email: username }).exec();

        if (existingUser) {
            // Email already exists, handle accordingly (e.g., show an error message)
            return res.render("registrationError", { message: 'Email is already registered' });
        }

        // Email does not exist, proceed with user registration
        const hash = await bcrypt.hash(req.body.password, saltRounds);

        const newUser = new User({
            fullName: req.body.fname,
            Mobile: req.body.phn,
            address: req.body.address,
            dob: req.body.dob,
            gender: req.body.gender,
            email: username,
            password: hash
        });

        await newUser.save();

        return res.render("UserDashBoard", {
            fullName: req.body.fname,
            email: username,
            phoneNo: req.body.phn,
            address: req.body.address
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).send('Internal Server Error');
    }
});
app.post("/User_singUp", async function (req, res) {
  const { username } = req.body;

  try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email: username }).exec();

      if (existingUser) {
          // Email already exists, handle accordingly (e.g., show an error message)
          return res.status(400).send('Email already registered');
      }

      // Email does not exist, proceed with user registration
      const hash = await bcrypt.hash(req.body.password, saltRounds);

      const newUser = new User({
          fullName: req.body.fname,
          Mobile: req.body.phn,
          address: req.body.address,
          dob: req.body.dob,
          gender: req.body.gender,
          email: username,
          password: hash
      });

      await newUser.save();

      return res.render("UserDashBoard", {
          fullName: req.body.fname,
          email: username,
          phoneNo: req.body.phn,
          address: req.body.address
      });
  } catch (error) {
      console.error('Error during user registration:', error);
      return res.status(500).send('Internal Server Error');
  }
});






                                                               //  user login

app.post("/login",function(req,res){
    const user = new User({
       username:req.body.username,
       password:req.body.password
     });
     req.login(user,function(err){
       if(err){
           console.log(err);
   
       }else{
           passport.authenticate("local")(req,res,function(){   //if varify
               res.redirect("/UserDash");
           });
       }
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





