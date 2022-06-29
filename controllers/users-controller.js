var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var { validationResult } = require("express-validator");

var User = require("../models/user");
var Role = require("../models/role");

// Get all users
var getUsers = async (req, res, next) => {
  try {
    var users = await User.find({}, "-password");

    res.status(200).json({ data: users });
  } catch (err) {
    return next(err);
  }
};

// Signup author before creating articles - registration
var signup = async (req, res, next) => {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs passed, please check your data."));
  }

  var { firstName, lastName, email, password, role } = req.body;

  try {
    var existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).send({message: "User with email already exists."});
    }

    // Create user role.
    var createdRole;

    if (role) {
      createdRole = new Role({ name: role.toLowerCase() });
      await createdRole.save();
    } else {
      // Create user with author role, by default
      createdRole = new Role();
      await createdRole.save();
    }

    var hashPassword = await bcrypt.hash(password, 12);

    var createdUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      role: createdRole,
      articles: [],
    });

    await createdUser.save();

    var token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: 3600 }
    );

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
  } catch (err) {
    return next(err);
  }
};

// Login authors before creating/editing/deleting articles - authentication
var login = async (req, res, next) => {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs passed, please check your data."));
  }

  try {
    var { email, password } = req.body;

    var existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).send("Please email does not exist, try again!");
    }

    var isValidPassword = await bcrypt.compare(password, existingUser.password);

    if (!isValidPassword) {
      return res.status(403).send({message: "Please invalid password, try again!"});
    }

    var token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        process.env.JWT_KEY,
        { expiresIn: 3600 }
      );

    res.status(200).json({ userId: existingUser.id, email: existingUser.email, token: token });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getUsers, signup, login };
