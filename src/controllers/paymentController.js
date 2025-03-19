const brainTree = require("braintree");
const Order = require("../models/orderModel");
const logger = require("../utils/logger");
const errorFunction = require("../utils/errorFunction");

let gateway = new brainTree.BraintreeGateway({
  environment: brainTree.Environment.Sandbox,
  merchantId: process.env.BRAIN_TREE_MERCHANT_ID,
  publicKey: process.env.BRAIN_TREE_PUBLIC_ID,
  privateKey: process.env.BRAIN_TREE_PRIVATE_ID,
});

const PaymentController = {
  brainTreeTokenController: async (req, res) => {
    try {
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          res.status(400).json(errorFunction(true, `Bad request: ${err}`));
        } else {
          res
            .status(200)
            .json(
              errorFunction(
                false,
                "Brain-tree token generated successfully.",
                response
              )
            );
        }
      });
    } catch (error) {
      logger.error("Error while generating brain-tree token. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  brainTreePaymentController: async (req, res) => {
    try {
      const { nonce, cart } = req.body;
      let total = 0;
      cart.map((i) => {
        total += i.price;
      });
      let newTransaction = gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        },
        async function (error, result) {
          if (result) {
            const order = new Order({
              products: cart,
              payment: result,
              buyer: req.user._id,
            });

            await order.save();

            res
              .status(200)
              .json(
                errorFunction(false, "Brain-tree payment successful.", {
                  ok: true,
                })
              );
          } else {
            res.status(400).json(errorFunction(true, `Bad request: ${error}`));
          }
        }
      );
    } catch (error) {
      logger.error("Error in brain-tree payment. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },
};

module.exports = PaymentController;
