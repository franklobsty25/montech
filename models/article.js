var mongoose = require("mongoose");

var articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, required: true, default: "Pending"},
    user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
