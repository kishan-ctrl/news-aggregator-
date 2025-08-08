const express = require('express');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router =express.Router();

//SignUp

router.post('/signup' ,async (req,res) =>{
    try{

    const {email,password,preference}=req.body;    
    const userExists=await User.findOne({email});

    if (userExists)return res.status(400).json({message:"User Already Exists"});
    const hashedPassword=await bcrypt.hash(password,10);

    const user =await User.create({
        email,
        password: hashedPassword,
        preference:preference
    });
    const token = jwt.sign({
        id:user._id},
        process.env.JWT_SECRET,{
            expiresIn:'7d'
        }
    );
    res.status(201).json({token,user:{
        email:user.email,
        preference:user.preference
    }});
    }catch(error){
        res.status(500).json({message:"SignUp failed",error:error.message});


    }
});



//Login

router.post('/Login',async(req,res)=>{
    try{
        const { email, password } = req.body;
        const user=await User.findOne({email});
        if(!user)return res.status(401).json({message:"Invalid Credientials"});

        const isMatch= await bcrypt.compare(password,user.password);
        if (!isMatch)res.status(401).json({message:"Invalid Credentials"});

        const token = jwt.sign({
            id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'});
        res.status(200).json({token,user:{email:user.email,preference:user.preference}});    



    }catch(error){
        res.status(500).json({message:"Login Failed",error:error.message});

    }
});

module.exports=router;




