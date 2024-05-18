const express = require("express");
const router = express.Router();
const pdf = require('html-pdf');
//const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const User = require("../model/user");

const { METHODS } = require("http");

// Donation route to save donation details and generate certificate
router.post("/donate", async (req, res) => {
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
          let item=req.body.foodItem;
          let quantity=req.body.quantity;
          // Save the updated user document
          const saveDetails = await user.save();
          if (saveDetails) {
            res.render('certificate', { userName: user.fullName,quantity:quantity,item:item });
          }
        } 
      } catch (error) {
        console.error("Error adding details:", error);
        res.status(500).json({ error: "Internal server error" });
      }
      
    });
   
      


  
module.exports = router;