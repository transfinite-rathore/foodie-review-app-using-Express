import mongoose from "mongoose"
import { review as foodItemsReview } from "../models/foodItemsReviews.models"
import { foodItems } from "../models/foodItems.models.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { foodPlaces } from "../models/foodplaces.models.js";



async function addFoodItems(req,res){
  const {foodName,price,desc,category} = req.body
  const isOwner=req.isOwner
  if(!isOwner){
    throw new APIError(400,"")
  }
  

  const kitchenDetails=await foodPlaces.findOne({owner:req.userId})

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

async function getFoodItem(req,res) {
  const restaurantId=req.params.restaurantId

  if(restaurantId){

    const category=req.query.category
    const positivereview=req.query.review
    const rating=req.query.rating
    const foodItemId=req.params.foodItemId

    if(foodItemId){
      const result=await foodItems.find({
        $and:[{
            kitchenName:mongoose.Types.ObjectId(restaurantId)
        },{
            _id:mongoose.Types.ObjectId(foodItemId)
        }]
      })
      if(!result || result.length===0){
        throw new APIError(500,"Data can't be fetched")
      }
      return res.status(200)
      .json(new APIResponse(200,"Data fetched Successfully",{"Data":result}))

    }
    else if(category){
      const categories=Array.isArray(category)?category:[category]
    let result=null
    if(!restaurantId){
      result=await foodItems.find({category : {$in:categories}})
    }
    else{
      result =await foodItems.aggregate([
        {$match:{
          kitchenName:mongoose.Types.ObjectId(restaurantId),
          category:{$in:categories}
        }},
      ])
  
    }
  
    if(!result){
      throw new APIError(500, "Database data retriveal issue")
    }
    return res.status(200)
      .json(new APIResponse(200,"Data Fetched Successfully",{"resultFoodItems":result}))
    }
    else if(positivereview){
      const resultList= await foodItemsReview.aggregate([
      { $match:{
        foodPlace:  mongoose.Types.ObjectId(restaurantId),
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

    if(!resultList){
        throw new APIError(500,"Database can't able fetch data")
    }

    return res.status(200)
    .json(new APIResponse(200,"Data fetched Successfully",{"Fetched Data":resultList}))
    }
    else if(rating){
      const result=await foodItems.aggregate([
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

    if(!result){
      throw new APIError(400,"Database error")
    }

    return res.status(200)
    .json(new APIResponse(200,"Data Fected Successfully",{"FoodItemsByRating":result}))
    }
    else{
        const result=await foodItems.find({
          kitchenName:mongoose.Types.ObjectId(restaurantId)});

        if(!result){
          throw new APIError(500,"Data can't be fetched")
        }
        return res.status(200)
        .json(new APIResponse(200,"Data fetched successfully",{"Data":result}))
    }
    
  


  }else{
    const foodItemList=await foodItems.find();

  if(!foodItemList){
    throw new APIError(500,"Failed to fetch data")
  }
  return res.status(200)
  .json(new APIResponse(200,"Data fetched successfully",{"FoodItemList":foodItemList}))
  }
  
}


"/api/restaurant/:restaurantId/category?name"
// async function getFoodItemsByCategory(req,res){

//   try {
//     const restaurantId=req.params?.restaurantId
//     const  category=req.query.category
  
//     if(!category){
//       throw new APIError(400,"Missing category")
//     }
//     const categories=Array.isArray(category)?category:[category]
//     let result=null
//     if(!restaurantId){
//       result=await foodItems.find({category : {$in:categories}})
//     }
//     else{
//       result =await foodItems.aggregate([
//         {$match:{
//           kitchenName:mongoose.Types.ObjectId(restaurantId),
//           category:{$in:categories}
//         }},
//       ])
  
//     }
  
//     if(!result){
//       throw new APIError(500, "Database data retriveal issue")
//     }
//     return res.status(200)
//       .json(new APIResponse(200,"Data Fetched Successfully",{"resultFoodItems":result}))
  
  
  
 
//   } catch (error) {
//     console.log("Error ",error)
//     res.status(500).json({error:error.message})
//   }
// }

// async function getFoodItemsByRating(req,res){
//     const restaurantId=req.params.restaurantId

//     const result=await foodItems.aggregate([
//       {
//         $match:{
//             "kitchenName": mongoose.Types.ObjectId(restaurantId)
//         }
//       },{
//         $addFields:{
//             "weightedScore":{
//               $multiply:[
//               "$avgRating", {$ln :
//               {$add:
//                 ["$ratingCount",1]
//               }}
//             ]
//           }

            
//         }
//       },{
//         $sort:{
//             weightedScore:-1
//         }
//       }

//     ])

//     if(!result){
//       throw new APIError(400,"Database error")
//     }

//     return res.status(200)
//     .json(new APIResponse(200,"Data Fected Successfully",{"FoodItemsByRating":result}))

// }

// async function getFoodItemsByMaximunPositiveReviews(req,res){

//     const restaurantId = req.params.restaurantId;

//     if(!restaurantId){
//         throw new APIError(400,"Restaurant Id Missing")
//     }

//     const resultList= await foodItemsReview.aggregate([
//       { $match:{
//         foodPlace:  mongoose.Types.ObjectId(restaurantId),
//         isNegative:false
//       }
//     },
//       { $group:{
//         _id:$food,
//         positiveReviewCount:{sum:1}
//       }
//     },
//       {
//         sort:{
//             positiveReviewCount:-1
//         }
//     }
//     ])

//     if(!resultList){
//         throw new APIError(500,"Database can't able fetch data")
//     }

//     return res.status(200)
//     .json(new APIResponse(200,"Data fetched Successfully",{"Fetched Data":resultList}))
    

// }

// async function getFoodItems(req,res){
//   const foodItemList=await foodItems.find();

//   if(!foodItemList){
//     throw new APIError(500,"Failed to fetch data")
//   }
//   return res.status(200)
//   .json(new APIResponse(200,"Data fetched successfully",{"FoodItemList":foodItemList}))

// }
// async function getFoodItemsById(req,res){
//   const foodItemId=req.params?.foodItemId

//   if(!foodItemId){
//     throw new APIError(400,"Food Item Id missing")
//   }

//   const foodItem=await foodItems.findById(foodItemId);
//   if(!foodItem){
//     throw new APIError(500,"Database issue")
//   }

//   return res.status(200)
//   .json(new APIResponse(200,"Data Fetched successfully",{"FoodItem":foodItem}))
  
// }

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

async function addFoodItemCategory(req,res){
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
  ,getFoodItems
  ,getFoodItemsByCategory
  ,getFoodItemsById
  ,getFoodItemsByMaximunPositiveReviews
  ,getFoodItemsByRating
  ,updateFoodItems
  ,deleteFoodItems
  ,addFoodItemCategory
  ,deleteFoodItemCategory
}