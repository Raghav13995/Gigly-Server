const router = require("express").Router();

const { getUser, deleteUser } = require("../controllers/user.controller");
const isAuth = require("../middleware/jwt");

router.route("/:id").get(getUser).delete(isAuth, deleteUser);

module.exports = router;
