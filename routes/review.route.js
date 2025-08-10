const router = require("express").Router({ mergeParams: true });

const { getReviews, postReview } = require("../controllers/review.controller");

const isAuth = require("../middleware/jwt");

router.route("/").get(getReviews).post(isAuth, postReview);

module.exports = router;
