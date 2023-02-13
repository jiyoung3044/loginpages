const express = require('express');
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

app.use(express.urlencoded({extended: true}));
app.get('/',function(req,res){
    res.sendFile(__dirname + '/main.html')
})
app.get('/sign',function(req,res){
    res.sendFile(__dirname + '/sign.html');
})
app.post('/signup',function(req,res){
    let postData = {
        name : req.body.NAME,
        email : req.body.EMAIL,
        password : req.body.PASSWORD
    }
    new User(postData).save();
    console.log("Saved!")
    res.redirect('/');
});
app.post('/signin',function(req,res){
    let loginData = {
        email : req.body.LOGINEMAIL,
        password : req.body.LOGINPASS
    }
    User.findOne({email : loginData.email},function(err,userdata){
        if(err){
            console.log(err);
        }else if(userdata.password === loginData.password){
            console.log("로그인 성공");
        }
    })
    res.redirect('/');
});


mongoose.set('strictQuery',true);
mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    },
    (err)=>{
    if(err){
        console.log("ERR",err);
    }else{
        console.log("Connection Succesful");
        app.listen(8000,() => {
            console.log("Server Start")
        })
    }
})
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
});

const User = mongoose.model('User',userSchema);