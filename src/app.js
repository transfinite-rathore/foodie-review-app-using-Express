import express from "express"
import dotenv from "dotenv"
import connectDB from "./DB/app.js"
import {router as foodPlaceRouter} from "./routers/foodPlaces.routes.js"
import {router as foodItemRouter} from "./routers/foodItems.routes.js"
import {router as userRouter} from "./routers/user.routes.js"
// import {router as authRouter} from "./routers/auth.routes.js"
import {router as ratingRouter} from "./routers/rating.routes.js"

import {upload} from "./middlewares/multer.middleware.js"

const app=express()

dotenv.config(
    {path:"env"}
)
connectDB()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users",userRouter)
app.use("/api/restaurant",foodPlaceRouter)
app.use("/api/restaurant/:restaurantId",ratingRouter)
app.use("/api",ratingRouter)
app.use("/api/restaurant/:restaurantId/foodItems",foodItemRouter)
app.use("/api/foodItems",foodItemRouter)

// app.get("/",(req,res)=>{
//     res.send("hello world")
// })

app.listen(process.env.PORT_NUMBER,()=>{
    console.log("Server is listening");
    
})