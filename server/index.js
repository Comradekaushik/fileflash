//Start @comradekaushik 14AUG2025 
const express = require("express");
const {jwt} = require("jsonwebtoken");

const app = express();

app.get("/", (req,res)=>{
    const myobject = {
        working : "yes",
        myarray : [`Response time ${Date.now()}`]


    }
    const myjson = JSON.stringify(myobject)
    res.send(myjson);
})
app.listen(8081, ()=>{
    console.log(`Server Started ${Date.now()}`);

})

