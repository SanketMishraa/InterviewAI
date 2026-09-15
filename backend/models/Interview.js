const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    role:String,

    difficulty:String,

    question:String,

    answer:String,

    score:Number,

    confidence:String,

    clarity:String,

    technicalAccuracy:String,

    strengths:[String],

    weaknesses:[String],

    betterAnswer:String,

    tips:[String]

},{
    timestamps:true
});

module.exports=mongoose.model(
    "Interview",
    interviewSchema
);