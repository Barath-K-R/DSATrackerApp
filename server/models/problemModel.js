import mongoose from 'mongoose'

const problemSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'please,enter the name of the problem']
    },
    type:{
        type:String,
        required:[true,'please enter the type of the problem']
    },
    link:{
        type:String,
        required:[true,"pleae provide the link to leetcode problem"]
    },
    difficulty:{
        type:String,
        required:[true,'please mentin the difficulty type of problem']
    },
    hint:{
        type:String,
    },
    isCompleted:{
        type:Boolean,
        default:false,
    },
    isFavourite:{
        type:Boolean,
        default:false
    },
    TimeComplexity:{
        type:String,
        required:true
    },
    SpaceComplexity:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    }
})

export default mongoose.model('problems',problemSchema);