const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");

const isAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return next(
      createError(401, "You are not authorized to access this route")
    );
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return next(
        createError(401, "You are not authorized to access this route")
      );
    req.user = decoded;
    next();
  });
};

module.exports = isAuth;
