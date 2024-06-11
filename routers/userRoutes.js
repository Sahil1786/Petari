const express = require("express");
const router = new express.Router();
const path = require("path");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
  const email = req.body.Email;
  try {
    //finding the user EXIST or NOT in DATABASE
    const userExist = await User.findOne({ email });
    if (userExist) {
      const newQuery = new Query({
        name: req.body.Fname,
        email: req.body.Email,
        subject: req.body.sub,
        message: req.body.sms,
        user_id: userExist._id,
      });

      await newQuery.save();
      console.log(newQuery);
    } else {
      const newQuery = new Query({
        name: req.body.Fname,
        email: req.body.Email,
        subject: req.body.sub,
        message: req.body.sms,
      });

      await newQuery.save();
      console.log(newQuery);
    }

    res.status(200).send("Successfully Received Message... Thank You!");
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

    const userQuerys = await Query.find({ user_id: foundUser._id });

    const donationInfo = {
      food: foundUser.foodInventory,
      city: foundUser.city,
      flat: foundUser.flatNo,
      destination: foundUser.destinaion,
      acceptedBy: foundUser.acceptedBy,
      status: foundUser.status,
    };

    if (result) {
      return res.render("UserDashBoard", {
        fullName: foundUser.fullName,
        email: foundUser.email,
        phoneNo: foundUser.Mobile,
        address: foundUser.address,
        complain: userQuerys,
        donationInfo: donationInfo,
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

    const ngo1 = await NGO.findOne({ username: ngoEmail });

    // If the user exists, approved their donation
    if (user && ngo1) {
      user.approved = true;
      user.acceptedBy = ngo1.NGOName;
      user.destinaion = ngo1.NgoLocation;

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
  const fullName = req.body.fname;

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

    // creating a message for USER
    const message = `Thank you, ${fullName.toUpperCase()}, for connecting with the PETARI organization.`;

    await newUser.save().then((user) => {
      let mailOptions = {
        to: user.email,
        subject: "Welcome To Petari",
        template: "Email.template",
        // context: {
        //   user: {
        //     fname: user.fullName,
        //     _id: user._id,
        //     username: user.fullName,
        //     email: user.email,
        //   },
        //   year: new Date().getFullYear(),
        // },
        text: message,
        attachments: [
          {
            filename: "logo.png",
            path: path.join(__dirname, "..", "public", "img", "logo.png"),
            cid: "logo",
          },
        ],
      };

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

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent successfully: " + info.response);
        }
      });
    });

    const foundUser = await User.findOne({ email: username });

    const userQuerys = await Query.find({ user_id: foundUser._id });

    return res.render("UserDashBoard", {
      fullName: foundUser.fullName,
      email: foundUser.email,
      phoneNo: foundUser.Mobile,
      address: foundUser.address,
      complain: userQuerys,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.route("/forgot-password-user").get(async (req, res) => {
  res.render("forget-password", { role: "user" });
});

//send Email for the reset password
router.route("/forgot-password-user").post(async (req, res) => {
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

    console.log("use after setting ", user);
    await user.save();

    // Send the reset link to the user via email
    const resetLink = `http://localhost:3000/reset-password-user?email=${encodeURIComponent(
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
          path: path.join("public", "img", "logo.png"),
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
router.route("/reset-password-user").get(async (req, res) => {
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
      res.render("set_password", { email, token, role: "user" });
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
router.route("/reset-password-user").post(async (req, res) => {
  const { email, token } = req.query;
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
      const userQuerys = await Query.find({ user_id: user._id });
      return res.render("UserDashBoard", {
        fullName: user.fullName,
        email: user.email,
        phoneNo: user.Mobile,
        address: user.address,
        complain: userQuerys,
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

//making a POST method for DELETING the COMPLAINt
router.post("/delete-query/:id/:email", async (req, res) => {
  const compId = req.params.id;
  const email = req.params.email;
  try {
    const dele = await Query.findByIdAndDelete(compId);

    //rendering USER DASHBOARD
    const foundUser = await User.findOne({ email });
    const userQuerys = await Query.find({ user_id: foundUser._id });

    return res.render("UserDashBoard", {
      fullName: foundUser.fullName,
      email: foundUser.email,
      phoneNo: foundUser.Mobile,
      address: foundUser.address,
      complain: userQuerys,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// updating the donation status
router.post("/donation-status/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const currentIndex = user.status ? user.status : "packed";
      const statuses = ["packed", "accepted", "onRoad", "delivered"];
      const currentIndexInArray = statuses.indexOf(currentIndex);
      const nextIndexInArray = currentIndexInArray + 1;

      // Ensure next index is within the array bounds
      if (nextIndexInArray < statuses.length) {
        const nextStatus = statuses[nextIndexInArray];
        if (req.body.roadType === nextStatus) {
          user.status = req.body.roadType;
          await user.save();

          if (
            req.body.roadType === "packed" ||
            req.body.roadType === "onRoad"
          ) {
            const donationInfo = {
              food: user.foodInventory,
              city: user.city,
              flat: user.flatNo,
              destination: user.destinaion,
              acceptedBy: user.acceptedBy,
              status: user.status,
            };
            const userQuerys = await Query.find({ user_id: user._id });
            return res.render("UserDashBoard", {
              fullName: user.fullName,
              email: user.email,
              phoneNo: user.Mobile,
              address: user.address,
              complain: userQuerys,
              donationInfo: donationInfo,
            });
          } else {
            const dooner = await User.find();
            const ngo = await NGO.findOne({ NGOName: user.acceptedBy });

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
          }
        } else {
          res.status(400).json({ message: "Invalid status update" });
        }
      } else {
        res.status(400).json({
          message: "Cannot update to next status, already at the final status",
        });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("donation-status error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
