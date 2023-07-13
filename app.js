const express = require("express");
const dotenv = require('dotenv')
const bodyparser = require("body-parser");
const session = require("express-session");
const MongoDBSession = require('connect-mongodb-session');
const {v4:uuidv4}=require("uuid");
const path = require('path');
const axios = require('axios');
const Connectdb = require("./connection/connection");
const {create} = require('./model/model');
const nodemailer = require('nodemailer');
const flash= require('connect-flash');

const { checkUser } = require("./middleware/authmiddleware");
// const {requireAuth} = require('./middleware/authmiddleware');
const app = express();

dotenv.config({path:'config.env'});
module.exports=nodemailer;
app.set('view engine','ejs');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

Connectdb();

app.use(flash());
//initializing session
app.use(session({
    secret:"bhargavi123",
    saveUninitialized:true,
    resave:true
}));

app.use(express.static(path.join(__dirname,'/public')));
app.use('/',require('./routes/routes'));

app.get('/about',(req,res)=>{
    res.render('about');
})

app.get('*',checkUser);

app.get('/add_diary',(req,res)=>{
    res.render('add_diary',{title:'AddToDiary'});
})
app.get('/add-to-diary',(req,res)=>{
    res.render('diary_lists',{title:"list of diaries"});
});

app.get('/signin',(req,res)=>{
    res.render('signin_form',{messages:req.flash(),title:"sign-in"});
});

app.get('/login',(req,res)=>{
    res.render('login_form',{messages:req.flash(),title:"Login-form"});
})

const port = process.env.PORT || 5000;
 app.listen(port,()=>console.log(`app is running at port ${port}`));