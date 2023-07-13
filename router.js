const express = require("express");
const router = express.Router();

router.post('/signin',(req,res)=>{
    req.session.user=req.body.username;
    req.session.email=req.body.email;
    req.session.passwd=req.body.password;
    if(req.body.username==""||req.body.username==""||req.body.username=="")
        res.send('invalid details!');
    else    
        res.redirect("/route/diary");

})
router.get('/diary',(req,res)=>{
    if(req.session.user)
        res.render('diary',{title:"diary"});
})
router.post('/add-to-diary',(req,res)=>{
    // res.send(req.body.title);
    req.session.title=req.body.title;
    req.session.desc=req.body.description;
    req.session.date=req.body.date;
    // res.send(req.session.disc);
    if(req.session.title!='')
        res.redirect('/route/add');
    else
        res.send('Not Found');
})

router.get('/add',(req,res)=>{
    // res.render('add');
    if(req.session.title)
        // res.send("title is defined");
        res.render('add',{title:req.session.title,date:req.session.date,desc:req.session.desc});
})

module.exports = router;