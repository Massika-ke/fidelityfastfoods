import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing an order from frontend
const placeOrder = async (req, res)=>{

    // url for redirect after payment
    const frontend_url = "http://localhost:5173/"

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

const verifyOrder = async (req,res) =>{

}

export {placeOrder, verifyOrder}