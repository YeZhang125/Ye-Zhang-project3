
const mongoose = require("mongoose");
const PostSchema = require("./post.schema").PostShema;

const PostModel = mongoose.model("Post", PostSchema);

function createPost(post) {
  return PostModel.create(post).then(p => p.populate('user'));
}
function findByIdAndDelete(id) {
   return  PostModel.findByIdAndDelete(id).exec();
}

function find() {
  return PostModel.find({}).populate('user').sort({createdAt:-1}).exec();
}

function findById(id) {
  return PostModel.findById(id).exec();
}

function findOneAndUpdate(id, content) {
  return PostModel.findByIdAndUpdate(id, content, {
    new: true,
    runValidators: true
  }).exec();
}

function findPostsByUserId(userId) {
  return PostModel.find({user: userId}).exec();
}

module.exports = {
  PostModel,
  find,
   createPost,
  findByIdAndDelete,
  findById,
  findOneAndUpdate,
  findPostsByUserId
};