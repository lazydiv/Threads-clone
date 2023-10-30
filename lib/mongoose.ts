
import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)


    if (!process.env.MONGODB_URL) return console.log('mongodb_url not found')
    if (isConnected) return console.log("Already connected to db")
    try {
        await mongoose.connect(process.env.MONGODB_URL)
    } catch(erorr) {
        console.log(erorr)
    }
}