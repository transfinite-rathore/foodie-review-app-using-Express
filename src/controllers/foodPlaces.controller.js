import { APIError } from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
import {foodPlaces} from "../models/foodplaces.models.js"



async function getRestaurant(req,res){
    const city= req.body?.city
    const restrauntList = await foodPlaces.find(
    {
        "address.city":city
    }
)
    if(!restrauntList){
        throw new APIError(500,"Database fetch error")
    }
    return res.status(200)
    .json(200,"Data fetched Successfully",restrauntList)

}

const getRestaurantSortedByAvgRatings= async function (req,res) {

    const {city}=req?.query?.city
    if(!city){
        throw new APIError("City name is not available")
    }

    const sortedRestaurantList= await foodPlaces.find({"address.city":city}).sort({rating:1})

    if(!sortedRestaurantList){
        throw new APIError(500,"DB can't fetch data")
    }
    
    return res.status(200)
    .json(new APIResponse(200,"List fetched Successfully",sortedRestaurantList));

    
}

const getRestaurantByCategories= async function (req,res,sort=null) {


    const category=req.query?.category.split(",");

    const resturantList=await foodPlaces.find({
      "category":{$all:category}
    })
    if(sort){
        resturantList.sort()
    }
    
    if(!resturantList){
        throw new APIError(500,"Database issue")
    }

    return res.status(200)
    .json(new APIResponse(200,"Data fetched successfully",resturantList))
}

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

const updateRestaurantDetails=async function(req,res){

    const updateList=req.body
    const restaurantId=req.params.restaurantId
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

const deletRestaurant=async function(req,res){

}
const deletRestaurantSpeciality=async function(req,res){
    
}


export {addRestaurant
    ,getRestaurant
    ,getRestaurantSortedByAvgRatings
    ,getRestaurantByCategories
    ,addSpecality
    ,updateRestaurantDetails
    
    
}