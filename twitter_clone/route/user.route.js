const express = require("express");
const router = express.Router();
const userModel = require("../db/user.model");

router.put("/:id/bio", async (req,res)=>{
  try{
    if (req.params.id !== req.payload.user._id){
      return res.status(401).json({message:"Unauthorized"});
    }

    // update
    const filter = { _id: req.params.id };
    const doc = await userModel.findOneAndUpdate(
        filter,
        { bio: req.body.bio },
    );

    res.status(200).json(doc);
  } catch(error){
    console.log("Error updating post:", error);
    res.status(500).json({message:"Error updating post"});
  }
});

module.exports = router;
