import  express,{Request, Response, NextFunction} from 'express';

import { isSign, isAuthenticated, isAdmin} from '../controllers/authentication';
import { getUserByID, pushOrderInPurchaseList } from '../controllers/user';
import { updateUnits } from '../controllers/product';
import { getOrderById, createOrdPrd, createOrder, 
         getAllOrders, getOrderStatus, updateStatus, 
         getOrderPlaced, getMyOrders } from '../controllers/order';

const router = express.Router();

//params
router.param('userId', getUserByID);
router.param('orderId', getOrderById);

//routes

//create order
router.post('/order/create/:userId',
    isSign,
    isAuthenticated,
    updateUnits,
    createOrdPrd,
    createOrder,
    pushOrderInPurchaseList
   /* pushOrderInPurchaseList, 
    updateUnits,
    createOrder */)

// Read Route
router.get('/order/getAllOrders/:userId', 
    isSign, 
    isAuthenticated, 
    isAdmin, getAllOrders)

// get All Orders of user
router.get('/order/getMyOrders/:userId',
    isSign,
    isAuthenticated,
    getMyOrders)

//get Single order
router.get('/order/:orderId/:userId',
    isSign,
    isAuthenticated,
    getOrderPlaced)

//Read status
router.get('order/status/:userId',
    isSign,
    isAuthenticated,
    isAdmin,
    getOrderStatus)

// Update Status
router.put('order/status/:orderId/:userId',
    isSign,
    isAuthenticated,
    isAdmin,
    updateStatus
)
   
export default router;