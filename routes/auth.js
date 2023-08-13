const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Route to display the signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// Route to display the login page
router.get("/login", (req, res) => {
  res.render("login");
});

// The routes below handle submission of login and signup data
router.post(
  "/signup",
  [
    check("username").isLength({ min: 4 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        username,
        email,
        password: await bcrypt.hash(password, 10),
      });

      await user.save();

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Store the token in a cookie and redirect to the dashboard
      res.cookie("authToken", token).redirect("/dashboard");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //Store the token in a cookie or session, then redirect to dashboard
    res.cookie("authToken", token).redirect("/dashboard");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// To log out
router.get("/logout", (req, res) => {
  res.clearCookie("authToken"); // This will clear the JWT Cookie
  res.redirect("/login"); // This will redirect you to the login page
});

module.exports = router;
