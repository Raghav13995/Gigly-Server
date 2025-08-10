const router = require("express").Router();

const {
  getConversations,
  createConversation,
  getConversation,
  updateConversation,
} = require("../controllers/conversation.controller");
const messageRouter = require("../routes/message.route");

const isAuth = require("../middleware/jwt");
router.use("/:id/messages", messageRouter);

router
  .route("/")
  .get(isAuth, getConversations)
  .post(isAuth, createConversation);
router
  .route("/:id")
  .get(isAuth, getConversation)
  .patch(isAuth, updateConversation);


module.exports = router;
