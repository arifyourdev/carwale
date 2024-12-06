import connect from "../db/connect.js"

export const AppointmentList = async (req, res) => {
    try {
        const [appoinments_data] = await connect.execute(`
            SELECT ca.*, 
                   GROUP_CONCAT(s.service_name SEPARATOR ', ') AS services
            FROM customer_appointment ca
            LEFT JOIN customer_appointment_services cas ON ca.id = cas.appointment_id
            LEFT JOIN services s ON cas.service_id = s.id
            GROUP BY ca.id
        `);
        res.render('admin/appointments-list', { appoinments_data });
    } catch (e) {
        console.log(e);
    }
};

