import mongoose,{Mongoose, Schema} from "mongoose";



const foodPlaceReviewSchema=Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    foodPlace:{
        type:Schema.Types.ObjectId,
        ref:"foodPlaces",
        reqiured:true
    },
    review:{
        type:String,
        trim:true,
        lowercase:true,
        required:true

    }
},{timestamps:true})

export const foodPlaceReview=mongoose.model("FoodPlaceReview",foodPlaceReview)