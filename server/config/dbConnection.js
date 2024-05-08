import mongoose from 'mongoose'


export const connectDb=async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/dsaTrackerApp')
        console.log('connected to mongodb')
    } catch (error) {
        console.log(first)
    }
}