const mongoose = require("mongoose");

const Connectdb = async()=>{
    const url = "mongodb+srv://bhargavi:bhargavi17@cluster0.vdlbdqi.mongodb.net/Diary?retryWrites=true&w=majority";
    try{
        const con = await mongoose.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true,

        })
        console.log(`mongoDB connected : ${con.connection.host}`);

    }catch(err){
        console.log(err);
        process.exit(1);
    }    
}

module.exports=Connectdb;
