const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const UserModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserModel.pre("save", async function (next) {
  const hashedPass = await bcrypt.hash(this.password, 10);
  this.password = hashedPass;
  next();
});

UserModel.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserModel.methods.getSignToken = function () {
  return jwt.sign(
    { id: this._id, isSeller: this.isSeller },
    process.env.JWT_SECRET
  );
};

module.exports = mongoose.model("User", UserModel);
