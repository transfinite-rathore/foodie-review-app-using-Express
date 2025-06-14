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

router.get("/",getRestaurant)
// router.get("/by-category",getRestaurantByCategories)
// router.get("/by-rating",getRestaurantSortedByAvgRatings)
router.get("/:restaurantId",getRestaurantById)

//secured routes
router.post("/add",verifyOwner,addRestaurant)
router.delete("/:restaurantId",verifyOwner,deleteRestaurant)
router.delete("/:restaurantId/speciality",verifyOwner,deletRestaurantSpeciality)
router.put("/:restaurantId",verifyOwner,updateRestaurantDetails)
router.put("/:restaurantId/speciality",verifyOwner,updateRestaurantSpeciality)


export {router}