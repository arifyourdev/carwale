import express from "express";
import connect from "../db/connect.js";
import { getAllEngines } from "../services/engineService.js";
import { getCartData } from "../services/cartService.js";
const router = express.Router()

router.get('/', async(req,res) =>{
    const engineAllData = await getAllEngines()
    const {cartData,cartCount } = await getCartData(req)
    res.render('index',{engineAllData ,cartData,cartCount})
}); 
 

router.get('/booked-appointments', async (req, res) => {
    try {
        // Fetch all booked appointments
        const [results] = await connect.execute('SELECT * FROM appointments ORDER BY created_at DESC');

        // Render the view and pass the appointments data
        res.render('appointment-list', { appointments: results });
    } catch (error) {
        console.error('Error fetching booked appointments:', error);
        res.status(500).send('An error occurred while fetching booked appointments.');
    }
});

router.get('/service',(req,res) =>{
    res.render('service')
});


router.get('/book-appointment-new', async(req,res) =>{
    try {
        // Fetch all categories with their related services using a JOIN
        const [categoriesWithServices] = await connect.execute(`
            SELECT sc.id AS category_id, sc.category_name AS category_name, s.id AS service_id, s.service_name AS service_name, s.description, s.service_charge
            FROM service_category sc
            LEFT JOIN services s ON sc.id = s.service_category_id
            ORDER BY s.service_name
        `);

        // Render the page, passing the result
        res.render('appointment-new', {
            categoriesWithServices  // Passing the joined categories and services
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// My Routes
router.get('/appointment-new', async(req,res) =>{
    try{
        const sql_query = "SELECT * FROM appointment_slots";
        connect.query(sql_query,(err,result)=>{
            if(err){
                return res.render('Database Fetching Error',{message:"Error in Fetchingh"})
            }
            res.render('appointment-new',{slots:result});
        })
       
    }catch(e){
        console.log(e)
    }
})


router.get('/about-us', async(req,res) =>{
    const {cartData,cartCount } = await getCartData(req)
    res.render('about-us',{cartData,cartCount})
});

router.get('/contact-us', async(req,res) =>{
    const {cartData,cartCount } = await getCartData(req)
    res.render('contact-us', {cartData,cartCount })
});
 
router.get('/how-it-works', async(req,res) =>{
    const {cartData,cartCount } = await getCartData(req)
    res.render('how-it-works',{cartData,cartCount })
})
 

export default router