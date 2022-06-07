const express = require('express');
const res = require('express/lib/response');
const app = express();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const userid =uuidv4();
const PORT =process.env.PORT ||1234
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.post("/user/create", function(req, res) {
    fs.readFile("./db.json",{encoding: 'utf8'},(err, data) => {
        const parsed = JSON.parse(data);
        parsed.users=[...parsed.users,req.body];
        fs.writeFile("./db.json",JSON.stringify(parsed),{encoding: 'utf8'},()=>{
            res.status(201).send({status: 'user created'+req.body.id});
        })
    })
});
app.post("/user/login",(req,res) => {
    fs.readFile("./db.json",{encoding: 'utf8'},(err, data) => {
        const parsed = JSON.parse(data);
        var flag =false;
        if(req.body.username.length===0 ||req.body.password.length===0){
            res.status(400).send({status: 'please provide username and password'})
        }else {
            var t;
            parsed.users.map((user) =>{
                if(user.username===req.body.username&&user.password===req.body.password){
                    t=uuidv4()
                    user.token=t;
                    flag=true;
                }
            })
            fs.writeFile("./db.json",JSON.stringify(parsed),{encoding: 'utf8'},()=>{
                res.status(201).send({status: 'status: "Login Successful'+t});
            })

        }
        if(!flag){
            res.status(401).send({status: 'Invalid Credentials'})
        }
    })
})
app.post("/user/logout",(req,res)=>{
    fs.readFile("./db.json",{encoding: 'utf8'},(err, data) => {
        const parsed = JSON.parse(data);
        
          
            parsed.users.map((user) =>{
                if(user.username===req.body.username&&user.password===req.body.password){
                    
                    user.token=undefined;
                   
                }
            })
            fs.writeFile("./db.json",JSON.stringify(parsed),{encoding: 'utf8'},()=>{
                res.status(201).send({status: "user logged out successfully" });
            })

        
       
    })
})
app.listen(PORT,() => {
    console.log(`server is listening on http://localhost:${PORT}`);
})
