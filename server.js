const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const helmet=require('helmet');
const morgan=require('morgan');
const userRoute=require("./routes/users")
const authRoute=require("./routes/auth")
const postRoute=require("./routes/posts")
dotenv.config()

//connecting mongodb
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    
    useUnifiedTopology:true,
}).then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log("no mongo connection"+err);
})

//setting up middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/posts',postRoute)

//listening to port
app.listen(8000,()=>{
    console.log('server started in port 8000...')
})