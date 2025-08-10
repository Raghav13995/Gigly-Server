const User = require("../models/user.model");
const createError = require("../utils/createError");

exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(createError(404, "User not found"));
  user.password = undefined;
  res.status(200).json({ user });
};

exports.deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user?.id.toString() !== req.user.id.toString())
    return next(createError(401, "You are not authorized to delete this user"));

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true });
};
