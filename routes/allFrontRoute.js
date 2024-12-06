import express from "express";
import { allEngineList, getManufacturers, getModals, getSingleEngine, allCarParts, getSingleCarPart } from "../controllers/commanController.js";
import connect from "../db/connect.js";
import { storeServices } from "../controllers/emailController.js";
import { getCartData } from "../services/cartService.js";


const router = express.Router()

router.get('/api/manufacturers', getManufacturers)
router.get('/api/modals', getModals)
router.get('/api/engines', allEngineList)
router.get('/engines',  async (req, res) => {
    const {cartData,cartCount } = await getCartData(req)
    res.render('engines',{cartData,cartCount})
})
router.get('/engine-detail/:seo_url', getSingleEngine)

router.get('/car-parts', async(req, res) => {
    const {cartData,cartCount } = await getCartData(req)
    res.render('car-parts' ,{cartData,cartCount})
})
router.get('/api/car-parts', allCarParts)
router.get('/car-part-detail/:seo_url', getSingleCarPart)


router.get('/get-services', async (req, res) => {
    try {
        const { manufacturer, car_model, generation, others } = req.query;
        // Fetch all categories with their related services using a JOIN
        const [categoriesWithServices] = await connect.execute(`
            SELECT sc.id AS category_id, sc.category_name AS category_name, s.id AS service_id, s.service_name AS service_name, s.description, s.service_charge
            FROM service_category sc
            LEFT JOIN services s ON sc.id = s.service_category_id
            ORDER BY s.service_name
        `);

        // Render the page, passing the result
        res.render('get-services', {
            categoriesWithServices, manufacturer, car_model, generation, others
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Get slots
router.get('/api/get-slots', async (req, res) => {
    const { date } = req.query;
    try {
        // Fetch booked slots for the specified date
        const [bookedSlots] = await connect.execute(
            "SELECT service_time FROM customer_appointment WHERE service_date = ?",
            [date]
        );
        const bookedSlotTimes = bookedSlots.map(slot => slot.service_time);

        // Fetch all available slots
        const [allSlots] = await connect.execute("SELECT * FROM appointment_slots");

        // Filter out already booked slots
        const availableSlots = allSlots.filter(slot => !bookedSlotTimes.includes(slot.slot_time));

        res.json({ slots: availableSlots });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'An error occurred while fetching available slots.' });
    }
});


router.post('/api/store-services',storeServices)
 



router.get('/thank-you', (req, res) => {
    res.render('thank-you')
})

export default router