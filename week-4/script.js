require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require('node-cron');
const dbManager = require("./modules/dbManager");
const emailManager = require("./modules/emailManager");

const app = express();
const port = 3000;

//middleware to parse form data
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(express.json({
    type: ['application/json', 'text/plain']
}))

dbManager.connectDB((res) => {
    if (res == "SUCCESS") {
        console.log("Successful connection made to database");
    } else {
        throw new Error("Connection not made to database. Exiting.")
    }
});

//serve the HTML form
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

//handle form submission
app.post("/submit", (req, res) => {
    const email = req.body.email;
    console.log("Received email:", email); // Log the received email

    //check if email is undefined or empty
    if (!email) {
        console.error("No email provided");
        return res.send("Please provide a valid email.");
    }

    dbManager.createUser(email, (result) => {
        console.log(result);
        if (result == "SUCCESS") {
            res.send("Your email has been added.");
        } else if (result == "DUPLICATE") {
            res.send("Your email is already added to the list")
        } else {
            res.send("There was an error.");
        }
    })
});

//add error handling !!!!!
//make the magic link
const generateMagicLink = async () => {
    //get oldest user
    try {
        dbManager.getOldestUser(async (user) => {
            //
            // console.log(user)
            if (!user) {
                return;
            } else if (user.magicLink) {
                dbManager.removeUser(user.email, (res) => {
                    generateMagicLink()
                })
            } else {

                const chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let string = "";
                for (let i = 0; i <= 6; i++) {
                    string += chars[Math.floor(Math.random() * chars.length)];
                }
                user.magicLink = string;
                await user.save();
                emailManager.sendEmail(user.email, user.magicLink)
            }
        });

    } catch (error) {
        console.error(`Error in generateMagicLink: ${err}`);
        return callback("ERROR")
    }

}
app.get("/pet", (req, res) => {
    // console.log(req.query)

    dbManager.checkMagicLink(req.query.magicLink, (magicLinkResponse) => {
        if (magicLinkResponse == "SUCCESS") {
            res.sendFile(__dirname + "/views/pet.html");
        } else {
            res.sendFile(__dirname + "/views/404.html");
        }
    });
});

//scheduling
cron.schedule('0 0 * * *', () => {
    generateMagicLink();
});

//start the server
mongoose.connection.once("open", () => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});