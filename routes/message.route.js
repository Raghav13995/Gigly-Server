const router = require("express").Router({ mergeParams: true });

const {
  createMessage,
  getMessages,
} = require("../controllers/message.controller");
const isAuth = require("../middleware/jwt");

router.use(isAuth);
router.route("/").post(createMessage).get(getMessages);

module.exports = router;
