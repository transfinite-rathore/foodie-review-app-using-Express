import mongoose from "mongoose"
import { review as foodItemsReview } from "../models/foodItemsReviews.models.js"
import { foodItems } from "../models/foodItems.models.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { foodPlaces } from "../models/foodplaces.models.js";


// Tested OK
async function addFoodItems(req,res){

  
  const {foodName,price,desc,category} = req.body

  const isOwner=req.isOwner
  if(!isOwner){
    throw new APIError(400,"You are not authorized to add food Items")
  }
  

  const kitchenDetails=await foodPlaces.findOne({owner:req.userId})
  if(!kitchenDetails){
    throw new APIError(400,"No Kitchen found on owner details")
  }
  if(!foodName){
    throw new APIError(400,"Name is missing")
  }
  if(!price){
    throw new APIError(400,"Price is missing")
  }
  
  const categories=Array.isArray(category)?category:[category]
  
  const savedItem=await foodItems.create({
    foodName,
    description:desc,
    price,
    kitchenName:kitchenDetails._id,
    categories
    

  })
  if(!savedItem){
    throw new APIError(500,"Issue while saving data")
  }

  return res.status(200).json(new APIResponse(200,"Data saved successfully",{"SavedData":savedItem._id}))

}

// Tested OK
async function getFoodItemById(req,res){

  const restaurantId=req.params.restaurantId
  const foodItemId=req.params.foodItemId
 
  if(!restaurantId){
    throw new APIError(400,"No restaurant Data found")
  }

  const result=await foodItems.find({
        $and:[{
            kitchenName: new mongoose.Types.ObjectId(restaurantId)
        },{
            _id: new mongoose.Types.ObjectId(foodItemId)
        }]
      })
 
  
  if(!result){
    throw new APIError(500,"Food Item Data can't be fetched now")
  }
  return res.status(200)
  .json(new APIResponse(200,"Data fetched successfully",{data:result}))
}


// get items using category default,restarant id Tested OK
async function getFoodItem(req,res) {


  /*
  Fetch a specific food item by restaurantId
  Fetch food items by category for a restaurant.
  Fetch food items with most positive reviews for a restaurant.
  Fetch food items sorted by a custom weighted rating formula for a restaurant.
  Default: fetch all food items .
  */ 
  const restaurantId=req.params.restaurantId
  let result =null
  let flag=0
  const reason={
    0:"default",
    1:"category",
    2:"positiveReview",
    3:"rating",
    4:"restaurantID"
  }
  if(restaurantId){

    const category=req.query.category
    const positivereview=req.query.review
    const rating=req.query.rating
   
    
    
    if(category){

        const categorys=Array.isArray(category)?category:[category]
        result =await foodItems.aggregate([
          {$match:{
            kitchenName: new mongoose.Types.ObjectId(restaurantId),
            categories:{$in:categorys}
          }},
        ])
        flag=1
    }
    else if(positivereview){
        result= await foodItemsReview.aggregate([
        { $match:{
          foodPlace: new  mongoose.Types.ObjectId(restaurantId),
          isNegative:false
        }
      },
        { $group:{
          _id:"$food",
          positiveReviewCount:{$sum:1}
        }
      },
        {
          sort:{
              positiveReviewCount:-1
          }
      }
      ])
      flag=2
    }
    else if(rating) {

        result=await foodItems.aggregate([
        {
          $match:{
              "kitchenName": mongoose.Types.ObjectId(restaurantId)
          }
        },{
          $addFields:{
              "weightedScore":{
                $multiply:[
                "$avgRating", {$ln :
                {$add:
                  ["$ratingCount",1]
                }}
              ]
            }

              
          }
        },{
          $sort:{
              weightedScore:-1
          }
        }

      ])
      flag=3

    }
    else{
      result= await foodItems.find({
        kitchenName: new mongoose.Types.ObjectId(restaurantId)
      });
      flag=4
    }
  }
  
  else{
      result =await foodItems.find()
  }

  if(!result){
    throw new APIError(500,"No data fetched")
  }
  return res.status(200)
  .json(new APIResponse(200,`Data feteched successfully by ${reason[flag]}`,{"data":result}))
}

async function updateFoodItems(req,res){
    try {
    const { foodItemId } = req.params;
    const updateData = req.body; // data to update

    // Validate foodItemId if needed, then:
    const updatedItem = await foodItems.findByIdAndUpdate(
      foodItemId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    return res.status(200).json({
      message: "Food item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

//Tested OK
async function addFoodItemCategory(req,res){
  console.log(123,req.body,req);
  
  const foodItemId=req.params.foodItemId

  let categories=Array.isArray(req.body?.categories)?req.body.categories:req.body.categories?[req.body.categories]:[]
  if(!foodItemId){
    throw new APIError(400,"Food Item id missing")
  }
  if(!categories || categories.length<1){
    throw new APIError(400,"Adding categories not provided")
  }

  const existingData=await foodItems.findById(foodItemId)
  if(!existingData){
    throw new APIError(500,"No Exisiting data matched")
  }

  // Avoid duplicate entries
  const newCategories = categories.filter(
      (cat) => !existingData.categories.includes(cat)
    );


  // categories.forEach(category => {
  //   existingData?.categories.push(category)
  // });
  existingData.categories.push(...newCategories)
  const updatedData=await existingData.save()
  if(!updatedData){
    throw new APIError(500,"Data is not updated")
  }

  return res.status(200).json(new APIResponse(200,"Categories Updated Successfully",{"UpdatedData":updatedData.categories}))

    
}

// Tested OK
async function deleteFoodItemCategory(req,res){
  const category=req.body.categories
  const foodItemId=req.params.foodItemId
  if(!foodItemId){
    throw new APIError(400,"Food Item Id missing")
  }

   if (!category || (Array.isArray(category) && category.length === 0)) {
      throw new APIError(400, "No categories provided for deletion");
    }
  const existingData=await foodItems.findById(foodItemId)
  if(!existingData){
    throw new APIError(500,"No matching data in DB")
  }
  const deleteCategory=Array.isArray(category)?category:[category]

  existingData.categories = existingData.categories.filter(
      (cat) => !deleteCategory.some(
        (delCat) => cat.toString() === delCat.toString()
      )
    );

  const updatedData = await existingData.save();

  if(!updatedData){
    throw new APIError(500,"Updation failed")
  }

  return res.status(200).json(new APIResponse(200,"Data updation successfull",{"updatedData":updatedData.categories}))
}

// Tested OK
async function deleteFoodItems(req,res){


  try {
    const foodItemId=req.params?.foodItemId
    if(!foodItemId){
      throw new APIError(400,"Food Id missing")
    }

    const deletedItem=await foodItems.findByIdAndDelete(foodItemId)

    if(!deletedItem){
        throw new APIError(500,"Database issue while deleting")
    }

    res.status(200).json(
      new APIResponse(200,"Delete Successful",{"DeletedRecord":deletedItem})
    )


  } catch (error) {
    res.status(500).json({error:error.message})
  }
  
}


export {addFoodItems
  ,getFoodItem
  ,updateFoodItems
  ,deleteFoodItems
  ,addFoodItemCategory
  ,deleteFoodItemCategory
  ,getFoodItemById
}