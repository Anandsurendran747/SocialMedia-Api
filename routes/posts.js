const router=require('express').Router();
const Post = require('../models/Post')
const User=require('../models/user')
//create a post
router.post('/',async (req,res)=>{
    const newPost=await new Post(req.body);
    try {
        const post = await newPost.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error)
    }
})
//update a post 
router.put('/:id',async (req,res)=>{
    const post =await  Post.findById(req.params.id);
    
    if(post.userId === req.body.userId){
        try {
            const updatedPost=await Post.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            res.status(200).json(updatedPost);
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You are not allowed to update this post");
    }
})
//delete a post 
router.delete('/:id',async (req,res)=>{
    const post =await  Post.findById(req.params.id);
    
    if(post.userId === req.body.userId){
        try {
            const updatedPost=await Post.deleteOne();
            res.status(200).json("post deleted");
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You are not allowed to delete this post");
    }
})
//get a post 
router.get('/:id',async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        const {createdAt,updatedAt,...others}=post._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err);
    }
})
//get all post as per users followers
router.get("/timeline/all", async (req, res) => {
    console.log("called");
    try{
      const currentUser = await User.findById(req.body.userId);
      console.log(currentUser);
      const userPosts = await Post.find({ userId: currentUser._id });
      console.log(userPosts);
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  });
//like/dislike a post 
router.put('/:id/like',async (req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId) ){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("post liked")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("post disliked")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports=router