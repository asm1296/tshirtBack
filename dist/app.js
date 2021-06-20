"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
// Route Imports
const authentication_1 = __importDefault(require("./routes/authentication"));
const user_1 = __importDefault(require("./routes/user"));
const category_1 = __importDefault(require("./routes/category"));
const product_1 = __importDefault(require("./routes/product"));
const order_1 = __importDefault(require("./routes/order"));
const payment_1 = __importDefault(require("./routes/payment"));
const app = express_1.default();
// MiddleWare
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.use(cors_1.default());
app.use('/api', authentication_1.default);
app.use('/api', user_1.default);
app.use('/api', category_1.default);
app.use('/api', product_1.default);
app.use('/api', order_1.default);
app.use('/api', payment_1.default);
// MongoDB Connection
if (process.env.DBSOURCE) {
    mongoose_1.default.connect(process.env.DBSOURCE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        console.log(`DB Connected`);
    }).catch((error) => {
        console.log(error);
    });
}
// Port 
const port = process.env.PORT || 5000;
// Routes
app.get('/', (req, res) => {
    return res.send('Hello World');
});
// Starting a Server
app.listen(port, () => {
    console.log(`App is running at ${port}`);
});
