const router = require("express").Router();

const {
  addGig,
  deleteGig,
  getGig,
  getAllGigs,
} = require("../controllers/gig.controller");

const reviewRouter = require("./review.route");
const orderRouter = require("./order.route");

const isAuth = require("../middleware/jwt");

router.route("/").post(isAuth, addGig).get(getAllGigs);
router.use("/order", orderRouter);
router.route("/:id").get(getGig).delete(isAuth, deleteGig);
router.use("/:id/order", orderRouter);
router.use("/:id/reviews", reviewRouter);


module.exports = router;
