const express = require("express");
const router = new express.Router();
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const {transporter} = require("../helpers/emailHelpers");

const User = require("../model/user");
const Admin = require("../model/admin");
const NGO = require("../model/ngo");
const Query = require("../model/query"); // Adjust the path based on your project structure

router.post("/NGO-login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const ngo = await NGO.findOne({ username: username, password: password });

  try {
    if (ngo) {
      //checking NGO is APPROVED or NOT
      if (ngo.approved == false) {
        res.status(500).json({ messaage: "NGO is send for approval" });
      }

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
    } else {
      res.status(404).json({ message: "NGO is not registered" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An internal server error occurred.");
  }
});

router.post("/NGO-Registarion", async (req, res) => {
  // Check if the NGO already exists
  const existingNGO = await NGO.findOne({ username: req.body.username });
  console.log("existed ngo",existingNGO);
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

    const templatePath = path.join(
      __dirname,
      "../views",
      "Email.template.handlebars"
    );
    const templateContent = fs.readFileSync(templatePath, "utf8");

    // Compile the Handlebars template with the provided context data
    const compiledHtml = Handlebars.compile(templateContent)({
      user: {
        _id: newNGO.NgoID, // Example ID
        username: newNGO.NGOName, // Example username
        email: newNGO.username, // Example email
        fname: newNGO.NGOName, // Example first name
      },
    });
    // Send an email to the admin for approval
    const mailOptions = {
      to: newNGO.username, // Admin's email address
      subject: "New NGO Registration",
      text: "A new NGO registration is pending approval. Login to the admin panel to review and approve.",
      html: compiledHtml,
      // Include any necessary information in the email body
    };
    // transporter.transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Email sent: " + info.response);
    //   }
    // });

    console.log("NGO registration request sent for approval");
    // res
    //   .status(200)
    //   .json({ message: "NGO registration request sent for approval" });
    res.render("success")
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

router.route("/forgot-password-ngo").get(async (req, res) => {
  res.render("forget-password",{role:"ngo"});
});

//send Email for the reset password
router.route("/forgot-password-ngo").post(async (req, res) => {
  const { email } = req.body;
  try {
    const ngo = await NGO.findOne({ username:email });

    if (!ngo) {
      return res.send("Ngo Not Exist");
    }

    // Generate a reset token and save it to the user
    const resetToken = jwt.sign(
      { email: ngo.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    ngo.resetTokenExpiration = Date.now() + 300000; // 5 minutes
    ngo.resetToken = resetToken;

    console.log("ngo after setting ", ngo);
    await ngo.save();

    // Send the reset link to the user via email
    const resetLink = `http://localhost:3000/reset-password-ngo?email=${encodeURIComponent(
      ngo.username
    )}&token=${encodeURIComponent(resetToken)}`; // Replace with the actual path to your logo
    console.log(resetLink);
    const mailOptions = {
      to: ngo.username,
      subject: "Password Reset",
      template: "reset-password", // Use the Handlebars template
      context: {
        ngo: {
          fname: ngo.NGOName,
          _id: ngo._id,
          username: ngo.NGOName,
          email: ngo.username,
        },
        resetLink,
      },
      attachments: [
        {
          filename: "logo.png",
          path: path.join("public", "img", "logo.png"),
          cid: "logo",
        },
      ],
    };
    console.log("Ngo email:", ngo.username);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Error sending reset email");
      }
      console.log(`Reset email sent: ${info.response}`);
      res.send("Password reset link sent successfully");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// verify Email and render reset password page
router.route("/reset-password-ngo").get(async (req, res) => {
  const { email, token } = req.query;
  try {
    const ngo = await NGO.findOne({
      username:email,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!ngo) {
      return res.status(400).send("Invalid or expired reset token");
    }

    // Verify the token
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // Process the decoded token (e.g., extract information from it)
      console.log(decodedToken);
      // Continue with the reset-password logic
      res.render("set_password", { email, token,role:"ngo" });
    } catch (error) {
      // Handle JWT verification errors
      console.error("JWT verification error:", error.message);
      // You might want to send an error response or redirect the user
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//verify the password
router.route("/reset-password-ngo").post(async (req, res) => {
  const { email, token } = req.query;
  const { newPassword } = req.body;
  // console.log(" User Info",email,token,newPassword);

  try {
    // Verify the token again
    const ngo = await NGO.findOne({
      username:email,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!ngo) {
      return res.status(400).send("Invalid or expired reset token");
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // Process the decoded token (e.g., extract information from it)
      console.log(decodedToken);

      // Update the user's password and reset the resetToken fields
      const hash = await bcrypt.hash(newPassword, saltRounds);
      ngo.password = hash;
      ngo.resetToken = null;
      ngo.resetTokenExpiration = null;
      await ngo.save();

      const dooner = await User.find(); 
      
      return res.render("NGO-DashBoard", {
        fullName: ngo.NGOName,
        email: ngo.username,
        id: ngo.NGOID,
        phoneNo: ngo.Mobile,
        address: ngo.NGOLocation,
        Donation: dooner,
        Pickup: dooner,
        complain: "",
      });

      // Redirect to login page or any other desired page
    } catch (error) {
      // Handle JWT verification errors
      console.error("JWT verification error:", error.message);
      // You might want to send an error response or redirect the user
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
