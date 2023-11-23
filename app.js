require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const nodemailer = require("nodemailer");
const moment = require('moment');
const hbs = require('nodemailer-express-handlebars');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

app.set('view engine', 'ejs');



const transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
    
      user: process.env.mail_id,
      pass: process.env.pass_id
    },
  });



  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: ".handlebars",
  }

  transporter.use('compile', hbs(handlebarOptions));

  transporter.verify().then(console.log).catch(console.error);
  
  app.locals.moment = moment;
  











mongoose.connect('mongodb://127.0.0.1:27017/PetariDB')
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log(err.message);
    });

app.use(passport.initialize());
app.use(passport.session());

const indexQuerySchema = mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     unique: true,
    //     required: true,
    // },
    email: String,
    password: String,
    fullName: String,
    address: String,
    Mobile: Number,
    dob: String,
    gender: {
        type: String,
        enum: ['opt1', 'opt2', 'opt3'],
    },
    googleId: String,
    profile: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const Query = new mongoose.model("Query", indexQuerySchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, { id: user.id });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});


passport.use(new GoogleStrategy({
    clientID:process.env.Clint_ID,
    clientSecret: process.env.Clint_Secret,
    callbackURL: "http://localhost:3000/auth/google/UserDash",
    passReqToCallback   : true,
    scope:
    [ 'email', 'profile' ]
  },
  function(request, accessToken, username,refreshToken, profile, done) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));


// ... rest of the code

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/auth/google",
    passport.authenticate('google', { scope: ['email', 'profile'] }
    ));

app.get("/auth/google/UserDash",
    passport.authenticate('google', {
        successRedirect: '/UserDash',
        failureRedirect: '/user_login'
    }));


app.get("/user_login", function (req, res) {
    res.render("user_login");
});

app.get("/forgot-pass",((req,res)=>{
res.render("forget.password")
}))

app.get("/Ngo_login", function (req, res) {
    res.render("NGO_login");
});

app.get("/admin_login", function (req, res) {
    res.render("admin_login");
});

app.get("/User_singUp", function (req, res) {
    res.render("User_singUp");
});

app.get("/success", function (req, res) {
    res.render("success");
});

app.get("/UserDash", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("UserDashBoard", {
            fullName: req.user.fullName, // Change this to the correct property name
            email: req.user.email, // Add other necessary properties
            phoneNo: req.user.Mobile,
            address: req.user.address,
            profile: req.user.profile, // Add this line to pass the profile
        });
    } else {
        res.redirect("/user_login");
    }
});

app.post("/", async function (req, res) {
    try {
        const newQuery = new Query({
            name: req.body.Fname,
            email: req.body.Email,
            subject: req.body.sub,
            message: req.body.sms,
        });

        await newQuery.save();

        res.status(200).send("Successfully Received Message... Thank You!");
        console.log(newQuery);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// user Registration
// user Registration

// for mail perpose:






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
            username: username,
            fullName: req.body.fname,
            Mobile: req.body.phn,
            address: req.body.address,
            dob: req.body.dob,
            gender: req.body.gender,
            email: username,
            password: hash
        });

        await newUser.save()
        .then((user) => {
            let mailOptions = {
                to: user.email,
                subject: 'Welcome To Petari',
                template: 'Email.template',
                context: {
                    user: {
                        fname: user.fullName,
                        _id: user._id,
                        username: user.username,
                        email: user.email
                    },
                    year: new Date().getFullYear()
                },
                attachments: [{
                    filename: 'logo.png',
                    path: path.join(__dirname, 'public', 'img', 'logo.png'),
                    cid: 'logo'
                }]
            };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
    
        })
 
        return res.render("UserDashBoard", {
            fullName: req.body.fname,
            email: username,
            phoneNo: req.body.phn,
            address: req.body.address
            // Do not include 'profile' here unless it's relevant to registration
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).send('Internal Server Error');
    }
});


// user login
app.post("/login", function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                // if verify
                res.redirect("/UserDash");
            });
        }
    });
});

app.get("/logout", function (req, res) {
    req.logout((err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/");
});

// server rendering

                //    server rendiring

                app.listen( process.env.port|| 3000,function(){
                  console.log("server is running on port 3000 ");
              });