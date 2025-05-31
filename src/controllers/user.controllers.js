import {APIError} from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
import {user} from "../models/users.models.js"



const generateAccessAndRefreshTokens= async function(userId){
    try {
        const user=await UserActivation.findOne(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.RefreshToken=refreshToken
        await  user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
        
    } catch (error) {
        throw new APIError(500,"Issue while generating Access and Refresh Token")
    }
}

async function registerUser(req,res){

}

async function loginUser(req,res){
    // todos for login a user
    // get username email and password
    // check if username ad email exist or not
    // is user exist match password
    // if password is correct add cookies with access token and save refresh token in db

    const {userName,email,password}=req.body

    if(!userName && !email){
        throw new APIError("Username and email empty")
    }
    const existedUser=await user.findOne({
        $or:[{userName},{email}]
    })

    if(!existedUser){
        throw new APIError("No user exist with given email and username")
    }
    const uservalidation= await existedUser.isPasswordCorrect(password)

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(existedUser._id)


    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accesstoken",accessToken,options)
    .cookie("refreshtoken",refreshToken,options)
    .json(new APIResponse(200,"user logged in"
        ,{
            userId:existedUser._id,
            accessToken,
            refreshToken
    }))
}

async function logoutUser(req,res){


    const userId=req?.userId

    const loggedOutUser= await user.findByIdAndUpdate(
        userId,
        {
            $set:{
                RefreshToken: undefined
            }
        },
        {
            new:true
        }
    ).select("-password -RefreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .clearCookie(accessToken,options)
    .clearCookie(refreshToken,options)
}

export {registerUser,loginUser,logoutUser}