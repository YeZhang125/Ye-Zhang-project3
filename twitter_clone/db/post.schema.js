const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;
exports.PostShema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  content:{type:String,required:true},
  }, {timestamps: true,}
);
