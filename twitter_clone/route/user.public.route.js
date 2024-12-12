const express = require("express");
const router = express.Router();
const userModel = require("../db/user.model");
const postModel = require("../db/post.model");
const jwtHelpers = require("../helper/jwt");
const cookieParser = require("cookie-parser");

router.use(cookieParser());


router.get("/:id", async function (request, response) {
  const user = await userModel.findById(request.params.id);
  if (!user) {
    response.status(404).send("User not found");
  } else {
    response.status(200).json(user);
  }
})

router.get("/:id/posts", async function (request, response) {
  const posts = await postModel.findPostsByUserId(request.params.id);
  if (!posts) {
    response.status(404).send("User has no posts");
  } else {
    response.status(200).json(posts);
  }
})


router.post("/login", async function (request, response) {
  const username = request.body.username;
  const password = request.body.password;
  try {
    const user = await userModel.findUserByUsername(username);
    if (user.password === password) {
      const token = jwtHelpers.generateToken(user);

      return response.status(200).json({ token});
    }
    response.status(400);
    return response.send("Username or password is not valid");
  } catch (error) {
    console.error(error);
    response.status(400);
    return response.send("Username or password is not valid");
  }
});

router.post("/signup", async function (request, response) {
  try {
    const user = await userModel.createUser(request.body);
    const token = jwtHelpers.generateToken(user);

    return response.status(200).json({token});
  } catch (error) {
    response.status(400);
    console.log(error);
    return response.send("Error creating new user");
  }
});
router.post("/logout", function (request, response) {
  response.clearCookie("token"); // this doesn't delete the cookie, but expires it immediately
  response.send();
});
router.get("/isLoggedIn", function (request, response) {
  const username = jwtHelpers.decrypt(request.cookies.token);
  if (!username) {
    response.status(400);
  }
  response.send();
});

module.exports = router;
