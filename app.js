
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();

const moment = require('moment');
const hbs = require('nodemailer-express-handlebars');

const {transporter}=require("./helpers/emailHelpers")

const flash = require('express-flash');

const Admin=require("./model/admin")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const NGO=require("./model/ngo")
const isAdmin=require("./middleware/isAdmin");

//connecting to database
require("./db/db")

// app.use(flash());

app.set('view engine', 'ejs');


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
  
//load routers
const userRouter=require("./routers/userRoutes")
const NgoRouter=require("./routers/NgoRoutes")
const adminRouter=require("./routers/adminRoutes")

//api endpoints
app.use(userRouter)
app.use(NgoRouter)
app.use(adminRouter)



app.listen( process.env.port|| 3000,function(){
  console.log("server is running on port 3000 ");
});

// Route for policies.ejs
app.get('/policies', (req, res) => {
  res.render('policies'); // Ensure policies.ejs is in the views directory
});

app.get("/*",(req,res) =>{
  res.render("Error");
});