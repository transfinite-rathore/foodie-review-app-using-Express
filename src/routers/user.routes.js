import { Router } from "express";
import { registerUser,loginUser,logoutUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router =Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// Secured routes
router.route("/logout").post(verifyJWT,logoutUser)

export {router}