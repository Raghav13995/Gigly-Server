const Order = require("../models/order.model");
const Gig = require("../models/gig.model");
const createError = require("../utils/createError");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.user.isSeller ? { seller: req.user.id } : { buyer: req.user.id }),
      isCompleted: true,
    })
      .populate("gig")
      .populate("seller", "username country img")
      .populate("buyer", "username country img");
    return res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

exports.intentPayment = async (req, res, next) => {
  const { id } = req.params;
  try {
    const gig = await Gig.findById(id);
    if (!Gig) return next(createError(404, "Gig not found"));
    if (gig.userId.toString() === req.user.id)
      return next(createError(400, "You can't buy your own gig"));
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price*100,
      currency: "inr",
      metadata: { integration_check: "accept_a_payment" },
    });
    const order = await Order.create({
      gig: gig._id,
      seller: gig.userId,
      buyer: req.user.id,
      price: gig.price,
      payment_intent: paymentIntent.id,
    });
    return res
      .status(200)
      .json({ success: true, data: paymentIntent.client_secret, order });
  } catch (err) {
    next(err);
  }
};

exports.completeOrder = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      { payment_intent: req.params.payment_intent },
      { isCompleted: true },
      { new: true }
    );
    const gig = await Gig.findById(orders.gig);
    gig.sales += 1;
    await gig.save();
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(err);
  }
};
