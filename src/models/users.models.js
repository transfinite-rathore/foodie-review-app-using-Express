import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=Schema({
    fullName:{
        type:String,
        trim:true,
        required:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        required:true
    },
    mobileNumber:{
        type:String,
        required:true
    },
    isOwner:{
        type:Boolean,
        default:false
    },
    RefreshToken:{
        type:String
    }


},{
    timestamps:true
})
// userSchema.pre("save", async function(next){
//     if(!this.isModified("password")) 
//         return next();
//     this.password=await bcrypt.hash(this.password,10);
//     return next()
// })


userSchema.pre("save",async function(next){

    if(this.isModified("password")){
    this.password= await bcrypt.hash(this.password,10)
    return next()  
    }
    return next()
    
})
userSchema.methods.isPasswordCorrect=async function(password) {
   return await  bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken= async function (){
    return await jwt.sign({
        _id:this._id,
        email:this.email,
        isOwner:this.isOwner
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken=async function() 
{
    return await jwt.sign(
        {
            _id:this._id,
            isOwner:this.isOwner

        },
        process.env.REFRESH_TOKEN_SECRET
        ,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )    
}
export const user=mongoose.model("User",userSchema)