import express , {Request  ,Response} from 'express'
import dotenv = require('dotenv')
import cors from 'cors'
import {connectDB} from './config/db'
import { userRouter as userRoutes } from './routes/userRoutes'
import {categoryRouter as categoryRoutes} from './routes/categoryRoutes'
import { productRouter as productRoutes } from './routes/productRoutes'

dotenv.config()

// @description connecting to DATABASE
connectDB()

const app = express();
// setting cors
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.use(express.json())
app.get('/' , (req:Request,res:Response)=>res.send('app is running'))


// @description routes
app.use('/api/v1/user' , userRoutes)
app.use('/api/v1/categories' , categoryRoutes)
app.use('/api/v1/products' , productRoutes)

// @description setting up the server to env port 
const port = process.env.PORT  || 5000 ;
app.listen( port , ()=>{
    console.log(`server is running on port ${port}`);
    
})
export{}