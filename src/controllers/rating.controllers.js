import {user as User} from "../models/users.models.js"
import {foodItems} from "../models/foodItems.models.js"
import { foodPlaces } from "../models/foodplaces.models.js"
import { APIError } from "../utils/APIError.js"
import { APIResponse } from "../utils/APIResponse.js"
import { ratings } from "../models/foodItemsratings.models.js"
import { rating as foodPlaceRating } from "../models/foodPlaceRatings.models.js"
import { review as foodReview } from "../models/foodReviews.models.js"
import { foodPlaceReview } from "../models/foodPlaceReview.models.js"
import mongoose from "mongoose"
import { application } from "express"


function updateAverageRating(oldAverage,oldRating,newRating,totalCount,isDuplicate=true){
    const totalRating=oldAverage*totalCount
    const updatedRating=isDuplicate?totalRating-oldRating+newRating:totalRating+newRating
    const updatedAvgRating=isDuplicate?updatedRating/totalCount:updateRating/(totalCount+1)
    return updatedAvgRating

}

async function rateFoodItems(req,res){
    // get user id,foodplace id, fooditem id
    // get ratings
    // check rating is between 1 to 5
    // then add data to table
    // update food average rating 
    // restaurantId
    // foodItemId
    
    const foodPlaceId=req.params?.restaurantId
    const foodItemId=req.params?.foodItemId
    const user=req.userId
    const {rating}=req.body
    const {review}=req.body

    if(!foodPlaceId){
        throw new APIError(400,"Restaurant id missing")
    }
    if(!foodItemId){
        throw new APIError(400,"Food id missing")
    }

    // database calls
    // first get user
    // then get place
    // then get food item

    const foodPlace=await foodPlaces.findById(foodPlaceId)
    if(!foodPlace){
        throw new APIError(400,"Restaurant is not in DB")
    }

    const foodItem=await foodItems.findById(foodItemId)

    if(!foodItem){
        throw new APIError(400,"Food is not in DB")
    }

    const ratingUser=await User.findById(user)
    if(!ratingUser){
        throw new APIError(400,"User is not in DB")
    }

    // maybe this is user not first rating for same item of same place 

    const exsitingRatingByUser=await ratings.findOne({
        $and:[
            {user : user},
            {food : foodItemId},
            {foodPlace : foodPlaceId}
        ]
    })
    if(exsitingRatingByUser){
        const oldRating=exsitingRatingByUser.rating
        exsitingRatingByUser.rating=rating
        await exsitingRatingByUser.save()


        // updateAverageRating(foodItem?.AvgRating,oldRating,rating,foodItem?.ratingCount)

        // const newAvgrating=((foodItem?.AvgRating*foodItem?.ratingCount)-oldRating+rating)/(foodItem?.ratingCount)
        foodItem.AvgRating=updateAverageRating(foodItem?.AvgRating,oldRating,rating,foodItem?.ratingCount).toFixed(1)
        await foodItem.save()
    }
    else{
        await ratings.create({
        user:ratingUser._id,
        food:foodItem._id,
        foodPlace:foodPlace._id,
        rating
    })

    // const newAvgrating=((foodItem?.AvgRating*foodItem?.ratingCount)+rating)/(foodItem?.ratingCount+1)
    foodItem.AvgRating=updateAverageRating(foodItem?.AvgRating,oldRating,rating,foodItem?.ratingCount,false).toFixed(1)
    foodItem.ratingCount=foodItem.ratingCount+1
    await foodItem.save()
    }
    let newReview=null
    if(review && review.trim().length>0){
        const isNegative= rating<2;
        foodReview.create({
            user:userId,
            food:foodItemId,
            foodPlaces:foodPlaceId,
            review,
            isNegative
        })
        newReview= await foodReview.save();


    }
    return res.status(200)
    .json(new APIResponse(200,"Food Item rating and review added successfully",{"FoodId":foodItemId,"review":newReview}))
    
}

async function rateFoodPlace(req,res){

    const foodPlaceId=req.params?.restaurantId
    const userId=req.userId
    const {givenRating}=req.body
    const {givenReivew}=req.body

    if(!foodPlaceId){
        throw new APIError(400,"Restaurant id missing")
    }

    const foodPlace=await foodPlaces.findById(foodPlaceId)
    if(!foodPlace){
        throw new APIError(400,"Food Place not in DB")
    }
    const exsitingUser= await User.findById(userId)
    const existingRating = await foodPlaceRating.findOne({user:userId,foodPlace:foodPlaceId})

    if(existingRating){
        const oldRating=existingRating.rating
        existingRating.rating=givenRating
        await existingRating.save()
        //ratingCount
        // const updatedRating=((foodPlace?.avgRating*foodPlace?.ratingCount)-oldRating+givenRating)/foodPlace?.ratingCount
        foodPlace.avgRating=updateAverageRating(foodItem?.AvgRating,oldRating,rating,foodItem?.ratingCount).toFixed(1)
        await foodPlace.save()
    

    }
    else{
        await foodPlaceRating.create({
            user:exsitingUser._id,
            foodPlace:foodPlace._id,
            rating:givenRating
        })
        // const updatedRating=((foodPlace?.avgRating*foodPlace?.ratingCount)+givenRating)/(foodPlace?.ratingCount+1)
        foodPlace.avgRating=updateAverageRating(foodItem?.AvgRating,oldRating,rating,foodItem?.ratingCount,false).toFixed(1)
        foodPlace.ratingCount=foodPlace.ratingCount+1
        await foodPlace.save()
    }

    // update average rating for foodplace
    let newReview=null
    if(givenReivew && givenReivew.trim().length>0){
        newReview=await foodPlaceReview({
            user:userId,
            foodPlace:foodPlaceId,
            givenReivew
        })
        foodPlaceReview.save()
    }

    res.status(200)
    .json(new APIResponse(200,"Rating and Review added successfully",{"Food Place id":foodPlaceId,"New Review":newReview}))


}

async function getFoodItemRating(){
    const foodItemId=req.params.foodItemId
    const restaurantId=req.params.restaurantId
    let result=null
    if(restaurantId){
        if(!foodItemId){
            throw new APIError(400,"Item Id missing")
        }
        result=await ratings.find({
           
                food:mongoose.Types.ObjectId(foodItemId)
            ,
                foodPlace:mongoose.Types.ObjectId(restaurantId)
           
        })
    }
    else{
        if(!foodItemId){
            throw new APIError(400,"Item Id missing")
        }
        result=await ratings.findById(foodItemId)
    }
    if(!result || result.length ===0){
        throw new APIError(500,"data fetched issue")
    }
    return res.status(200)
    .json(new APIResponse(200,"Data Fetched successfully",{"data":result}))

}
async function getFoodItemReview(){
    const foodItemId=req.params.foodItemId
    const restaurantId=req.params.restaurantId
    let result=null
  
    if(restaurantId){
         if(!foodItemId){
            throw new APIError(400,"Item Id missing")
        }
        result=await foodPlaceReview.find({
           
                food:mongoose.Types.ObjectId(foodItemId)
            ,
                foodPlace:mongoose.Types.ObjectId(restaurantId)
           
        })
        
    }
    else{
          if(!foodItemId){
            throw new APIError(400,"Item Id missing")
        }
        result=await foodPlaceReview.findById(foodItemId)

    }
    if(!result || result.length ===0){
        throw new APIError(500,"data fetched issue")
    }
    return res.status(200)
    .json(new APIResponse(200,"Data Fetched successfully",{"data":result}))
}
async function getFoodPlacRating(){
    const restaurantId=req.params.restaurantId
    if(!restaurantId){
        throw new APIError(400,"Restaurant Id missing")
    }
    const result=foodPlaceRating.findById(restaurantId)

    if(!result || result.length ===0){
        throw new APIError(500,"Data can't be fetched")

    }

    return res.status(200)
    .json(new APIResponse(200,"Data fetched successfuly",{"data":result}))

}

async function getFoodPlacReview(){
    const restaurantId=req.params.restaurantId
    if(!restaurantId){
        throw new APIError(400,"Restaurant Id missing")
    }
    const result=foodPlaceReview.findById(restaurantId)

    if(!result || result.length ===0){
        throw new APIError(500,"Data can't be fetched")

    }

    return res.status(200)
    .json(new APIResponse(200,"Data fetched successfuly",{"data":result}))

}


export {rateFoodItems
    ,rateFoodPlace
    ,getFoodItemRating
    ,getFoodItemReview
    ,getFoodPlacReview
    ,getFoodPlacRating
}
