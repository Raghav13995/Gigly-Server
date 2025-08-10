const router = require("express").Router({ mergeParams: true });

const {
  getOrders,
  intentPayment,
  completeOrder
} = require("../controllers/order.controller");
const isAuth = require("../middleware/jwt.js");

router.get("/", isAuth, getOrders);
router.patch("/:payment_intent",completeOrder)
router.post("/stripe", isAuth, intentPayment);

module.exports = router;
