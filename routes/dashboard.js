const router = require("express").Router();
const Todo = require("../models/Todo");
const verifyToken = require("../middleware/verifyToken");

router.get("/dashboard", verifyToken, async (req, res) => {
  //We will only fetch todos associated with the logged in user
  const userTodos = await Todo.find({ user: req.user.userId });
  res.render("dashboard", { todos: userTodos });
});

module.exports = router;
