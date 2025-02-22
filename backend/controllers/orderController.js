import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing an order from frontend
const placeOrder = async (req, res)=>{

    // url for redirect after payment
    const frontend_url = "http://localhost:5173"

    try {
        // initializes order in the db
        const newOrder = new orderModel({
            userId: req.body.userId,
            items:req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();

        // cart reset after order
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}})
        // stripe payment setup
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency: "kes",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))

        // Delivery fees
        line_items.push({
            price_data:{
                currency: "kes",
                product_data:{
                    name: "Delivery Charges"
                },
                unit_amount: 2*100
            },
            quantity:1
        })

        // checkout session
        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder.id}`, // return session url for frontend redirect
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder.id}`
        })
        res.json({success:true, session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
        
    }
}

// verify payment and update db
// const verifyOrder = async (req, res) =>{
//     const {orderId, success} = req.body;    

//     try {

//         if (success === "true") {
//             await orderModel.findByIdAndUpdate(orderId, {payment: true});
//             res.json({
//                 success:true, 
//                 message: "Payment Verified"
//             });
//         }
//         else {
//             await orderModel.findByIdAndDelete(orderId);
//             res.json({
//                 success:false, 
//                 message: "Payment Verification Failed"
//             })
//         }
//     } catch (error) {
//        console.error(error);
//         res.json({
//             success:false, 
//             message: "Error"
//         })

//     }
// }
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({
                success: true,
                message: "Payment Verified",
            });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({
                success: false,
                message: "Payment Verification Failed",
            });
        }
    } catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// frontend user orders
const userOrders = async (req, res) =>{

    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({
            success: true,
            data: orders
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Error"
        })
    }
}


export {placeOrder, verifyOrder, userOrders}