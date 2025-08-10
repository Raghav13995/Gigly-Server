const Gig = require("../models/gig.model");
const createError = require("../utils/createError");

exports.addGig = async (req, res, next) => {
  try {
    if (!req.user.isSeller)
      return next(createError(401, "Only sellers can create a gig"));
    const gig = await Gig.create({ ...req.body, userId: req.user.id });
    return res.status(201).json({ success: true, data: gig });
  } catch (err) {
    next(err);
  }
};
exports.getAllGigs = async (req, res, next) => {
  const filters = {};
  if (req.query.search)
    filters.title = { $regex: req.query.search, $options: "i" };
  if (req.query.max) filters.price = { $lte: req.query.max };
  if (req.query.min) filters.price = { $gte: req.query.min };
  if (req.query.cat) filters.cat = req.query.cat;
  if(req.query.userId) filters.userId = req.query.userId;
  try {
    const gigs = await Gig.find(filters)
      .sort({ [req.query.sort]: -1 })
      .populate("userId", "username img");
      console.log("Error in getAllGigs:");
    res.status(200).json({ success: true, data: gigs });
  } catch (err) {
    console.log("Error in getAllGigs:");
    next(err);
  }
};

exports.getGig = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const gig = await Gig.findById(req.params.id).populate(
      "userId",
      "username img country desc createdAt"
    );
    console.log(gig);
    if (!gig) return next(createError(404, "Gig not found"));
    res.status(200).json({ success: true, data: gig });
  } catch (err) {
    console.log("yup its inside me ");
    next(err);
  }
};

exports.deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));
    if (gig.userId.toString() !== req.user.id.toString())
      return next(
        createError(403, "You are not authorized to delete this gig")
      );
    await Gig.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
