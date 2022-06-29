var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    role: { type: mongoose.Types.ObjectId, required: true, ref: "Role" },
    articles: [{type: mongoose.Types.ObjectId, required: true, ref: "Article"}],
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
