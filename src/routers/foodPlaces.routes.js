import { Router } from "express";
import {addRestaurant,getRestaurant,getRestaurantSortedByAvgRatings,getRestaurantByCategories} from "../controllers/foodPlaces.controller.js"
import { verfiyOwner } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router =Router({mergeParams:true})

// router.get("/",hello)
router.get("/",upload.any(),getRestaurant)
router.get("/by-category",getRestaurantByCategories)
router.get("/by-rating",getRestaurantSortedByAvgRatings)

//secured routes
router.post("/add",verfiyOwner,addRestaurant)


export {router}