require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require('node-cron');
const dbManager = require("./modules/dbManager");
const emailManager = require("./modules/emailManager");

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json({ type: ['application/json', 'text/plain'] }))

dbManager.connectDB((res) => {
    if (res == "SUCCESS") {
        console.log("Successful connection made to database");
    } else {
        throw new Error("Connection not made to database. Exiting.")
    }
});

// Serve the HTML form
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Handle form submission
app.post("/submit", (req, res) => {
    const email = req.body.email;
    console.log("Received email:", email);  // Log the received email

    // Check if email is undefined or empty
    if (!email) {
        console.error("❌ No email provided");
        return res.send("⚠️ Please provide a valid email.");
    }

    dbManager.createUser(email, (result) => {
        console.log(result);
        if (result == "SUCCESS") {
            res.send("email");
        }
        else {
            res.send("error");
        }
    })
});

//add error handling !!!!!

const generateMagicLink = async () => {
    dbManager.getOldestUser(async (user) => {
        if (user.magicLink){
            dbManager.removeUser(user.email, (res) => {
                generateMagicLink()
            })
        }
        else{
            
            user.magicLink = 'x'
            await user.save();
        }
    });

}

// Scheduling

generateMagicLink();

cron.schedule('0 0 * * *', () => {
    
    // emailManager.sendEmail("email@example.com", "magicLink")


});



// Start the server
mongoose.connection.once("open", () => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
