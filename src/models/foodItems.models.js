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
    price:{
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
        type:[String]
    }

},{
    timestamps:true
})

export const foodItems=mongoose.model("FoodItems",foodItemsSchema)