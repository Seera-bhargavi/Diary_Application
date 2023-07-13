var Validate = (mail,password)=>{
    let mailreg = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9]\.[a-z]+$/;

    if(mail==''|| password==''){
        return false;
    }
    if(!mailreg.test(mail)){
        return false
    }
    return true;
 }

 module.exports = Validate;