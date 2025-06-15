import { APIError } from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
import {foodPlaces} from "../models/foodplaces.models.js"
import mongoose from "mongoose";

// All APIs are Tested OK

//  Tested OK(except average rating)
async function getRestaurant(req,res){
    const city= req.query?.city
    const speciality=req.query?.speciality?.split(",");
    const sort=req.query.sort
    const avgRating=req.query.avgRating
    let restrauntList=null
    if(speciality){
        console.log("spe",speciality)
        restrauntList=await foodPlaces.find({
      "speciality":{$all:speciality}
        })
        if(sort){
            restrauntList.sort()
        }
        
        // if(!resturantList){
        //     throw new APIError(500,"Database issue")
        // }

        // return res.status(200)
        // .json(new APIResponse(200,"Data fetched successfully",resturantList))
        
    }
    else if(avgRating){
        restrauntList= await foodPlaces.find({"address.city":city}).sort({rating:1})

        // if(!sortedRestaurantList){
        //     throw new APIError(500,"DB can't fetch data")
        // }
        
        // return res.status(200)
        // .json(new APIResponse(200,"List fetched Successfully",sortedRestaurantList));

    }
    else if(city){
        restrauntList = await foodPlaces.find(
            {
                "address.city":city
            }
        )
            
    }
    else{
        restrauntList = await foodPlaces.find()
    }

    if(!restrauntList){
        throw new APIError(500,"Database fetch error")
    }
    // console.log(restrauntList);
    
    return res.status(200)
        .json(new APIResponse(200,"Data fetched Successfully",{"listLength":restrauntList.length,"restrauntList":restrauntList}))

}


// Tested OK
async function getRestaurantById(req,res){
    const restaurantId= req.query.restaurantId
    const restrauntList = await foodPlaces.findById(restaurantId)
    if(!restrauntList){
        throw new APIError(500,"Database fetch error")
    }
    return res.status(200)
    .json(200,"Data fetched Successfully",restrauntList)

}


// Tested OK
async function addRestaurant(req,res){
    const details=req.body
    const ownerId=req.userId
    if(!details?.pinCode){
        throw new APIError(400,"Pincode of place missing")
    }
    if(!details?.state){
        throw new APIError(400,"State of place missing")
    }
    if(!details?.city){
        throw new APIError(400,"City of place missing")
    }
    if(!details?.country){
        throw new APIError(400,"Country of place missing")
    }


    if(!details?.name){
        throw new APIError(400,"Name of place missing is missing")
    }
    //finding owner needs token and cookies
    
    if(!details?.licenseNo){
        throw new APIError(400,"License no is missing")
    }
    if(!details?.gstinNo){
        throw new APIError(400,"GSTIN No. is missing")
    }

    
    const result=await foodPlaces.create({
        "name":details.name,
        "owner":ownerId,
        "licenseNo":details.licenseNo,
        "gstinNo":details.gstinNo,
        "establishedIn":details?.establishedIn,
        "speciality":details?.speciality,
        "isNonVegetarian":details?.isNonVegetarian,
        "address":{
            "pinCode":details.pinCode,
            "city":details.city,
            "state":details.state,
            "country":details.country
            
        }
        
    })



    if(!result){
        throw new APIError(500,"Database issue")
    }
    return res.status(200).json(
        new APIResponse(200,"Data Saved Successfully",{"savedId":result._id,"savedName":result.name})
    )


}

// Tested OK
const addSpecality=async function(req,res){
    const speciality=req.body?.speciality
    const restaurantId=req.params?.restaurantId


    if(!speciality){
        throw new APIError(400,"Specialtiy data missing")
    }
    if(!restaurantId){
        throw new APIError(400,"Restaurant Id missing")
    }
    const specialityArray= Array.isArray(speciality)?speciality:Array(speciality)

    const exsitingRestaurant=await foodPlaces.findById(restaurantId)

    if(!exsitingRestaurant){
        throw new APIError(400,"")
    }

    if( exsitingRestaurant.speciality.length ===1 && exsitingRestaurant.speciality[0]==="General" ){
        exsitingRestaurant.speciality=specialityArray
    }
    else{
        exsitingRestaurant.speciality.push(...specialityArray)
    }
    await exsitingRestaurant.save()
    return res.status(200)
    .json(new APIResponse(200,"Updated successfully",exsitingRestaurant.speciality))

}

// Tested OK
const updateRestaurantDetails=async function(req,res){

    const updateList=req.body
    const restaurantId=new mongoose.Types.ObjectId(req.params.restaurantId)
    console.log(req.body);
    
    if((!updateList) || (Object.entries(updateList).length ===0)){
        throw new APIError(400,"Data Missing")
    }

    const existingRestaurant= await foodPlaces.findById(restaurantId);

    if(!existingRestaurant){
        throw new APIError(400,"Restaurant Details does not match")
    }
    for(let [feild,value] of Object.entries(updateList)){
        if(feild !== "speciality"){
             existingRestaurant[feild]=value
        }
       
    }

    await existingRestaurant.save();

    return res.status(200)
    .json(new APIResponse(200,"Details Update Successfully",existingRestaurant))

}

// Tested OK
const deleteRestaurant=async function(req,res){
    const restaurantId=req.params.restaurantId

    if(!restaurantId){
        throw new APIError(400,"Delete id missing")
    }

    const deletedRecord=await foodPlaces.findByIdAndDelete(restaurantId)

    if(!deletedRecord){
        throw new APIError(500,"Deletion failed")
    }
    return res.status(200)
        .json(new APIResponse(200,"Data Deletion successfull",{"DeletedData":deletedRecord}))

}

// Tested OK
const deleteRestaurantSpeciality=async function(req,res){

    let restaurantId=req.params.restaurantId
    let speciality=req.body.speciality

    if(!restaurantId){
        throw new APIError(400,"Restaurant id missing")
    }
    speciality=Array.isArray(speciality)?speciality:speciality?[speciality]:[]
    if(speciality.length===0){
        throw new APIError(400,"No data to delete")
    }
    restaurantId=new mongoose.Types.ObjectId(restaurantId)
    // console.log("id ",restaurantId,typeof restaurantId);
    

    // const details=await foodPlaces.find({_id:restaurantId})
    // console.log("details ",details);
    console.log("specality ",speciality)
    const updatedData=await foodPlaces.findByIdAndUpdate(
        restaurantId,
        { $pull:{ 
            speciality:{ 
                $in:speciality
            }
        }
    },
        {new :true}
    )
    console.log(updatedData)
    if(!updatedData){
        throw new APIError(500,"Data can't be updated")
    }
    return res.status(200)
    .json(new APIResponse(200,"Speciality Updated Successfully",{"UpdatedData":updatedData}))
    
}


//Tested OK
async function deleteAllRestaurantSpeciality(req,res){
    const restaurantId=req.params.restaurantId

    if(!restaurantId){
        throw new APIError(400,"Delete id missing")
    }

    const exsitingRestaurant=await foodPlaces.findById(restaurantId)

    if (!exsitingRestaurant) {
      throw new APIError(404, "Restaurant not found");
    }

    exsitingRestaurant.speciality=[]
    const updatedData=await exsitingRestaurant.save()

    if(!updatedData){
        throw new APIError(500,"Data can't be updated")
    }
    return res.status(200)
    .json(new APIResponse(200,"Speciality Deleted Successfully",{"UpdatedData":updatedData}))
}

export {addRestaurant
    ,getRestaurant
    ,getRestaurantById
    ,addSpecality
    ,updateRestaurantDetails
    ,deleteRestaurant
    ,deleteRestaurantSpeciality
    ,deleteAllRestaurantSpeciality
}





// const getRestaurantSortedByAvgRatings= async function (req,res) {

//     const {city}=req?.query?.city
//     if(!city){
//         throw new APIError("City name is not available")
//     }

//     const sortedRestaurantList= await foodPlaces.find({"address.city":city}).sort({rating:1})

//     if(!sortedRestaurantList){
//         throw new APIError(500,"DB can't fetch data")
//     }
    
//     return res.status(200)
//     .json(new APIResponse(200,"List fetched Successfully",sortedRestaurantList));

    
// }

// const getRestaurantByCategories= async function (req,res,sort=null) {


//     const category=req.query?.category.split(",");

//     const resturantList=await foodPlaces.find({
//       "category":{$all:category}
//     })
//     if(sort){
//         resturantList.sort()
//     }
    
//     if(!resturantList){
//         throw new APIError(500,"Database issue")
//     }

//     return res.status(200)
//     .json(new APIResponse(200,"Data fetched successfully",resturantList))
// }