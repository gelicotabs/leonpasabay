/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Step, StepLabel, Stepper } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Tracker from "./Tracker";
import MinCategory from "../../../components/MinCategory";
import axios from "axios";
import { useAuth } from "../../../context/auth";
import Spinner from "../../../components/Spinner";
import SeoData from "../../../SEO/SeoData";

const OrderDetails = () => {
    const params = useParams();
    const orderId = params.id;

    const [loading, setLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const { auth } = useAuth();

    // Pickup stepper state (set to 0 as initial)
    const [pickupActiveStep, setPickupActiveStep] = useState(0);

    // Define pickup instructions steps
    const pickupSteps = [
        { status: "Go to the shop" },
        { status: "Show your Order number/ID" },
        { status: "Pick up your order" },
    ];

    // Icons for stepper
    const completedIcon = <CheckCircleOutlineIcon color="primary" />;
    const pendingIcon = <RadioButtonUncheckedIcon color="disabled" />;

    useEffect(() => {
        // fetch order detail from server
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/v1/user/order-detail?orderId=${orderId}`,
                    {
                        headers: {
                            Authorization: auth?.token,
                        },
                    }
                );
                console.log(...response.data.orderDetails);
                if (response?.data?.orderDetails) {
                    setOrderDetails(...response.data.orderDetails);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [auth?.token, orderId]);

    const amount = orderDetails?.amount;
    const orderItems = orderDetails?.products;
    const buyer = orderDetails?.buyer;
    const paymentId = orderDetails?.paymentId;
    const shippingInfo = orderDetails?.shippingInfo;
    const createdAt = orderDetails?.createdAt;
    const orderStatus = orderDetails?.orderStatus;

    return (
        <>
            <SeoData title="Order Details | Leon Pasabay DS" />

            <MinCategory />

            {/* Pickup Location, Shop Contact Details and Pickup Instructions */}
            <div className="max-w-6xl mx-auto my-4 p-4 bg-white shadow rounded-sm">
                <h3 className="text-lg font-semibold mb-2">Pickup Location</h3>
                <div className="w-full h-64">
                    <iframe
                        className="w-full h-full object-cover"
                        src="https://www.google.com/maps?q=20+Calaor+St,+Leon,+5026+Iloilo&output=embed"
                        frameBorder="0"
                        allowFullScreen=""
                        aria-hidden="false"
                        tabIndex="0"
                        title="Pickup Location Map"
                    ></iframe>
                </div>
                <div className="mt-4">
                    <center><h1 className="text-xl font-bold py-10 mb-3">Order Number: {paymentId}</h1></center>
                   <center> <h3 className="text-lg font-semibold mb-2">How to Pick Up Your Order</h3></center>
                    <Stepper activeStep={pickupActiveStep} className="py-10" alternativeLabel>
                        {pickupSteps.map((item, index) => (
                            <Step
                                key={index}
                                active={pickupActiveStep === index}
                                completed={pickupActiveStep > index}
                            >
                                <StepLabel
                                    icon={pickupActiveStep > index ? completedIcon : pendingIcon}
                                >
                                    {pickupActiveStep >= index ? (
                                        <span className="text-primaryGreen font-medium">
                                            {item.status}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 font-medium">
                                            {item.status}
                                        </span>
                                    )}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Shop Contact Details</h3>
                    <p className="mt-1">
                        <strong>Address:</strong> Leon, Iloilo
                    </p>
                    <p className="mt-1">
                        <strong>Mobile:</strong> 09162943802
                    </p>
                    <p className="mt-1">
                        <strong>Email:</strong> mrp.kelsey@gmail.com
                    </p>
                </div>
            
            </div>

            <main className="w-full py-2 sm:py-8">
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="flex flex-col gap-4 max-w-6xl mx-auto">
                            <div className="flex flex-col sm:flex-row bg-white shadow rounded-sm min-w-full">
                                <div className="sm:w-1/2 border-r">
                                    <div className="flex flex-col gap-3 my-8 mx-10">
                                        <h3 className="text-md font-[600]">Your Details</h3>
                                        <h4 className="font-medium">{buyer?.name}</h4>
                                        <div className="flex gap-2 text-sm">
                                            <p className="font-medium">Email</p>
                                            <p>{buyer?.email}</p>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <p className="font-medium">Phone Number</p>
                                            <p>{shippingInfo?.phoneNo}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <div className="flex flex-col gap-3 my-8 mx-10">
                                        <h3 className="text-md font-[600]">More Actions</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[14px]">Download Invoice</span>
                                            <Link
                                                to="/"
                                                className="bg-white py-2 px-4 w-[150px] text-center text-primaryBlue uppercase rounded-sm text-[12px] font-[600] border-[1px] border-gray-200"
                                            >
                                                Download
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {orderItems?.map((item) => {
                                const { _id, image, name, discountPrice, quantity, seller } = item;

                                return (
                                    <div
                                        className="flex flex-col sm:flex-row min-w-full shadow rounded-sm bg-white px-2 py-5"
                                        key={_id}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:w-1/2 gap-2">
                                            <div className="w-full sm:w-32 h-20">
                                                <img
                                                    draggable="false"
                                                    className="h-full w-full object-contain"
                                                    src={image}
                                                    alt={name}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1 overflow-hidden">
                                                <p className="text-sm">
                                                    {name.length > 60 ? `${name.substring(0, 60)}...` : name}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-2">
                                                    Quantity: {quantity}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Seller: {seller?.name}
                                                </p>
                                                <span className="font-medium">
                                                    ₱{(quantity * discountPrice).toLocaleString()}
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    Order Id: {paymentId}
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    Order Date: {new Date(createdAt).toDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full sm:w-1/2">
                                            <Tracker
                                                orderOn={createdAt}
                                                activeStep={
                                                    orderStatus === "Delivered"
                                                        ? 3
                                                        : orderStatus === "Out For Delivery"
                                                        ? 2
                                                        : orderStatus === "Shipped"
                                                        ? 1
                                                        : 0
                                                }
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </>
    );
};

export default OrderDetails;
