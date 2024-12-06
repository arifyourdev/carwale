import express from "express";
import connect from "../db/connect.js";
const router = express.Router();

router.get('/', (req, res) => {
    res.render('book-appointment');
});



router.get('/get-slots', async (req, res) => {
    const { date } = req.query;

    try {
        const [results] = await connect.execute(`
            SELECT s.id, s.slot_time
            FROM appointment_slots s
            LEFT JOIN appointments a ON s.id = a.slot_id AND a.appointmen
            t_date = ?
            WHERE a.id IS NULL
        `, [date]);

        const availableSlots = results.map(slot => ({
            id: slot.id,
            time: slot.slot_time
        }));

        res.json({ slots: availableSlots });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});



router.post('/', async (req, res) => {
    const { carRegNo, postalCode, service, date, slotId } = req.body;

    const [slotResult] = await connect.execute('SELECT slot_time FROM appointment_slots WHERE id = ?', [slotId]);

    const slotTime = slotResult[0].slot_time;

    try {
        await connect.execute(`
            INSERT INTO appointments (user_id, slot_id, appointment_date, appointment_time, car_registration_no, service_name, postal_code, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `, ['1', slotId, date, slotTime, carRegNo, service, postalCode]);

        res.json({ success: true });
    } catch (err) { 
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
