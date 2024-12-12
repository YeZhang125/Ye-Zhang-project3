

const mongoose = require("mongoose");
const UserSchema = require("./user.schema").UserSchema;
const UserModel = mongoose.model("User", UserSchema);

function createUser(user) {
  return UserModel.create(user);
}

function findUserByUsername(username) {
  return UserModel.findOne({ username: username }).exec();
}

function findById(id) {
  return UserModel.findById(id).exec();
}
function findOneAndUpdate(filter, update) {
  return UserModel.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true
  })
}

module.exports = {
  createUser,
  findUserByUsername,
  findById,
  findOneAndUpdate,
};
