const express = require("express");
const router = new express.Router();
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const transporter = require("../helpers/emailHelpers");

const User = require("../model/user");
const Admin = require("../model/admin");
const NGO = require("../model/ngo");
const Query = require("../model/query"); // Adjust the path based on your project structure

//Added some error handling in ngo login
router.post("/NGO-login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const ngo = await NGO.findOne({ username: username, password: password });
        if (!ngo) {
            return res.status(400).json({ error: 'NGO not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, ngo.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const dooner = await User.find(); // Assuming User is your Mongoose model for users
        res.render("NGO-Dashboard", {
            fullName: ngo.NGOName,
            email: ngo.username,
            id: ngo.NgoID,  //corrected the id fetch from database
            phoneNo: ngo.Mobile,
            address: ngo.NgoLocation,
            Donation: dooner,
            Pickup: dooner,
            complain: ""
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("An internal server error occurred.");
    }
});

router.post("/NGO-Registration", async (req, res) => {
    try {
        // Check if the NGO already exists
        const existingNGO = await NGO.findOne({ username: req.body.username });
        if (existingNGO) {
            return res.status(400).json({ error: 'NGO already exists' });
        }
        
        // Hash the password for security
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create a new NGO registration
        const newNGO = new NGO({
            username: req.body.username,
            password: hashedPassword, // Save the hashed password
            NGOName: req.body.NGOName,
            Mobile: req.body.Mobile,
            NgoID: req.body.NgoID,
            NgoLocation: req.body.NgoLocation,
            approved: false
        });

        // Save the new NGO to the database
        await newNGO.save();

        const templatePath = path.join(__dirname, '../views', 'Email.template.handlebars');
        const templateContent = fs.readFileSync(templatePath, 'utf8');

        // Compile the Handlebars template with the provided context data
        const compiledHtml = Handlebars.compile(templateContent)({
            user: {
              _id: newNGO.NgoID, // Example ID
              username: newNGO.NGOName, // Example username
              email: newNGO.username, // Example email
              fname: newNGO.NGOName // Example first name
            }
          });
          // Send an email to the admin for approval
          const mailOptions = {
            to: newNGO.username, // Admin's email address
            subject: "New NGO Registration",
            text: "A new NGO registration is pending approval. Login to the admin panel to review and approve.",
            html: compiledHtml
            // Include any necessary information in the email body
          };
          transporter.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          console.log('NGO registration request sent for approval');
          res.status(200).json({ message: 'NGO registration request sent for approval' });
      } catch (err) {
          console.error('Error creating NGO:', err);
          res.status(500).json({ error: 'Internal server error' });
      }
  });

  module.exports = router;

