const mongoose = require("mongoose");

const Connectdb = async()=>{
    const url="mongodb://bhargavi:<password>@ac-hldrt2l-shard-00-00.vdlbdqi.mongodb.net:27017,ac-hldrt2l-shard-00-01.vdlbdqi.mongodb.net:27017,ac-hldrt2l-shard-00-02.vdlbdqi.mongodb.net:27017/?ssl=true&replicaSet=atlas-8cunxh-shard-0&authSource=admin&retryWrites=true&w=majority";
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
