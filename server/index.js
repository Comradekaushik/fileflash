//Start @comradekaushik 14AUG2025 
const express = require("express");
const {jwt} = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "adityakm5500@gmail.com",
        pass: "dkdl idlo cpcb lfzq"
    }
})

app.get("/", (req,res)=>{
    const myobject = {
        working : "yes",
        myarray : [`Response time ${Date.now()}`]


    }
    const myjson = JSON.stringify(myobject)
    res.send(myjson);
})
app.post("/signup", async(req,res)=>{
    const body = req.body;
    console.log("signup body:",body);
    // const responsesignup = {
    //     signup : "sucessful"
    // }
    // res.send(JSON.stringify(responsesignup));


    try{
        await transporter.sendMail({
            from: '"fileflash app" <adityakm5500@gmail.com>',
            to: body.email,
            subject: "Signup Successful 🎉",
            text: `Welcome ${body.name || "User" }! Your signup was successfull.`,
            html:`
                <h3>Welcome ${body.name || "User"} 🎉<h3>
                <p>We're excited to have you onboard. Your signup was succesfull!</p>
                <p><b>Date:</b> ${new Date().toLocaleString()}</p>
            `
        });
        res.json({signup:"successful", emailSent:true});

    } catch(err){
        console.error("Email error: ", err);
        res.status(500).json({ signup: "failed", error:"Email not sent"});
    }
});

app.post("/login", (req,res)=>{

})

app.post("/upload/file",(req,res)=>{

})

app.get("/download/file/:fileid", (req,res)=>{

})
app.delete("/delete/file/:fileid", (req,res)=>{

})


app.listen(8081, ()=>{
    console.log(`Server Started ${Date.now()}`);

})

