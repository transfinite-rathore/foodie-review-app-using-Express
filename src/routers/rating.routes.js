import { Router } from "express";
import { rateFoodItems
    ,rateFoodPlace
    ,getFoodItemRating
    ,getFoodItemReview
    ,getFoodPlacRating
    ,getFoodPlacReview
} from "../controllers/rating.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router =Router({mergeParams:true})
// app.use("/api/foodItems")'

router.route("/rating").get(getFoodPlacRating)// rating of particular restaurant
router.route("/foodItems/:foodItemId/rating").get(getFoodItemRating) // rating of particular food of specific restaurant
router.route("/review").get(getFoodPlacReview)// review of particular restaurant
router.route("/foodItems/:foodItemId/review").get(getFoodItemReview) // review of particular food of specific restaurant

//secured routes
router.route("/foodItems/:foodItemId/rate").post(verifyJWT,rateFoodItems)
router.route("/rate").post(verifyJWT,rateFoodPlace)

export {router}