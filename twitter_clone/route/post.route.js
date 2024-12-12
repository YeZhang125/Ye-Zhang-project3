const express = require("express");
const router = express.Router();
const postModel = require("../db/post.model") ;
const jwtHelpers = require("../helper/jwt");

// POST a new post
router.post("/", async (req,res)=>{
  try{

    const { content } = req.body;
    const userId = req.payload.user._id;

    if(!content|| content.trim() === ""){
      return res.status(400).json({message:"Content is required"});
    }

    const newPost = postModel.createPost({
      content,
      user: userId,
      createdAt: new Date()
    });

    const response =  await newPost;
    res.status(201).json(response);
  } catch(error){
    console.log("Error creating new post:", error);
    res.status(500).json({message:"Error creating new post"});
  }
});

// DELETE
router.delete("/:id", async (req,res)=>{
  try{
    const p = await postModel.findById(req.params.id);
    console.log("post user", p.user.toString());
     if(p.user.toString() === req.payload.user._id) {
       const post = await postModel.findByIdAndDelete(req.params.id);
       res.status(200).json({message:"Post deleted"});
     }else{
       res.status(401).json({message:"Unauthorized"});
     }
  }catch (error){
    console.log("Error deleting post:", error);
    res.status(500).json({message:"Error deleting post"});
  }
});

// UPDATE

router.put("/:id", async (req,res)=>{
  try{

    const post = await postModel.findById(req.params.id);
    console.log("postid from backend", req.params.id);
    if(!post){
      return res.status(404).json({message:"Post not found"});
    }

    if (post.user.toString() !== req.payload.user._id){
      return res.status(401).json({message:"Unauthorized"});
    }

    // update
    const filter = { _id: req.params.id };
    const doc = await postModel.findOneAndUpdate(
        filter,
        { content: req.body.content },
    );

    res.status(200).json(doc);
  } catch(error){
    console.log("Error updating post:", error);
    res.status(500).json({message:"Error updating post"});
  }
});

module.exports = router;