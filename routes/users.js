const router=require('express').Router();
const User=require('../models/user');
const bcrypt=require('bcrypt');

//update user
router.put('/:id',async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);
            }catch(err){
                return res.status(500).json(err)
            }
        }
        try {
            const user=await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            if(user){
                res.status(200).json("Accound Updated");
            }else{
                res.status(404).json("user not found")
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    }else{
        return res.status(403).json('You are not allowed to update this account')
    }
})
//delete user
router.delete('/:id',async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.body.userId);
            res.status(200).json("Account Deleted")
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        res.status(403).json("You are not allowed to update this account")
    }
})
//get one user
router.get('/:id',async (req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        const {password,updatedAt,createdAt,...others}=user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(404).json("user not found")
    }
})
//follow user
router.put('/:id/follow',async (req,res)=>{
    if(req.params.id != req.body.userId){
        try {
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{followings:req.params.id}})
                res.status(200).json("followed that user")
            }else{
                res.status(403).json("you are already a follower of this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json('you not allow to follow yourself');
    }
})
//unfollow user
router.put('/:id/unfollow',async (req,res)=>{
    if(req.params.id != req.body.userId){
        try {
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{followings:req.params.id}})
                res.status(200).json("unfollowed that user")
            }else{
                res.status(403).json("you are not following this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json('you not allow to unfollow yourself');
    }
})

module.exports=router