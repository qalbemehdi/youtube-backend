import e from "express";
import cors from "cors"

const app=e();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(e.json({limit:'16kb'}))
app.use(e.urlencoded({extended:true,limit:`16kb`}))
app.use(e.static("./public"))


// routes
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users",userRouter)


export default app;