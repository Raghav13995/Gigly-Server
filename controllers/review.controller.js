const Review = require("../models/review.model");
const Gig = require("../models/gig.model");
const createError = require("../utils/createError");

exports.getReviews = async (req, res, next) => {
  const { id } = req.params;

  try {
    const reviews = await Review.find({ gig: id }).populate(
      "user",
      "username img country"
    );
    return res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

exports.postReview = async (req, res, next) => {
  const { id } = req.params;
  const { star, desc } = req.body;

  try {
    const gig = await Gig.findById(id);
    if (!gig) return next(createError(404, "Gig not found"));
    if (gig.userId.toString() === req.user.id)
      return next(createError(400, "You can't review your own gig"));

    const existingReview = await Review.findOne({
      gig: id,
      user: req.user.id,
    });
    if (existingReview)
      return next(createError(400, "You have already reviewed this gig"));

    const review = await Review.create({
      gig: id,
      user: req.user.id,
      star,
      desc,
    });
    // Update gig's star stats
    gig.totalStars += star;
    gig.starNumber += 1;
    await gig.save();
    return res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};
