import mongoose,{Schema} from "mongoose";


const addressSchema=Schema({
    pinCode:{
        type:Number
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    country:{
        type:String
    }
},
{
    timestamps:true
})

const foodPlacesSchema=Schema({
    name:{
        type:String
    },

    address:addressSchema,
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    licenseNo:{
        type:String

    },
    gstinNo:{
        type:String
    },
    establishedIn:{
        type:Number
    },
    isNonVegetarian:{
        type:Boolean,
        default:false
    },
    speciality:{
        type:[String],
        default:"General"
    },
    avgRating:{
        type:Number,
        default:0
    },
    ratingCount:{
        type:Number,
        default:0
    }

},{
    timestamps:true
}
)

export const foodPlaces=mongoose.model("FoodPlaces",foodPlacesSchema)