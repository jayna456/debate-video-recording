const paymentModel = require("../model/payment.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const userModel = require("../model/user.model");
let user = require("../model/user.model");
const moment = require("moment");

exports.createProductWithPricingPlan = async (req, res) => {
  const product = await stripe.products.create({
    name: "Premium Debate",
  });

  console.log("product response... ", product);
  const price = await stripe.prices.create({
    unit_amount: 129,
    currency: "usd",
    recurring: { interval: "month" },
    product: product.id,
  });

  console.log("created price plan reponse ", price);

  res.json({
    code: 200,
    product: product,
    price: price,
  });
};

exports.listProducts = async (req, res) => {
  const products = await stripe.products.list();

  console.log("products.... ", products);
};

exports.buyPremiumPayment1 = async (req, res) => {
  const loginUser = await userModel
    .findOne({ _id: req.body.userId })
    .lean()
    .exec();

  if (loginUser) {
    const customer = await stripe.customers.create({
      description: "Test Customer (created for API docs)",
      email: loginUser.email,
      name: loginUser.userName,
    });

    const prices = await stripe.prices.list({ active: true });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
    });

    if (subscription) {
      const newPayment = new paymentModel();
      newPayment.userId = loginUser._id;
      newPayment.productId = prices.data[0].product;
      newPayment.planPrice = prices.data[0].id;
      newPayment.subscriptionId = subscription.id;
      newPayment.subscriptionStartDate = moment
        .unix(subscription.current_period_start)
        .toDate();
      newPayment.subscriptionEndDate = moment
        .unix(subscription.current_period_end)
        .toDate();
      const savedPayment = await newPayment.save();
      if (savedPayment) {
        res.json({
          code: 200,
          status: "success",
          data: savedPayment,
        });
      } else {
        res.json({
          code: 500,
          status: "err",
          message: "Something went while storing payment information",
        });
      }
    } else {
      res.json({
        code: 500,
        status: "err",
        message: "Something went while creating subscription",
      });
    }
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No user found",
    });
  }
};

exports.buyPremiumPayment = async (req, res) => {
  console.log("buyPremiumPayment", req.body);
  const loginUser = await userModel
    .findOne({ _id: req.body.userId })
    .lean()
    .exec();

  if (loginUser) {
    const customer = await stripe.customers.create({
      description: "Test Customer (created for API docs)",
      email: loginUser.email,
      name: loginUser.userName,
      address: {
        line1: "katargam",
        postal_code: "395004",
        city: "surat",
        state: "gujrat",
        country: "india",
      },
      source: req.body.token,
    });

    const prices = await stripe.prices.list({ active: true });

    console.log("price-=--=-=-=-", prices, "customer-=--=-=-=-=-", customer.id);
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: prices.data[prices.data.length - 1].id,
          quantity: 1,
        },
      ],
    });
    console.log("subscription ..", subscription);

    if (subscription) {
      const newPayment = new paymentModel();
      newPayment.userId = loginUser._id;
      newPayment.customerId = customer.id;
      // newPayment.productId = prices.data[0].product;
      // newPayment.planPrice = prices.data[0].id;
      newPayment.planId = subscription.plan.id;
      newPayment.productId = subscription.plan.product;
      newPayment.planPrice = subscription.plan.amount;
      newPayment.subscriptionId = subscription.id;
      newPayment.subscriptionStartDate = moment
        .unix(subscription.current_period_start)
        .toDate();
      newPayment.subscriptionEndDate = moment
        .unix(subscription.current_period_end)
        .toDate();
      const savedPayment = await newPayment.save();
      if (savedPayment) {
        var response = await user.findByIdAndUpdate(
          { _id: loginUser._id },
          { $set: { premium: true } }
        );
        res.json({
          code: 200,
          status: "success",
          data: savedPayment,
        });
      } else {
        res.json({
          code: 500,
          status: "err",
          message: "Something went while storing payment information",
        });
      }
    } else {
      const deleted = await stripe.customers.del(customer.id);
      console.log("custmer deleted", deleted);
      res.json({
        code: 500,
        status: "err",
        message: "Something went while creating subscription",
      });
    }
  } else {
    res.json({
      code: 404,
      status: "err",
      message: "No user found",
    });
  }
};

exports.listPrice = async (req, res) => {
  console.log("list of prices");
  const prices = await stripe.prices.list({ active: true });
  console.log("prices.... ", prices);

  res.json({
    code: 200,
    status: "success",
    data: prices,
  });
};
