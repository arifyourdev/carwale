import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import commonRoute from "./routes/commonRoute.js"
import bookAppointment from "./routes/bookAppointment.js"
import services from "./routes/servicesRoutes.js"
import adminRoute from "./routes/adminRoute.js"
import allFrontRoute from './routes/allFrontRoute.js';
import loginRoute from "./routes/loginRoute.js"
import cartRoute from "./routes/cartRoute.js";
import paypalRoute from "./routes/paypalRoute.js"

const app = express();
app.use(cors())
dotenv.config()
app.locals.baseURL = "http://localhost:8082/"

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware to make user session data available in all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });
  
// Set View Engine
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))
app.use(express.static("public"))
app.use(express.json()); //
app.use(express.urlencoded({ extended: true }))

// Json Api Routes
app.use('/',allFrontRoute)
app.use('/m-t',(req,res) =>{
    res.render('m-t')
})

// Routes
app.use('/', commonRoute);
app.use('/book-appointment', bookAppointment);
app.use('/services', services);
app.use('/',loginRoute) 
app.use('/', cartRoute)
app.use('/', paypalRoute)

 
// Admin Routes
app.use('/admin/', adminRoute)

const PORT = 8082

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`)
}) 