//Start @comradekaushik 14AUG2025 
const express = require("express");
const {jwt} = require("jsonwebtoken");

const app = express();

app.use(express.json());

app.get("/", (req,res)=>{
    const myobject = {
        working : "yes",
        myarray : [`Response time ${Date.now()}`]


    }
    const myjson = JSON.stringify(myobject)
    res.send(myjson);
})
app.post("/signup", (req,res)=>{
    const body = req.body;
    console.log(body);
    const responsesignup = {
        signup : "sucessful"
    }
    res.send(JSON.stringify(responsesignup));


})
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

