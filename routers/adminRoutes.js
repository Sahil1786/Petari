const express = require("express");
const router = new express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const Mailgen = require("mailgen");

const User = require("../model/user");
const Admin = require("../model/admin");
const NGO = require("../model/ngo");
const Query = require("../model/query"); // Adjust the path based on your project structure
const problem = require("../model/query");

const { transporter } = require("../helpers/emailHelpers");
const nodemailer = require("nodemailer");

const ad = Admin({
  username: "sahilkaitha@gmail.com",
  password: "123",
  fullName: "Sahil Hossain",
  Mobile: "9635955320",
});
ad.save();

router.post("/admin-login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const admin = await Admin.findOne({ username: username, password: password });
  console.log(admin);
  try {
    const dooner = await User.find(); // Assuming User is your Mongoose model for users
    const ngo = await NGO.find();

    const query1 = await problem.find({ answere: { $exists: false } });
    res.render("Admin_Dashboard", {
      name: admin.fullName,
      email: admin.fullName,
      mobile: admin.Mobile,
      username: admin.username,
      id: admin._id,
      NGOname: ngo,
      Donername: dooner,
      UserName: "sahil114",
      complain: query1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An internal server error occurred.");
  }
});

router.get("/admin-logout", function (req, res) {
  return res.redirect("/");
});

router.get("/Ngo-Registration", async (req, res) => {
  res.render("NGO-Registration");
});

// Assume you have a route for rendering the admin dashboard
// Assuming `pendingNGOs` is an array of pending NGOs
router.get("/admin-dashboard", async function (req, res) {
  try {
    const pendingNGOs = await NGO.find({ status: "pending" });
    res.render("admin_dashboard", { pendingNGOs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/approve-ngo/:id/:userId", async (req, res) => {
  console.log("approve ngo call");
  const ngoId = req.params.id;
  const userId = req.params.userId;
  try {
    const ngo1 = await NGO.findById(ngoId);
    if (!ngo1) {
      return res.status(404).json({ error: "NGO not found" });
    }

    // Update the NGO's approval status

    ngo1.approved = true;
    await ngo1.save();

    // Send an email to the NGO with the approved details

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.mail_id,
        pass: process.env.pass_id,
      },
    });

    let mailOptions = {
      to: ngo1.username,
      subject: "NGO Registration Approved",
      text: "Your NGO registration has been approved. You can now login to your account.",
      // Include any necessary information in the email body
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // navigating to the admin dashboard
    const admin = await Admin.findById(userId);
    console.log("admin details in approve-ngo", admin);
    const dooner = await User.find(); // Assuming User is your Mongoose model for users
    const ngo = await NGO.find();

    const query1 = await problem.find({ answere: { $exists: false } });
    res.render("Admin_Dashboard", {
      name: admin.fullName,
      email: admin.fullName,
      mobile: admin.Mobile,
      username: admin.username,
      id: admin._id,
      NGOname: ngo,
      Donername: dooner,
      UserName: "sahil114",
      complain: query1,
    });
  } catch (error) {
    console.error("Error approving NGO:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//making POST request for decline ngo
router.post("/decline-ngo/:id/:userId", async (req, res) => {
  const ngoId = req.params.id;
  const userId = req.params.userId;
  try {
    const ngo1 = await NGO.findById(ngoId);
    if (!ngo1) {
      return res.status(404).json({ error: "NGO not found" });
    }

    //DELETING NGO from database
    await NGO.findByIdAndDelete(ngoId);

    // navigating to the admin dashboard
    const admin = await Admin.findById(userId);
    console.log("admin details in approve-ngo", admin);
    const dooner = await User.find(); // Assuming User is your Mongoose model for users
    const ngo = await NGO.find();

    const query1 = await problem.find({ answere: { $exists: false } });
    res.render("Admin_Dashboard", {
      name: admin.fullName,
      email: admin.fullName,
      mobile: admin.Mobile,
      username: admin.username,
      id: admin._id,
      NGOname: ngo,
      Donername: dooner,
      UserName: "sahil114",
      complain: query1,
    });
  } catch (error) {
    console.error("Error declining NGO:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// making POST method for declining the DONOR request
router.post("/decline-donor/:id/:userId", async (req, res) => {
  const donorId = req.params.id;
  const userId = req.params.userId;
  try {
    const donor = await User.findById(donorId);
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    //DELETING donor request from data base
    await User.findByIdAndDelete(donorId);

    // navigating to the admin dashboard
    const admin = await Admin.findById(userId);
    console.log("admin details in approve-ngo", admin);
    const dooner = await User.find(); // Assuming User is your Mongoose model for users
    const ngo = await NGO.find();

    const query1 = await problem.find({ answere: { $exists: false } });
    res.render("Admin_Dashboard", {
      name: admin.fullName,
      email: admin.fullName,
      mobile: admin.Mobile,
      username: admin.username,
      id: admin._id,
      NGOname: ngo,
      Donername: dooner,
      UserName: "sahil114",
      complain: query1,
    });
  } catch (error) {
    console.error("Error declining doner:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// making POST method for acceptiog the DONOR request
router.post("/accept-donor/:id/:userId", async (req, res) => {
  const donorId = req.params.id;
  const userId = req.params.userId;
  try {
    const donor = await User.findById(donorId);
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    //ACCEPTING donor request from data base
    donor.approved = true;
    await donor.save();

    // navigating to the admin dashboard
    const admin = await Admin.findById(userId);
    console.log("admin details in approve-ngo", admin);
    const dooner = await User.find(); // Assuming User is your Mongoose model for users
    const ngo = await NGO.find();

    const query1 = await problem.find({ answere: { $exists: false } });
    res.render("Admin_Dashboard", {
      name: admin.fullName,
      email: admin.fullName,
      mobile: admin.Mobile,
      username: admin.username,
      id: admin._id,
      NGOname: ngo,
      Donername: dooner,
      UserName: "sahil114",
      complain: query1,
    });
  } catch (error) {
    console.error("Error declining doner:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//making DELETE method for DELETING the complaints
router.post("/delete-complain/:id/:userId", async (req, res) => {
  const compId = req.params.id;
  const userId = req.params.userId;
  const comp = await problem.findById(compId);
  if (!comp) {
    return res.status(404).json({ error: "Complain not found" });
  }
  try {
    //DELETING the complain from data base
    await problem.findByIdAndDelete(compId);

    // navigating to the admin dashboard
    const admin = await Admin.findById(userId);
    console.log("admin details in approve-ngo", admin);
    const dooner = await User.find(); // Assuming User is your Mongoose model for users
    const ngo = await NGO.find();

    const query1 = await problem.find({ answere: { $exists: false } });
    res.render("Admin_Dashboard", {
      name: admin.fullName,
      email: admin.fullName,
      mobile: admin.Mobile,
      username: admin.username,
      id: admin._id,
      NGOname: ngo,
      Donername: dooner,
      UserName: "sahil114",
      complain: query1,
    });
  } catch (error) {
    res.status(500).jso({ error: "Internal server error" });
  }
});

//making POST method for accepting the complaints
router.post("/accept-complain/:id/:userId", async (req, res) => {
  const compId = req.params.id;
  const userId = req.params.userId;
  const comp = await problem.findById(compId);
  if (!comp) {
    return res.status(404).json({ error: "Complain not found" });
  }
  try {
    //ACCEPTING the complain from data base
    comp.approved = true;
    await comp.save();

    // navigating to the admin dashboard
    const admin = await Admin.findById(userId);
    console.log("admin details in approve-ngo", admin);
    const dooner = await User.find(); // Assuming User is your Mongoose model for users
    const ngo = await NGO.find();

    const query1 = await problem.find({ answere: { $exists: false } });
    res.render("Admin_Dashboard", {
      name: admin.fullName,
      email: admin.fullName,
      mobile: admin.Mobile,
      username: admin.username,
      id: admin._id,
      NGOname: ngo,
      Donername: dooner,
      UserName: "sahil114",
      complain: query1,
    });
  } catch (error) {
    res.status(500).jso({ error: "Internal server error" });
  }
});

//making a POST method for RESPONDE to email
router.post("/complains-response/:email/:userId/:id", async (req, res) => {
  const email = req.params.email;
  const answere = req.body.answere;
  const userId = req.params.userId;
  const compId = req.params.id;

  try {
    //checking user EXIST or NOT
    const userExist = await User.findOne({ email });
    if (userExist) {
      const complaint = await Query.findByIdAndUpdate(compId, {
        answere,
      });
    } else {
      //sending email to the COMPLAIN email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.mail_id,
          pass: process.env.pass_id,
        },
      });
      let MailGenerator = new Mailgen({
        theme: "default",
        product: {
          name: "PETARI",
          link: "https://mailgen.js",
        },
      });
      let response = {
        body: {
          name: "",
          intro: "Welcome to PETARI! We're very excited to have you on board.",
          action: {
            instructions: answere,
            button: {
              color: "#22BC66", // Optional action button color
              text: "Have a good day",
              link: "",
            },
          },
          outro: "Thankyou for a part of PETARI",
        },
      };
      let mail = MailGenerator.generate(response);
      let message = {
        to: email,
        subject: "Petari Support team",
        html: mail,
      };
      transporter
        .sendMail(message)
        .then(() => {
          console.log("email is send successfully");
        })
        .catch((error) => {
          console.log("Email is not send", error);
        });

      //DELETING complain after response because user does not exist
      await Query.findByIdAndDelete(compId);
    }

    const admin = await Admin.findById(userId);
    console.log("admin details in approve-ngo", admin);
    const dooner = await User.find(); // Assuming User is your Mongoose model for users
    const ngo = await NGO.find();

    const query1 = await problem.find({ answere: { $exists: false } });
    res.render("Admin_Dashboard", {
      name: admin.fullName,
      email: admin.fullName,
      mobile: admin.Mobile,
      username: admin.username,
      id: admin._id,
      NGOname: ngo,
      Donername: dooner,
      UserName: "sahil114",
      complain: query1,
    });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
