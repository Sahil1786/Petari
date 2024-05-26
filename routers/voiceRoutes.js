const express = require("express");
const router = express.Router();

// Route to render voiceAssistance.ejs
router.get("/voiceAssistance", (req, res) => {
    res.render("voiceAssistance");
});

module.exports = router;
