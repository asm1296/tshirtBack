require('dotenv').config();
import mongoose from 'mongoose';
import express,{Application, Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


// Route Imports
import authRoutes from './routes/authentication';
import userRoutes from './routes/user';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import paymentRoute from './routes/payment';

const app:Application=express();

// MiddleWare
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api',authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api',orderRoutes)
app.use('/api',paymentRoute);


// MongoDB Connection
if(process.env.DBSOURCE){
    mongoose.connect(process.env.DBSOURCE,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
    }).then(()=>{
        console.log(`DB Connected`);
    }).catch((error)=>{
        console.log(error)
    })
}

// Port 
const port=process.env.PORT || 5000;

// Routes
app.get('/',(req:Request,res:Response)=>{
    return res.send('Hello World');
})

// Starting a Server
app.listen(port,()=>{
    console.log(`App is running at ${port}`);
})
