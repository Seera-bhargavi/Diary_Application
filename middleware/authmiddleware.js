
const jwt = require('jsonwebtoken');
const UserAuth = require('../model/usermodel');

const requireAuth = async(req,res,next)=>{
    const token = req.cookies.jwt;
    console.log(token);

    //checking token exist or not
    if(token){
        jwt.verify(token,'bhargavi secret',(err,decodedToken)=>{
            if(err){
                console.log("You are not logged in")
                res.redirect('/login');
                console.log(err.message);
                
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/login');
    }
}

//check cuurent user
const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'bhargavi secret',async(err,decodedToken)=>{
            if(err){
                console.log("You are not logged in");
                console.log(err.message);
                res.locals.user=null;
                next();
            }else{
                console.log(decodedToken);
                let user= await UserAuth.findById(decodedToken.id);
                req.userId=decodedToken.id;
                res.locals.user=user;
                console.log(user);
                next();
            }
        });
    }else{
        res.locals.user=null;
        next();
    }
}
module.exports = {requireAuth,checkUser};