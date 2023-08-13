const router = require("express").Router();
const jwt = require("jsonwebtoken");

// const Todo = require("../models/Todo");

// Routes below
// router.get("/", async (req, res) => {
//   const allTodo = await Todo.find();
//   res.render("index", {todo: allTodo});
// });

router.get("/", (req, res) => {
  //check if auth cookie exists
  const token = req.cookies.authToken;
  if (token) {
    //verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // Error means token is invalid. Render the signup page
        return res.render("signup");
      }

      // Valid token. Redirect to dashboard
      return res.redirect("/dashboard");
    });
  } else {
    // No token found. Render the signup page
    res.render("signup");
  }
});

module.exports = router;
