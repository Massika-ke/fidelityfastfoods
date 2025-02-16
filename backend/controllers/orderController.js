import orderModel from "../models/orderModel";
import userModel from "../models/userModel";
import Stripe from "stripe"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing an order from frontend
const placeOrder = async (req, res)=>{

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items:req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}})

    } catch (error) {
        
    }
}

export {placeOrder}