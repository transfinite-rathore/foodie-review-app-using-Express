import mongoose,{Schema} from "mongoose";


const categorySchema =Schema({

},{
    timestamps:true
})

export const category=mongoose.model("category",categorySchema)