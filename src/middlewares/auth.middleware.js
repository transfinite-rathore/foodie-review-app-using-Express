import jwt from "jsonwebtoken"
import {user} from "../models/users.models.js"
import { APIError } from "../utils/APIError.js"


// Tested OK
export async function verifyJWT(req,res,next){

    try {
        console.log("cookies",req.cookies);
        
        const token=req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","")
       
               
        if(!token){
            throw new APIError(400,"Missing token")
    
        }
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        // console.log(decodeToken);
        const existedUser=await user.findById(decodeToken?._id).select("-password -RefreshToken")
    
        if(!existedUser){
            throw new APIError(400,"Incorrect token")
        }
        req.userId=existedUser._id.toString()
    
        next()
    
    } catch (error) {
        console.log("error",error);
        
        throw new APIError(401,error)
    }
}


// Tested OK
export async function verifyOwner(req,res,next){
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new APIError(400,"Missing token")
    
        }
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        //console.log(decodeToken);
        
        const existedUser= await user.findById(decodeToken._id).select("-password -RefreshToken")
    
        if(!existedUser){
            throw new APIError(400,"Incorrect token")
        }
        console.log("existedUser ",existedUser);
        
        if(!existedUser.isOwner){
            throw new APIError(400,"You are not owner so not authorized for this")
        }
        req.userId=existedUser._id.toString()
        req.isOwner=true
    
        next()
    
    } catch (error) {
        throw new APIError(401,error)
    }

}