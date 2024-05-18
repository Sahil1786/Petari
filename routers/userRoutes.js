const express = require("express");
const router = new express.Router();
const path =require("path");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const User = require("../model/user");
const Query = require("../model/query"); // Adjust the path based on your project structure

const { transporter } = require("../helpers/emailHelpers");
const NGO = require("../model/ngo");

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/user_login", function (req, res) {
  res.render("user_login");
});

router.get("/Ngo_login", function (req, res) {
  res.render("NGO_login");
});

router.get("/admin_login", function (req, res) {
  res.render("admin_login");
});

router.get("/User_singUp", function (req, res) {
  res.render("User_singUp");
});

router.get("/success", function (req, res) {
  res.render("success");
});

router.post("/", async function (req, res) {
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

// user login (seems to be something wrong here - user cant login even if he gives correct credentials)
router.post("/login", async function (req, res) {
  const { username, password } = req.body;

  try {
    const foundUser = await User.findOne({ email: username });

    if (!foundUser) {
      return res.render("loginError", { message: "User not found" });
    }

    const result = await bcrypt.compare(password, foundUser.password);

    if (result) {
      return res.render("UserDashBoard", {
        fullName: foundUser.fullName,
        email: foundUser.email,
        phoneNo: foundUser.Mobile,
        address: foundUser.address,
      });
    } else {
      return res.render("loginError", { message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// extra details added for the user
router.post("/add-details", async (req, res) => {
  try {
    // Find the user by their email
    let user = await User.findOne({ email: req.body.email });

    // If the user exists, update their details
    if (user) {
      // Update the user's details
      user.flatNo = req.body.flatNo;
      user.addressLine1 = req.body.addressLine1;
      user.addressLine2 = req.body.addressLine2;
      user.city = req.body.city;
      user.state = req.body.state;
      user.zip = req.body.zip;
      user.foodInventory.push({
        foodItem: req.body.foodItem,
        quantity: req.body.quantity,
      });

      // Save the updated user document
      const saveDetails = await user.save();
      if (saveDetails) {
        res.status(200).json({ message: "Details added successfully" });
        console.log("added details", saveDetails);
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error adding details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// user delete from the databse
router.post("/delete-details/:email/:ngoEmail", async (req, res) => {
  const ngoEmail = req.params.ngoEmail;
  try {
    // Find the user by their email
    let user = await User.findOne({ email: req.params.email });

    // If the user exists, delete their details
    if (user) {
      // Update the user's details
      user.flatNo = "";
      user.addressLine1 = "";
      user.addressLine2 = "";
      user.city = "";
      user.state = "";
      user.zip = "";
      user.foodInventory = [];
      user.approved = false;

      // Save the updated user document
      await user.save();

      //navigating to the NGO DASHBOARD
      const ngo = await NGO.findOne({ username: ngoEmail });
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
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//making a POST method for accepting the USER DONATION
router.post("/approve-donation/:email/:ngoEmail", async (req, res) => {
  const ngoEmail = req.params.ngoEmail;
  try {
    // Find the user by their email
    let user = await User.findOne({ email: req.params.email });

    // If the user exists, approved their donation
    if (user) {
      user.approved = true;

      // Save the updated user document
      await user.save();

      const ngo = await NGO.findOne({ username: ngoEmail });
      //navigating to the NGO DASHBOARD
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
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error approving donation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logout", function (req, res) {
  return res.redirect("/");
});

// user Registration
router.post("/User_singUp", async function (req, res) {
  const { username } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: username }).exec();

    if (existingUser) {
      // Email already exists, handle accordingly (e.g., show an error message)
      return res.render("registrationError", {
        message: "Email is already registered",
      });
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

    await newUser.save().then((user) => {
      let mailOptions = {
        to: user.email,
        subject: "Welcome To Petari",
        template: "Email.template",
        context: {
          user: {
            fname: user.fullName,
            _id: user._id,
            username: user.fullName,
            email: user.email,
          },
          year: new Date().getFullYear(),
        },
        attachments: [
          {
            filename: "logo.png",
            path: path.join(__dirname, "public", "img", "logo.png"),
            cid: "logo",
          },
        ],
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });

    return res.render("UserDashBoard", {
      fullName: req.body.fname,
      email: username,
      phoneNo: req.body.phn,
      address: req.body.address,
      // Do not include 'profile' here unless it's relevant to registration
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.route("/forgot-password").get(async (req, res) => {
  res.render("forget-password");
});

//send Email for the reset password
router.route("/forgot-password").post(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("User Not Exist");
    }

    // Generate a reset token and save it to the user
    const resetToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    user.resetTokenExpiration = Date.now() + 300000; // 5 minutes
    user.resetToken = resetToken;

    console.log("use after setting ",user);
    await user.save();

    // Send the reset link to the user via email
    const resetLink = `http://localhost:3000/reset-password?email=${encodeURIComponent(
      user.email
    )}&token=${encodeURIComponent(resetToken)}`; // Replace with the actual path to your logo
    console.log(resetLink);
    const mailOptions = {
      to: user.email,
      subject: "Password Reset",
      template: "reset-password", // Use the Handlebars template
      context: {
        user: {
          fname: user.fullName,
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        resetLink,
      },
      attachments: [
        {
          filename: "logo.png",
          path: path.join( "public", "img", "logo.png"),
          cid: "logo",
        },
      ],
    };
    console.log("User email:", user.email);

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
router.route("/reset-password").get(async (req, res) => {
  const { email, token } = req.query;
  try {
    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired reset token");
    }

    // Verify the token
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // Process the decoded token (e.g., extract information from it)
      console.log(decodedToken);
      // Continue with the reset-password logic
      res.render("set_password", { email, token });
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
router.route("/reset-password").post(async (req, res) => {
  const {email,token} =req.query;
  const { newPassword } = req.body;
  // console.log(" User Info",email,token,newPassword);

  try {
    // Verify the token again
    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired reset token");
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

      return res.render("UserDashBoard", {
        fullName: user.fullName,
        email: user.email,
        phoneNo: user.Mobile,
        address: user.address,
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
