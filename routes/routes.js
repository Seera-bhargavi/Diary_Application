const express = require('express');
const route = express.Router();
var nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const UserDiary = require('../model/model');
const UserAuth = require('../model/usermodel');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {requireAuth, checkUser} = require('../middleware/authmiddleware');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');



route.use(cookieParser());

//creating jwt 
const expire=3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({id},'bhargavi secret',{
        expiresIn:expire,
    })
}

route.get('/',(req,res)=>{
    res.render('home',{title:"home"});
 })

 route.post('/add-to-diary',checkUser,(req,res)=>{
    if(!req.body){
        res.status(400).send("content cannot be empty!");
        return
    }
    const diary = new UserDiary({
        userid:req.userId,
        date:req.body.date,
        title:req.body.title,
        description:req.body.description
    })
    diary.save(diary).then(data=>{
        res.redirect('/diary_lists');
        // res.render('diary_lists',{title:"list of diaries"});
    }).catch(err=>{
        res.status(500).send({
            message:err.message || "some error occured while creating operation"
        });
    });
 })
 
 route.get('/diary_lists',checkUser,(req,res)=>{
    UserDiary.find({userid:req.userId})
    .then(result=>{
       res.render('diary_lists',{userdetail:result,title:"day-diary"})
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message || "error occured"
        });
    });
})
 route.get('/show-diary/:id',checkUser,(req,res)=>{
        UserDiary.findById(req.params.id).then(result=>{
            if(!result){
                res.status(404).send("not get data");
            }else{
                // res.render('diary',{diary_details:result,title:"diary"})
                console.log(result)
                res.render('diary',{diary_details:result,title:"diary"})
            }
        }).catch(err=>{
            res.status(500).send({
                message:err.message || "error occured in show diary"
            });
        });
    });
    route.get('/delete/:id',checkUser,(req,res)=>{
        UserDiary.findByIdAndDelete(req.params.id).then(result=>{
            if(!result){
                res.status(404).send("Error..can't delete!");
            }
            else{
                console.log('deleted');
                //req.flash('message','deleted..');
                res.render('delete_flash',{userdetail:result,title:"deleted"});
            }
        }).catch(err=>{
            res.status(500).send({
                message:err.message || "Not deleted!"
            });
        })
    })

    route.get('/edit-diary/:id',async (req,res)=>{
        const data=await UserDiary.findById(mongoose.Types.ObjectId(req.params.id.trim()));
        res.render('update_diary',{update:data,title:"updating-diary"});
    });

    route.post('/update_diary/:id',(req,res)=>{
        const id = req.params.id;
        const UpdatedData = {
            date:req.body.date,
            title:req.body.title,
            description:req.body.description
        }
        UserDiary.findByIdAndUpdate(id,{$set:UpdatedData})
        .then(()=>{
            res.json({
                message:"Diary changes are saved"
            }).catch(err=>{
                res.json({
                    message:err.message||"error occured!"
                })
            })
        })
    })

route.post('/signin',async (req,res)=>{

    const {username,email,password} = req.body;
    let mailreg =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(!username){
        req.flash("error","Please Enter Details");
        return res.redirect('/signin');
    }
    else if(email==''|| password==''){
        //return res.send("Indirect details");
        req.flash("error","Email and password are required")
        return res.redirect('/signin');
    }
    else if(!mailreg.test(email)){
        //return res.send("Indirect details");
        req.flash("error","Enter valid Email")
        return res.redirect('/signin');
    }
    else if(password.length<8){
        req.flash("error","Password must me at least 8 characters");
        return res.redirect('/signin');
    }
    else{
        req.flash("success","Successful")
        return res.redirect('/signin');
    }

    let user = await UserAuth.findOne({email});
    if(user){
        return res.redirect('/login');
    }
    user = new UserAuth({
        username,
        email,
        password
    }).save(user);

    
    const token = createToken(user._id);
    res.cookie('jwt',token,{httpOnly:true,maxAge:expire*1000});

    const  AuthVar = require('../env.js');
        var transport = nodemailer.createTransport({
                    service:'gmail',
                    auth:{  
                        user:AuthVar.EMAIL,
                        pass:AuthVar.PASSWORD
                    }
                });
            
                var mailOption = {
                    from:AuthVar.EMAIL,
                    to:email,
                    subject:'DiaryApplication',
                    text:'You are Signed to Diary Application..Thank you..'
                }
                transport.sendMail(mailOption,(error,info)=>{
                    if(error){
                        console.log(error);
                    }else{
                        console.log(`mail send to ${email}`);
                    }
                });
    res.redirect('/login');
});

route.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    let user = await UserAuth.findOne({email:email});

    if(user){
        console.log(password,user.password);
        const isMatch = await bcrypt.compare(password,user.password);
        console.log(isMatch);
        if(isMatch){
            const token = createToken(user._id);
            res.cookie('jwt',token,{httpOnly:true,maxAge:expire*1000});
            //res.status(200).send(user._id);
             res.redirect('/add_diary');

        }
        else{
            req.flash("error","Incorrect password!!")
            return res.redirect('/login');
        }
        // return res.redirect('/add_diary');
    }
    else{
        req.flash("error","Email and password incorrect!!")
        return res.redirect('/login');
    }
});

route.get('/logout',(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
})

route.get('/profile',checkUser,(req,res)=>{
    res.render('profile',{title:"profile"});
});
 module.exports = route;