import mongoose,{Schema} from "mongoose";



const reviewSchema=Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    food:{
        type:Schema.Types.ObjectId,
        ref:"FoodItems"
    },
    foodPlace:{
        type:Schema.Types.ObjectId,
        ref:"FoodPlaces"
    },
    reviews:{
        type:String,
        required:true
    },
    isNegative:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
})

export const review=mongoose.model("Review",reviewSchema)