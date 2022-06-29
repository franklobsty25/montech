var express = require("express");
var router = express.Router();
var { check } = require("express-validator");

var usersController = require("../controllers/users-controller");
var { auth } = require("../auth");

router.get("/", usersController.getUsers);

// Author signup route
router.post(
  "/signup",
  [
    check("firstName").not().isEmpty(),
    check("lastName").not().isEmpty(),
    check("email").normalizeEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

// Author login route
router.post(
  "/login",
  [
    check("email").normalizeEmail(), 
    check("password").isLength({ min: 6 })
  ],
  usersController.login
);

// Authentication
router.use(auth);

// Logout user
router.get("/logout", (req, res) => {
  res.status(200).json({token: null});
});

module.exports = router;
