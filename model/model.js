const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const UserDiary = mongoose.model('userdiaries',schema);
module.exports = UserDiary;