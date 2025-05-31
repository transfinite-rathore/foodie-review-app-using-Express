import mongoose,{Schema} from "mongoose";

const foodItemsSchema=new Schema({
    foodName:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
    },
    Price:{
        type:Number,
        required:true
    },
    AvgRating:{
        type:Number,
        
    },
    ratingCount:{
        type:Number
    },
    kitchenName:{
        type:mongoose.Types.ObjectId,
        ref:"FoodPlaces"

    },
    categories:{
        type:Schema.Types.ObjectId,
        ref:"category"
    }

},{
    timestamps:true
})

export const foodItems=mongoose.model("FoodItems",foodItemsSchema)