const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign({
    user
  }, process.env.VITE_SECRET_KEY, {
    expiresIn: "14d",
  });
}


function decrypt(token) {
  try {
    const decoded = jwt.verify(token,  process.env.VITE_SECRET_KEY);
    return decoded.payload;
  } catch (err) {
    return false;
  }
}


module.exports = {
  generateToken,
  decrypt,

};
