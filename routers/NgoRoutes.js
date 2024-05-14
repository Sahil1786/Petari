const express = require("express");
const router = new express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const transporter = require("../helpers/emailHelpers");

const User = require("../model/user");
const Admin = require("../model/admin");
const NGO = require("../model/ngo");
const Query = require("../model/query"); // Adjust the path based on your project structure

router.post("/NGO-login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const ngo = await NGO.findOne({ username: username, password: password });
  try {
    const dooner = await User.find(); // Assuming User is your Mongoose model for users

    res.render("NGO-Dashboard", {
      fullName: ngo.NGOName,
      email: ngo.username,
      id: ngo.NGOID,
      phoneNo: ngo.Mobile,
      address: ngo.NGOLocation,
      Donation: dooner,
      Pickup: dooner,
      complain: "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An internal server error occurred.");
  }
});

router.post("/NGO-Registarion", async (req, res) => {
  // Check if the NGO already exists
  const existingNGO = await NGO.findOne({ username: req.body.username });
  if (existingNGO) {
    return res.status(400).json({ error: "NGO already exists" });
  }

  // Create a new NGO registration
  const newNGO = new NGO({
    username: req.body.username,
    password: req.body.password,
    NGOName: req.body.NgoName,
    Mobile: req.body.Mobile,
    NgoID: req.body.NgoID,
    NgoLocation: req.body.NgoLocation,
    approved: false,
  });
  // Save the new NGO to the database

  try {
    // Save the new NGO to the database
    await newNGO.save();

    // Send an email to the admin for approval
    let mailOptions = {
      to: newNGO.username, // Admin's email address
      subject: "New NGO Registration",
      text: "A new NGO registration is pending approval. Login to the admin panel to review and approve.",
      // Include any necessary information in the email body
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    console.log("NGO registration request sent for approval");
    res
      .status(200)
      .json({ message: "NGO registration request sent for approval" });
  } catch (err) {
    console.error("Error creating NGO:", err);
    res.status(500).json({ error: "Internal server error" });
  }
  // try {
  //     await newNGO.save();

  //     let mailOptions = {
  //         to: newNGO.username,
  //         subject: 'Welcome To Petari',
  //         template: 'Email.template',
  //         context: {
  //             ngo: {
  //                 ngoName: newNGO.name,
  //                 _id: newNGO._id,
  //                 username: newNGO.password,
  //             },
  //             year: new Date().getFullYear()
  //         },
  //         attachments: [{
  //             filename: 'logo.png',
  //             path: path.join(__dirname, 'public', 'img', 'logo.png'),
  //             cid: 'logo'
  //         }]
  //     };

  //     transporter.sendMail(mailOptions, function(error, info){
  //         if (error) {
  //             console.log(error);
  //         } else {
  //             console.log('Email sent: ' + info.response);
  //         }
  //     });

  //     console.log('NGO registered successfully');
  //     res.status(200).json({ message: 'NGO registration received. It will be reviewed by the admin.' });
  // } catch (err) {
  //     console.error('Error creating NGO:', err);
  //     res.status(500).json({ error: 'Internal server error' });
  // }
  // newNGO.save()
  // .then((ngo) => {
  //     let mailOptions = {
  //         to: ngo.username,
  //         subject: 'Welcome To Petari',
  //         template: 'Email.template',
  //         context: {
  //             ngo: {
  //                 ngoName: ngo.name,
  //                 _id: ngo._id,
  //                 username: ngo.password,

  //             },

  //             year: new Date().getFullYear()
  //         },
  //         attachments: [{
  //             filename: 'logo.png',
  //             path: path.join(__dirname, 'public', 'img', 'logo.png'),
  //             cid: 'logo'
  //         }]
  //     };
  //     transporter.sendMail(mailOptions, function(error, info){
  //         if (error) {
  //             console.log(error);
  //         } else {
  //             console.log('Email sent: ' + info.response);
  //         }
  //     });

  //     console.log('NGO registered successfully');
  //     res.status(200).json({ message: 'NGO registered successfully' });

  // })
  // .catch((err) => {
  //     console.error('Error creating NGO:', err);
  //     res.status(500).json({ error: 'Internal server error' });
  // });
});

module.exports = router;
