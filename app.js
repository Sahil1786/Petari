const express=require("express");
const bodyParser=require("body-parser");
const { log } = require("console");
const app =express();
const mongoose = require('mongoose');
// This is test git

mongoose.connect('mongodb://127.0.0.1:27017/UserDetails')
.then((d)=>{
    console.log("Database Connected");
})
.catch((err)=>{
    console.log(err);
})



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.set('view engine','views');
app.set('view engine','ejs');


const Messages=[];

console.log(Messages);

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
    const Message={
    Name:req.body.Fname,
    Email: req.body.Email,
    Subject:req.body.sub,
    Message:req.body.sms
    }
    Messages.push(Message);
 console.log(Messages)
 res.redirect("/");
})


app.post("/User_singUp",function(req,res){
    const userForm={
        user_name:req.body.fname,
        email:req.body.email,
        time:req.body.pickup,
        birth_date:req.body.dob,
        food_carry_date:req.body.carrydate,
        food_type:req.body.foodType,
        gender:req.body.gender,
        phone_number:req.body.phn,
        address_1:req.body.add1,
        address_2:req.body.add2,
        country:req.body.Country,
        city:req.body.city,
        district:req.body.dist,
        pin:req.body.pin,
        details_of_food:req.body.FoodDeatils

    }
    console.log(userForm);

    
  
})




app.listen( process.env.port|| 3000,function(){
    console.log("server is running on port 3000 ");
})





