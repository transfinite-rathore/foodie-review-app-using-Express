import express from "express"
import dotenv from "dotenv"
import connectDB from "./DB/app.js"

import {router as foodPlaceRouter} from "./routers/foodPlaces.routes.js"
import {router as foodItemRouter} from "./routers/foodItems.routes.js"
import {router as userRouter} from "./routers/user.routes.js"
import {router as ratingRouter} from "./routers/rating.routes.js"

import {upload} from "./middlewares/multer.middleware.js"
import cookieParser from "cookie-parser"

const app=express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

dotenv.config(
    {path:"env"}
)

connectDB()


app.use("/api/users",upload.any(),userRouter)
app.use("/api/restaurant",upload.any(),foodPlaceRouter)
app.use("/api/restaurant/:restaurantId",ratingRouter)
app.use("/api",ratingRouter)

app.use("/api/restaurant/:restaurantId/foodItems",foodItemRouter)
app.use("/api/foodItems",foodItemRouter)


app.listen(process.env.PORT_NUMBER,()=>{
    console.log("Server is listening");
    
})