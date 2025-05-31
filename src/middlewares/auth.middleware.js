import jwt from "jsonwebtoken"
import {user} from "../models/users.models.js"
import { APIError } from "../utils/APIError.js"

export async function verifyJWT(req,res,next){

    try {
        const token=req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","")
    
        if(!token){
            throw new APIError(400,"Missing token")
    
        }
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const existedUser=user.findById(decodeToken?._id).select("-password -RefreshToken")
    
        if(!existedUser){
            throw new APIError(400,"Incorrect token")
        }
        req.userId=existedUser._id
    
        next()
    
    } catch (error) {
        throw new APIError(401,error)
    }
}

export async function verifyOwner(req,res,next){
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new APIError(400,"Missing token")
    
        }
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const existedUser=user.findById(decodeToken?._id).select("-password -RefreshToken")
    
        if(!existedUser){
            throw new APIError(400,"Incorrect token")
        }
        if(!existedUser.isOwner){
            throw new APIError(400,"You are not owner so not authorized for this")
        }
        req.userId=existedUser._id
        req.isOwner=true
    
        next()
    
    } catch (error) {
        throw new APIError(401,error)
    }

}