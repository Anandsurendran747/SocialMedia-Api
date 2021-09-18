const router=require('express').Router();
const User=require('../models/user');
const bcrypt=require('bcrypt');
//Register
router.post('/register',async(req,res)=>{
    try{
        //password bcryption
        const salt=await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(req.body.password,salt);
        //creating new user
        const newUser=await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })
        //saving user to database
        const user=await newUser.save()
        //sending response
        res.status(200).json(user)
    }catch(err){
        //logging error
        res.status(500).json(err);
        
    }

    
    
})

//login user
router.post('/login',async(req,res)=>{
   try{
    const user=await User.findOne({email:req.body.email});
    !user && res.status(404).json('no user found');

    const validPassword=await bcrypt.compare(req.body.password,user.password);
    !validPassword && res.status(400).json('incorrect password');

    res.status(200).json(user);
   }catch(err){
        res.status(500).json(err);
   }




})

module.exports=router