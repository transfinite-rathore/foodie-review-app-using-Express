import mongoose,{Schema} from "mongoose";


const FoodItemsratingsSchema=Schema({
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
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    }

},{
    timestamps:true
}
)

export const ratings=mongoose.model("foodItemsRatings",FoodItemsratingsSchema)