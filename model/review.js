const { required } = require('joi');
const mongoose = require('mongoose');
const {Schema}=mongoose;

let reviewSchema=new Schema({
    comments:{
        type:String,
        required:true
        
    },
    ratings:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
});

const Review=mongoose.model("Review",reviewSchema);//Just R was not in capital so it was showing error!

module.exports=Review;

