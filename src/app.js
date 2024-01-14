import e from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
const app=e();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(e.json({limit:'16kb'}))
app.use(e.urlencoded({extended:true,limit:`16kb`}))
app.use(e.static("./public"))
app.use(cookieParser())



// routes
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import tweetRouter from "./routes/tweet.routes.js";

app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/tweet",tweetRouter)

export default app;