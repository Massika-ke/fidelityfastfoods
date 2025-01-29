import userModel from "../models/userModel.js";

// adding items to cart
const addToCart = async (req, res)=>{
    try {
        // find the user by id & get user's cart data
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;

        // check if item exists in cart
        if (!cartData[req.body.itemId]) {
            // if item doesnt exists initialize with 1
            cartData[req.body.itemId] = 1;
        }else{
            // otherwise increment by 1
            cartData[req.body.itemId] += 1;
        }

        // update the user cart in db
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({
            success:true, 
            message:"Added to cart"
        })

    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Error"
        })
    }
}

// removing from cart
const removeFromCart = async(req, res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;

        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({
            success: true, 
            message:"Item Removed"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Error"
        })
    }
}

// fetch user cart data
const getCart = async(req, res)=>{

}

export {addToCart, removeFromCart, getCart};