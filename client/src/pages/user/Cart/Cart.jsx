import { useState } from "react";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import { useCart } from "../../../context/cart";
import SaveForLater from "./SaveForLater";
import ScrollToTopOnRouteChange from "./../../../utils/ScrollToTopOnRouteChange";
import SeoData from "../../../SEO/SeoData";
import PriceCard from "./PriceCard";
import { useAuth } from "../../../context/auth";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const Cart = () => {
    const { auth } = useAuth();
    // Stripe details
    const publishKey = import.meta.env.VITE_STRIPE_PUBLISH_KEY;
    let frontendURL = window.location.origin; // Get the frontend URL
    const [cartItems, setCartItems, , , saveLaterItems] = useCart();
    
    // Payment method state: 'stripe' or 'cashOnPickup'
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");

    // Payment using Stripe or Cash on Pickup
    const handlePayment = async () => {
        if (selectedPaymentMethod === "cashOnPickup") {
            // Handle cash on pickup:
            // You can call a different API endpoint or pass an extra parameter to indicate the payment type.
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/api/v1/user/create-checkout-session`,
                    {
                        products: cartItems,
                        frontendURL: frontendURL,
                        customerEmail: auth?.user?.email,
                        paymentMethod: "cashOnPickup",
                    },
                    {
                        headers: {
                            Authorization: auth?.token,
                        },
                    }
                );
                console.log("Cash on Pickup order response: ", response.data);
                alert("Order placed! Please pay upon pickup.");
                
            } catch (error) {
                console.log("Error creating cash on pickup order: ", error);
                alert("There was an error placing your order.");
            }
        } else {
            // Proceed with Stripe payment
            try {
                const stripe = await loadStripe(publishKey);
                const response = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/api/v1/user/create-checkout-session`,
                    {
                        products: cartItems,
                        frontendURL: frontendURL,
                        customerEmail: auth?.user?.email,
                        paymentMethod: "stripe",
                    },
                    {
                        headers: {
                            Authorization: auth?.token,
                        },
                    }
                );
                const session = response.data.session;
                console.log("Stripe session: ", session);
                // Optionally, store session id for later use
                localStorage.setItem("sessionId", session.id);
                const result = await stripe.redirectToCheckout({
                    sessionId: session.id,
                });
                if (result.error) {
                    console.log(result.error);
                }
            } catch (error) {
                console.log("Error creating Stripe session: ", error);
                alert("Payment error. Please try again later.");
            }
        }
    };

    const placeOrderHandler = () => {
        handlePayment();
    };

    return (
        <>
            <ScrollToTopOnRouteChange />
            <SeoData title="Shopping Cart | Flipkart.com" />
            <main className="w-full pt-5">
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto">
                    <div className="flex-1">
                        <div className="flex flex-col shadow bg-white">
                            <span className="font-medium text-lg px-2 sm:px-8 py-4 border-b">
                                My Cart ({cartItems?.length})
                            </span>
                            {cartItems?.length === 0 ? (
                                <EmptyCart />
                            ) : (
                                cartItems?.map((item, i) => (
                                    <CartItem product={item} inCart={true} key={i} />
                                ))
                            )}

                            {/* Payment Method Selector */}
                            <div className="p-4 border-t">
                                <p className="mb-2 font-medium">Select Payment Method:</p>
                                <label className="mr-4">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="stripe"
                                        checked={selectedPaymentMethod === "stripe"}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    />
                                    <span className="ml-1">Pay with Card (Stripe)</span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cashOnPickup"
                                        checked={selectedPaymentMethod === "cashOnPickup"}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    />
                                    <span className="ml-1">Cash on Pickup</span>
                                </label>
                            </div>

                            {/* Place Order Button */}
                            <div className="flex justify-between items-center sticky bottom-0 left-0 bg-white">
                                <div className={`text-xs p-2 ${cartItems.length < 1 ? "hidden" : "inline-block"} w-full`}>
                                
                                </div>

                                <button
                                    onClick={placeOrderHandler}
                                    disabled={cartItems.length < 1}
                                    className={`${cartItems.length < 1 ? "hidden" : "bg-orange"} w-full sm:w-1/3 mx-2 sm:mx-6 my-4 py-4 font-medium text-white shadow hover:shadow-lg rounded-sm`}
                                >
                                    PLACE ORDER
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col mt-5 shadow bg-white mb-8">
                            <span className="font-medium text-lg px-2 sm:px-8 py-4 border-b">
                                Saved For Later ({saveLaterItems?.length})
                            </span>
                            {saveLaterItems?.map((item, i) => (
                                <SaveForLater product={item} key={i} />
                            ))}
                        </div>
                    </div>
                    <PriceCard cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default Cart;
