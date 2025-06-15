import { Router } from "express";
import {addRestaurant
    ,getRestaurant
    ,getRestaurantById
    ,updateRestaurantDetails
    ,deleteRestaurantSpeciality
    ,deleteAllRestaurantSpeciality
    ,deleteRestaurant,
    addSpecality
} from "../controllers/foodPlaces.controller.js"
import { verifyOwner } from "../middlewares/auth.middleware.js";


const router =Router({mergeParams:true})

router.get("/",getRestaurant)
router.get("/:restaurantId",getRestaurantById)

//secured routes
router.post("/add",verifyOwner,addRestaurant)
router.delete("/:restaurantId",verifyOwner,deleteRestaurant)
router.post("/:restaurantId/speciality",verifyOwner,addSpecality)
router.put("/:restaurantId",verifyOwner,updateRestaurantDetails)
router.delete("/:restaurantId/speciality",verifyOwner,deleteAllRestaurantSpeciality)
router.put("/:restaurantId/speciality",verifyOwner,deleteRestaurantSpeciality)


export {router}




// router.get("/by-category",getRestaurantByCategories)
// router.get("/by-rating",getRestaurantSortedByAvgRatings)