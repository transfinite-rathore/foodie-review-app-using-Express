import { Router } from "express";
import {addFoodItems
  ,getFoodItem
  ,getFoodItemById
  ,updateFoodItems
  ,deleteFoodItems
  ,addFoodItemCategory
  ,deleteFoodItemCategory} from "../controllers/foodItems.controllers.js"

import {verifyOwner } from "../middlewares/auth.middleware.js"

const router =Router({mergeParams:true})

router.route("/").get(getFoodItem)
router.route("/:foodItemId").get(getFoodItemById)


//secured route
router.route("/add").post(verifyOwner,addFoodItems)
router.route("/:foodItemId").delete(verifyOwner,deleteFoodItems)

router.route("/:foodItemId/categories")
.put(verifyOwner,addFoodItemCategory)
.delete(verifyOwner,deleteFoodItemCategory)

router.route("/:foodItemId").put(verifyOwner,updateFoodItems)

export {router}