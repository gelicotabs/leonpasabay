import stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
import orderModel from "../../models/orderModel.js";
import mongoose from "mongoose";
import productModel from "../../models/productModel.js";

const handleSuccess = async (req, res) => {
    try {
        // Retrieve the session ID and order items from the request body
        const { sessionId, orderItems } = req.body;
        console.log("sessionId, orderItems: ", sessionId, orderItems);

        // Validate order items and session ID
        if (!orderItems || !orderItems.length) {
            return res.status(503).send("No OrderItems received from client!");
        }
        if (!sessionId) {
            return res
                .status(503)
                .send("No sessionId for payment received from client!");
        }

        // Fetch the payment session from Stripe
        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
        console.log("Stripe session: ", session);

        // Extract the payment intent and amount from the session
        const paymentIntentId = session?.payment_intent;
        const amount = session?.amount_total;

        // Map order items to the required format for saving in the database
        const orderObject = orderItems.map((product) => ({
            name: product.name,
            image: product.image,
            brandName: product.brandName,
            price: product.price,
            discountPrice: product.discountPrice,
            quantity: product.quantity,
            productId: new mongoose.Types.ObjectId(product.productId),
            seller: new mongoose.Types.ObjectId(product.seller),
        }));

        // Construct shipping information, providing default values if any field is missing
        const shippingDetails = session?.customer_details?.address || {};
        const shippingObject = {
            address: shippingDetails.line1 || "N/A",
            city: shippingDetails.city || "N/A",
            state: shippingDetails.state || "N/A",
            country: shippingDetails.country || "N/A",
            pincode: shippingDetails.postal_code || "0",
            phoneNo: session?.customer_details?.phone || "0",
            landmark: shippingDetails.line2 || "No Landmark",
        };

        // Create the combined order object
        const combinedOrder = {
            paymentId: paymentIntentId,
            products: orderObject,
            buyer: req.user._id,
            shippingInfo: shippingObject,
            amount: amount / 100, // converting amount from cents to currency unit
        };

        // Save the order to the database
        const order = new orderModel(combinedOrder);
        await order.save();

        // Reduce stock for each product in the order
        for (const item of orderItems) {
            const product = await productModel.findById(item?.productId);
            if (product) {
                product.stock -= item?.quantity;
                await product.save();
            } else {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
        }

        // Send a successful response
        return res.status(200).send({ success: true });
    } catch (error) {
        console.error("Error in handling payment success:", error);
        return res.status(500).send("Error in handling payment success");
    }
};

export default handleSuccess;
