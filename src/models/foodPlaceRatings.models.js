import mongoose, {Schema} from "mongoose";


const foodPlaceRatingSchema=Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    foodPlace:{
        type:Schema.Types.ObjectId,
        ref:"FoodPlaces"
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    }
},{timestamps:true})
export const rating=mongoose.model("foodPlaceRatings",foodPlaceRatingSchema)