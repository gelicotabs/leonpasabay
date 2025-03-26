import stripe from "stripe";
// to resolve stripe secret key error again use dotenv here
import dotenv from "dotenv";
dotenv.config();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

const createSession = async (req, res) => {
    try {
        const { products, frontendURL, customerEmail, paymentMethod } = req.body;
        
        // Cash on Pickup: bypass Stripe and save order directly
        if (paymentMethod === "cashOnPickup") {
            // Save the order with a status like "pending payment on pickup"
            // Example: await Order.create({ products, customerEmail, paymentMethod, status: "pending" });
            return res.status(200).send({ 
                message: "Order created successfully with Cash on Pickup."
            });
        }
        
        // Otherwise, create a Stripe session
        const successPath = "/shipping/confirm";
        const cancelPath = "/shipping/failed";
        const successURL = frontendURL + successPath;
        const cancelURL = frontendURL + cancelPath;
        
        const lineItems = products.map((item) => ({
            price_data: {
                currency: "php",
                unit_amount: item.discountPrice * 100,
                product_data: {
                    name: item.name,
                },
            },
            quantity: item.quantity,
        }));
        
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: successURL,
            cancel_url: cancelURL,
            customer_email: customerEmail,
            phone_number_collection: { enabled: true },
        });
        
        console.log('Stripe session: ', session);
        res.send({ session });
    } catch (error) {
        console.log("Error in creating stripe session id: " + error);
        res.status(500).send({
            success: false,
            message: "Error in Payment Gateway",
            error,
        });
    }
};

export default createSession;


