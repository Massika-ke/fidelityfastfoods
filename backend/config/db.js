import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://massika:QWER1234@massika.imxrf.mongodb.net/food-del').then(()=>console.log("DB Connected"))
}