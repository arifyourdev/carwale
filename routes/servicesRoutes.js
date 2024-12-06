import express from "express";
import connect from "../db/connect.js";  // Assuming this is your DB connection
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Fetch all categories with their related services using a JOIN
        const [categoriesWithServices] = await connect.execute(`
            SELECT sc.id AS category_id, sc.category_name AS category_name, s.id AS service_id, s.service_name AS service_name, s.description, s.service_charge
            FROM service_category sc
            LEFT JOIN services s ON sc.id = s.service_category_id
            ORDER BY s.service_name
        `);

        // Render the page, passing the result
        res.render('services', {
            categoriesWithServices  // Passing the joined categories and services
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
