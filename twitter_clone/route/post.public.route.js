const express = require("express");
const router = express.Router();
const postModel = require("../db/post.model") ;

// GET all posts, sorted by newest first
router.get("/", async (req,res)=>{
  try{
    const posts = await postModel.find();// Descending order by 'createdAt'
    res.status(200).json(posts);

  }catch(error){
    console.log("Error fetching posts:", error);
    res.status(500).json({message:"Error fetching posts"});
  }
});

module.exports = router;