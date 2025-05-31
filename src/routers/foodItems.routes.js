import { Router } from "express";
import {addFoodItems
  ,getFoodItems
  ,updateFoodItems
  ,deleteFoodItems
  ,addFoodItemCategory
  ,deleteFoodItemCategory} from "../controllers/foodItems.controllers.js"

import {verifyOwner } from "../middlewares/auth.middleware.js"

const router =Router({mergeParams:true})

router.route("/").get(getFoodItems)
router.route("/:foodItemId").get(getFoodItems)


//secured route
router.route("/add").post(verifyOwner,addFoodItems)
router.route("/:foodItemId").delete(verifyOwner,deleteFoodItems)

router.route("/:foodItemId/categories")
.post(verifyOwner,addFoodItemCategory)
.delete(verifyOwner,deleteFoodItemCategory)

router.route("/:foodItemId").put(verifyOwner,updateFoodItems)

export {router}