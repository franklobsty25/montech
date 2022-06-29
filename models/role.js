var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var roleSchema = mongoose.Schema(
  {
    name: { type: String, required: true, default: "author" },
  },
  { timestamps: true }
);

roleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Role", roleSchema);
