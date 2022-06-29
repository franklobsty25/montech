var jwt = require("jsonwebtoken");
var User = require("./models/user");

// Authentication
var auth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    var token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Authentication failed!");
    }

    var decodeToken = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decodeToken.userId;
    next();
  } catch (err) {
    return next(err);
  }
};


// Check if user is editor
var verifyEditor = async (req, res, next) => {
  try {
    var user = await User.findById(req.userId).populate("role");

    if (!user) {
      return res.status(404).send("User not found!");
    }

    if (user.role.name !== "editor") {
      return res.status(403).send("You are not authorized to approve this article.");
    }
    
    next();
    
  } catch (err) {
    return next(err);
  }
};

module.exports = { auth, verifyEditor };
