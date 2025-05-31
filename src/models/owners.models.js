import mongoose,{ Schema} from "mongoose";


const ownerSchema=Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    businessName:{
        type:String,
        required:true,

    },
    certified:{
        type:Boolean,
        default:false
    },


},{
    timestamps:true
})

export const owner=mongoose.model("Owner",ownerSchema)