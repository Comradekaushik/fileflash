//Start @comradekaushik 14AUG2025 
const express = require("express");
const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");

app.use(express.json());
dotenv.config();

const mongodbURL = process.env.mongodbURL;
async function main() {
    try {

        await mongoose.connect(mongodbURL, { dbName: "fileflash" });
        console.log("***connected***");
    } catch (err) {
        console.log(err);
    }
}
main();
const jwtsecretkey = "@ADBKSM If the opposition disarms, well and good. If it refuses to disarm, we shall disarm it ourselves.@"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "adityakm5500@gmail.com",
        pass: "dkdl idlo cpcb lfzq"
    }
})

app.get("/", (req, res) => {
    const myobject = {
        working: "yes",
        myarray: [`Response time ${Date.now()}`]
    }
    const myjson = JSON.stringify(myobject)
    res.send(myjson);
})
app.post("/signup", async (req, res) => {
    const body = req.body;
    console.log("signup body:", body);
    const generateHash = (input) => {
        const hash = crypto.createHash('sha256');
        hash.update(input);
        return hash.digest('hex');
    }
    // @comradekaushik SHA-256 is a cryptographic hash function that produces a 64-character hexadecimal string.
    const hashingpasswords = async (password) => {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(`${password}`, salt);
            return hashedPassword;
        } catch (err) {
            console.error('Error while hashing passwords with bcypt in /signup path:', err);

        }
    }
    const hashedPassword = await hashingpasswords(req.body.password);
    const data = [
        {
            "username": req.body.username,
            "userid": generateHash(req.body.username),
            "email": req.body.email,
            "password": hashedPassword,
        },
    ];

    try {
        const result = await User.findOne({ username: req.body.username.toLowerCase() });
        if (result) {
            res.json({ alreadyregistered: 'true', registered: 'false' });
        }
        const insertedresult = await User.insertMany(data);
        if (insertedresult) {
            res.json({ registered: 'true', username: data[0].username, userid: data[0].userid, message: "user was sucessfully registered" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("path: /signup Error inserting users , A mongoose or mongodb error encontered ");
    }

    try {
        await transporter.sendMail({
            from: '"fileflash app" <adityakm5500@gmail.com>',
            to: body.email,
            subject: "Signup Successful 🎉",
            text: `Welcome ${body.username || "User"}! Your signup was successfull.`,
            html: `
                <h3>Welcome ${body.username || "User"} 🎉<h3>
                <p>We're excited to have you onboard. Your signup was succesfull!</p>
                <p><b>Date:</b> ${new Date().toLocaleString()}</p>
            `
        });
        // res.json({ signup: "successful", emailSent: true });
    } catch (err) {
        console.error("Email error: ", err);
        // res.status(500).json({ signup: "failed", error: "Email not sent" });
    }
});

app.post("/login", async (req, res) => {
    const userdatasent = {
        email: req.body.email || "empty",
        password: req.body.password || "empty",
    }
    if (userdatasent.email === "empty" || userdatasent.password === "empty") {
        return res.status(400).json({ error: "Username and password are required." });
    }
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    async function verifyPassword(inputPassword, storedHashedPassword) {
        try {
            const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
            return isMatch;
        } catch (error) {
            console.error('Password comparison error:', error);
            return false;
        }
    }
    const isUserAuthentic = await verifyPassword(userdatasent.password, user.password);
    if (isUserAuthentic) {
        const token = jwt.sign(
            { email: user.email, username: user.username },
            jwtsecretkey,
            { expiresIn: "1h" }
        );
        try {
            const updatedUser = await User.findOneAndUpdate(
                { email: user.email },
                { accesstoken: token },
                { new: true }
            );
            if (!updatedUser) {
                console.log("User not found");
            } else {
                console.log("Access token updated:", updatedUser);
            }
        } catch (err) {
            console.error("Error updating access token:", err);
            return res.status(401).json({ error: "Error encountered while signing up the user" });

        }
        return res.json({ message: "Login successful", token });

    }
    else {
        return res.status(401).json({ error: "Invalid credentials" });
    }
})

app.post("/upload/file", (req, res) => {

})

app.get("/download/file/:fileid", (req, res) => {

})
app.delete("/delete/file/:fileid", (req, res) => {

})


app.listen(8081, () => {
    console.log(`Server Started ${Date.now()}`);

})

