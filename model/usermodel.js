
const mongoose =  require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true,'Please enter an email'],
        unique:true,
        validate:[isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter an valid password'],
        minlength:[6,'Minimum password length is 6 character']
    }
})

schema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    console.log("User is going to be created",this);
    next();
});
schema.post('save',function(doc,next){
    console.log('new user is created and saved',doc);
});

const UserAuth = mongoose.model('Users',schema);

module.exports = UserAuth;