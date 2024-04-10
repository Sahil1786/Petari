// require('dotenv').config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require('path');
// const app = express();
// const mongoose = require('mongoose');
// const session = require('express-session');
// const passport = require("passport");
// const passportLocalMongoose = require('passport-local-mongoose');
// const GoogleStrategy = require('passport-google-oauth2').Strategy;
// const findOrCreate = require('mongoose-findorcreate');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// const nodemailer = require("nodemailer");
// const moment = require('moment');
// const hbs = require('nodemailer-express-handlebars');

// const jwt = require("jsonwebtoken");
// const flash = require('express-flash');

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
// }));

// app.use(flash());

// app.set('view engine', 'ejs');


// const transporter = nodemailer.createTransport({
//     service:'gmail',
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
    
//       user: process.env.mail_id,
//       pass: process.env.pass_id
//     },
//   });



//   const handlebarOptions = {
//     viewEngine: {
//       extName: ".handlebars",
//       partialsDir: path.resolve('./views'),
//       defaultLayout: false,
//     },
//     viewPath: path.resolve('./views'),
//     extName: ".handlebars",
//   }

//   transporter.use('compile', hbs(handlebarOptions));

//   transporter.verify().then(console.log).catch(console.error);
  
//   app.locals.moment = moment;
  



// mongoose.connect('mongodb://127.0.0.1:27017/PetariDB')
//     .then(() => {
//         console.log("Database Connected");
//     })
//     .catch((err) => {
//         console.log(err.message);
//     });

// app.use(passport.initialize());
// app.use(passport.session());

// const indexQuerySchema = mongoose.Schema({
//     name: String,
//     email: String,
//     subject: String,
//     message: String
// }, { timestamps: true });

// const userSchema = new mongoose.Schema({
//     // username: {
//     //     type: String,
//     //     unique: true,
//     //     required: true,
//     // },
//     email: String,
//     password: String,
//     fullName: String,
//     address: String,
//     Mobile: Number,
//     dob: String,
//     gender: {
//         type: String,
//         enum: ['opt1', 'opt2', 'opt3'],
//     },
//     googleId: String,
//     profile: String,
// });



// userSchema.methods.generateAccessToken = function () {
//     try {
//         if (!process.env.ACCESS_TOKEN_SECRET) {
//             throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
//         }
//         const accessToken = jwt.sign(
//             {
//                 _id: this._id,
//                 email: this.email,
//                 fullName: this.fullName
//             },
//             process.env.ACCESS_TOKEN_SECRET.trim(), // Trim any potential leading/trailing spaces
//             {
//                 expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//             }
//         );
//         console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);
//         return accessToken;
//     } catch (error) {
//         console.error('Error generating access token:', error);
//         throw error;
//     }
// };

// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

// const User = new mongoose.model("User", userSchema);
// const Query = new mongoose.model("Query", indexQuerySchema);

// passport.use(User.createStrategy());

// passport.serializeUser(function (user, cb) {
//     process.nextTick(function () {
//         return cb(null, { id: user.id });
//     });
// });

// passport.deserializeUser(function (user, cb) {
//     process.nextTick(function () {
//         return cb(null, user);
//     });
// });


// passport.use(new GoogleStrategy({
//     clientID:process.env.Clint_ID,
//     clientSecret: process.env.Clint_Secret,
//     callbackURL: "http://localhost:3000/auth/google/UserDash",
//     passReqToCallback   : true,
//     scope:
//     [ 'email', 'profile' ]
//   },
//   function(request, accessToken, username,refreshToken, profile, done) {
//     console.log(profile);
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));


// // ... rest of the code

// app.get("/", function (req, res) {
//     res.render("index");
// });

// app.get("/auth/google",
//     passport.authenticate('google', { scope: ['email', 'profile'] }
//     ));

// app.get("/auth/google/UserDash",
//     passport.authenticate('google', {
//         successRedirect: '/UserDash',
//         failureRedirect: '/user_login'
//     }));


// app.get("/user_login", function (req, res) {
//     res.render("user_login");
// });



// app.get("/Ngo_login", function (req, res) {
//     res.render("NGO_login");
// });

// app.get("/admin_login", function (req, res) {
//     res.render("admin_login");
// });

// app.get("/User_singUp", function (req, res) {
//     res.render("User_singUp");
// });

// app.get("/success", function (req, res) {
//     res.render("success");
// });

// app.get("/UserDash", (req, res) => {
//     if (req.isAuthenticated()) {
//         res.render("UserDashBoard", {
//             fullName: req.user.fullName, // Change this to the correct property name
//             email: req.user.email, // Add other necessary properties
//             phoneNo: req.user.Mobile,
//             address: req.user.address,
//             profile: req.user.profile, // Add this line to pass the profile
//         });
//     } else {
//         res.redirect("/user_login");
//     }
// });

// app.post("/", async function (req, res) {
//     try {
//         const newQuery = new Query({
//             name: req.body.Fname,
//             email: req.body.Email,
//             subject: req.body.sub,
//             message: req.body.sms,
//         });

//         await newQuery.save();

//         res.status(200).send("Successfully Received Message... Thank You!");
//         console.log(newQuery);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// // user Registration








// // user Registration
// app.post("/User_singUp", async function (req, res) {
//     const { username } = req.body;

//     try {
//         // Check if the email already exists
//         const existingUser = await User.findOne({ email: username }).exec();

//         if (existingUser) {
//             // Email already exists, handle accordingly (e.g., show an error message)
//             return res.render("registrationError", { message: 'Email is already registered' });
//         }

//         // Email does not exist, proceed with user registration
//         const hash = await bcrypt.hash(req.body.password, saltRounds);

//         const newUser = new User({
//             username: username,
//             fullName: req.body.fname,
//             Mobile: req.body.phn,
//             address: req.body.address,
//             dob: req.body.dob,
//             gender: req.body.gender,
//             email: username,
//             password: hash
//         });

//         await newUser.save()
//         .then((user) => {
//             let mailOptions = {
//                 to: user.email,
//                 subject: 'Welcome To Petari',
//                 template: 'Email.template',
//                 context: {
//                     user: {
//                         fname: user.fullName,
//                         _id: user._id,
//                         username: user.username,
//                         email: user.email
//                     },
//                     year: new Date().getFullYear()
//                 },
//                 attachments: [{
//                     filename: 'logo.png',
//                     path: path.join(__dirname, 'public', 'img', 'logo.png'),
//                     cid: 'logo'
//                 }]
//             };
//               transporter.sendMail(mailOptions, function(error, info){
//                 if (error) {
//                   console.log(error);
//                 } else {
//                   console.log('Email sent: ' + info.response);
//                 }
//               });
    
//         })
 
//         return res.render("UserDashBoard", {
//             fullName: req.body.fname,
//             email: username,
//             phoneNo: req.body.phn,
//             address: req.body.address
//             // Do not include 'profile' here unless it's relevant to registration
//         });
//     } catch (error) {
//         console.error('Error during user registration:', error);
//         return res.status(500).send('Internal Server Error');
//     }
// });


// // user login
// app.post("/login", function (req, res) {
//     const user = new User({
//         username: req.body.username,
//         password: req.body.password
//     });
//     req.login(user, function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             passport.authenticate("local")(req, res, function () {
//                 // if verify
//                 res.redirect("/UserDash");
//             })
            
            
//         }
        
        
//     });
    
// });
// // user login



// // app.post("/login",function(req,res){
// //     const username=req.body.username;
// //     const password=req.body.password;
    
    
// //     User.findOne({email:username}).then((foundUser)=>{
// //         if(foundUser){
// //             bcrypt.compare(password, foundUser.password, function(err, result) {
// //                 if(result=== true){
// //                     res.render("UserDash");
            
// //                 }
// //             });
              
// //         }
// //     })
// //     .catch((err)=>{
// //         console.log(err);
// //     });
  
// // });



// // // user login
// // app.post("/login", async function (req, res) {
// //     const username = req.body.username;
// //     const password = req.body.password;

// //     try {
// //         // Find the user by their username (email in your case)
// //         const user = await User.findOne({ email: username });

// //         if (!user) {
// //             // User not found, handle accordingly (e.g., redirect with an error message)
// //             req.flash('error', 'Invalid username or password');
// //             return res.redirect("/user_login");
// //         }

// //         // Compare the provided password with the hashed password stored in the database
// //         const result = await bcrypt.compare(password, user.password);

// //         if (result) {
// //             // Passwords match, authenticate the user
// //             req.login(user, function (err) {
// //                 if (err) {
// //                     console.error(err);
// //                     // Handle the error (e.g., redirect to an error page)
// //                     return res.redirect("/user_login");
// //                 }

// //                 // Authentication successful, redirect to UserDash
// //                 return res.redirect("/UserDash");
// //             });
// //         } else {
// //             // Passwords do not match, handle accordingly (e.g., redirect with an error message)
// //             req.flash('error', 'Invalid username or password');
// //             return res.redirect("/user_login");
// //         }
// //     } catch (error) {
// //         console.error(error);
// //         // Handle other errors (e.g., redirect to an error page)
// //         req.flash('error', 'Internal Server Error');
// //         return res.redirect("/user_login");
// //     }
// // });


// app.route("/forgot-password")
//   .get(async (req, res) => {
//     res.render("forget-password");
//   })
//   .post(async (req, res) => {
//     const { email } = req.body;
//     try {
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.send("User Not Exist");
//       }

//       // Generate a reset token and save it to the user
//       const resetToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

//       user.resetTokenExpiration = Date.now() + 300000; // 5 minutes
//       await user.save();

//       // Send the reset link to the user via email
//       const resetLink = `http://localhost:3000/reset-password?email=${encodeURIComponent(user.email)}&token=${encodeURIComponent(resetToken)}`;
//       ; // Replace with the actual path to your logo
// console.log(resetLink);
//       const mailOptions = {
//         to: user.email,
//         subject: 'Password Reset',
//         template: 'reset-password', // Use the Handlebars template
//         context: {
//           user: {
//             fname: user.fullName,
//             _id: user._id,
//             username: user.username,
//             email: user.email
            
//           },
//           resetLink,
      
//         },
//         attachments: [{
//             filename: 'logo.png',
//             path: path.join(__dirname, 'public', 'img', 'logo.png'),
//             cid: 'logo'
//         }]
        
//       };
//       console.log('User email:', user.email);

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error(error);
//           return res.status(500).send("Error sending reset email");
//         }
//         console.log(`Reset email sent: ${info.response}`);
//         res.send("Password reset link sent successfully");
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   });



//   app.route("/reset-password")
//   .get(async (req, res) => {
//     const { email, token } = req.query;

//     try {
//       const user = await User.findOne({ email, resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

//       if (!user) {
//         return res.status(400).send("Invalid or expired reset token");
//       }

//       // Verify the token
//       try {
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         // Process the decoded token (e.g., extract information from it)
//         console.log(decodedToken);
//         // Continue with the reset-password logic
//         res.render("reset-password", { email, token });
//       } catch (error) {
//         // Handle JWT verification errors
//         console.error('JWT verification error:', error.message);
//         // You might want to send an error response or redirect the user
//         res.status(401).send('Unauthorized');
//       }

//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   })
//   .post(async (req, res) => {
//     const { email, token, newPassword } = req.body;

//     try {
//       // Verify the token again
//       const user = await User.findOne({ email, resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

//       if (!user) {
//         return res.status(400).send("Invalid or expired reset token");
//       }

//       try {
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         // Process the decoded token (e.g., extract information from it)
//         console.log(decodedToken);

//         // Update the user's password and reset the resetToken fields
//         const hash = await bcrypt.hash(newPassword, saltRounds);
//         user.password = hash;
//         user.resetToken = null;
//         user.resetTokenExpiration = null;
//         await user.save();

//         res.redirect("/login"); // Redirect to login page or any other desired page
//       } catch (error) {
//         // Handle JWT verification errors
//         console.error('JWT verification error:', error.message);
//         // You might want to send an error response or redirect the user
//         res.status(401).send('Unauthorized');
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   });



// app.get("/logout", function (req, res) {
//     req.logout((err) => {
//         if (err) {
//             console.log(err);
//         }
//     });
//     res.redirect("/");
// });

// // server rendering

//                 //    server rendiring

//                 app.listen( process.env.port|| 3000,function(){
//                   console.log("server is running on port 3000 ");
//               });

// Load environment variables from a .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth2').Strategy; // Update import statement
const findOrCreate = require('mongoose-findorcreate');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const nodemailer = require('nodemailer');
const moment = require('moment');
const hbs = require('nodemailer-express-handlebars');

const jwt = require('jsonwebtoken');
const flash = require('express-flash');

// Set up Express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up Express session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());

// Set up view engine
app.set('view engine', 'ejs');

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.mail_id,
    pass: process.env.pass_id,
  },
});

// Configure nodemailer to use handlebars for email templates
const handlebarOptions = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: path.resolve('./views'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views'),
  extName: '.handlebars',
};

transporter.use('compile', hbs(handlebarOptions));

transporter.verify().then(console.log).catch(console.error);

// Set up moment.js for date formatting in views
app.locals.moment = moment;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/PetariDB')
  .then(() => {
    console.log('Database Connected');
  })
  .catch((err) => {
    console.log(err.message);
  });

// Set up Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define MongoDB schemas
const indexQuerySchema = mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
}, { timestamps: true });

const userSchema = new mongoose.Schema({
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

// Define user schema methods and plugins
userSchema.methods.generateAccessToken = function () {
  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
    }
    const accessToken = jwt.sign(
      {
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
      },
      process.env.ACCESS_TOKEN_SECRET.trim(), // Trim any potential leading/trailing spaces
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
    console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);
    return accessToken;
  } catch (error) {
    console.error('Error generating access token:', error);
    throw error;
  }
};

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);
const Query = new mongoose.model('Query', indexQuerySchema);

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
  clientID: process.env.Clint_ID,
  clientSecret: process.env.Clint_Secret,
  callbackURL: 'http://localhost:3000/auth/google/UserDash',
  passReqToCallback: true,
  scope: ['email', 'profile'],
},
function (request, accessToken, username, refreshToken, profile, done) {
  console.log(profile);
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(err, user);
  });
}));

// Routes and views

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }
  ));

app.get('/auth/google/UserDash',
  passport.authenticate('google', {
    successRedirect: '/UserDash',
    failureRedirect: '/user_login',
  }));

app.get('/user_login', function (req, res) {
  res.render('user_login');
});

app.get('/Ngo_login', function (req, res) {
  res.render('NGO_login');
});

app.get('/admin_login', function (req, res) {
  res.render('admin_login');
});

app.get('/User_singUp', function (req, res) {
  res.render('User_singUp');
});

app.get('/success', function (req, res) {
  res.render('success');
});

app.get('/UserDash', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('UserDashBoard', {
      fullName: req.user.fullName,
      email: req.user.email,
      phoneNo: req.user.Mobile,
      address: req.user.address,
      profile: req.user.profile,
    });
  } else {
    res.redirect('/user_login');
  }
});

app.get("/ast",((req,res)=>{
  res.send("h1");
}))



app.post('/', async function (req, res) {
  try {
    const newQuery = new Query({
      name: req.body.Fname,
      email: req.body.Email,
      subject: req.body.sub,
      message: req.body.sms,
    });

    await newQuery.save();

    res.status(200).send('Successfully Received Message... Thank You!');
    console.log(newQuery);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// User Registration

app.post('/User_singUp', async function (req, res) {
  const { username } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: username }).exec();

    if (existingUser) {
      // Email already exists, handle accordingly (e.g., show an error message)
      return res.render('registrationError', { message: 'Email is already registered' });
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
      password: hash,
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
              email: user.email,
            },
            year: new Date().getFullYear(),
          },
          attachments: [{
            filename: 'logo.png',
            path: path.join(__dirname, 'public', 'img', 'logo.png'),
            cid: 'logo',
          }],
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      });

    return res.render('UserDashBoard', {
      fullName: req.body.fname,
      email: username,
      phoneNo: req.body.phn,
      address: req.body.address,
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// User Login

app.post('/login', function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, function () {
        // if verify
        res.redirect('/UserDash');
      });
    }
  });
});

// Forgot Password

app.route('/forgot-password')
  .get(async (req, res) => {
    res.render('forget-password');
  })
  .post(async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.send('User Not Exist');
      }

      // Generate a reset token and save it to the user
      const resetToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      user.resetTokenExpiration = Date.now() + 300000; // 5 minutes
      await user.save();

      // Send the reset link to the user via email
      const resetLink = `http://localhost:3000/reset-password?email=${encodeURIComponent(user.email)}&token=${encodeURIComponent(resetToken)}`;
      console.log(resetLink);

      const mailOptions = {
        to: user.email,
        subject: 'Password Reset',
        template: 'reset-password', // Use the Handlebars template
        context: {
          user: {
            fname: user.fullName,
            _id: user._id,
            username: user.username,
            email: user.email,
          },
          resetLink,
        },
        attachments: [{
          filename: 'logo.png',
          path: path.join(__dirname, 'public', 'img', 'logo.png'),
          cid: 'logo',
        }],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Error sending reset email');
        }
        console.log(`Reset email sent: ${info.response}`);
        res.send('Password reset link sent successfully');
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

// Reset Password

app.route('/reset-password')
  .get(async (req, res) => {
    const { email, token } = req.query;

    try {
      const user = await User.findOne({ email, resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

      if (!user) {
        return res.status(400).send('Invalid or expired reset token');
      }

      // Verify the token
      try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Process the decoded token (e.g., extract information from it)
        console.log(decodedToken);
        // Continue with the reset-password logic
        res.render('reset-password', { email, token });
      } catch (error) {
        // Handle JWT verification errors
        console.error('JWT verification error:', error.message);
        // You might want to send an error response or redirect the user
        res.status(401).send('Unauthorized');
      }

    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  })
  .post(async (req, res) => {
    const { email, token, newPassword } = req.body;

    try {
      // Verify the token again
      const user = await User.findOne({ email, resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

      if (!user) {
        return res.status(400).send('Invalid or expired reset token');
      }

      try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Process the decoded token (e.g., extract information from it)
        console.log(decodedToken);

        // Update the user's password and reset the resetToken fields
        const hash = await bcrypt.hash(newPassword, saltRounds);
        user.password = hash;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        res.redirect('/login'); // Redirect to the login page or any other desired page
      } catch (error) {
        // Handle JWT verification errors
        console.error('JWT verification error:', error.message);
        // You might want to send an error response or redirect the user
        res.status(401).send('Unauthorized');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

app.get('/logout', function (req, res) {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect('/');
});

// Start the server
app.listen(process.env.PORT || 3000, function () {
  console.log('Server is running on port 3000');
});