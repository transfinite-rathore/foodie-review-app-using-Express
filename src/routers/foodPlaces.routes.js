import { Router } from "express";
import {addRestaurant
    ,getRestaurant
    ,getRestaurantById
    ,updateRestaurantDetails
    ,updateRestaurantSpeciality
    ,deletRestaurantSpeciality
    ,deleteRestaurant
} from "../controllers/foodPlaces.controller.js"
import { verifyOwner } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router =Router({mergeParams:true})

router.get("/",upload.any(),getRestaurant)
// router.get("/by-category",getRestaurantByCategories)
// router.get("/by-rating",getRestaurantSortedByAvgRatings)
router.get("/:restaurantId",getRestaurantById)

//secured routes
router.post("/add",verfiyOwner,addRestaurant)
router.delete("/:restaurantId",verfiyOwner,deleteRestaurant)
router.delete("/:restaurantId/speciality",verfiyOwner,deletRestaurantSpeciality)
router.put("/:restaurantId",verfiyOwner,updateRestaurantDetails)
router.put("/:restaurantId/speciality",verfiyOwner,updateRestaurantSpeciality)


export {router}