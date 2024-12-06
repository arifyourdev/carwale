import nodemailer from "nodemailer";
import ejs from "ejs";
import path from 'path';
import { fileURLToPath } from 'url';
import connect from "../db/connect.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const storeServices = async (req,res) =>{
    try {
        const { name, email, phone, address, message, manufacturer, car_model, generation, service_date, slotTime, services } = req.body;

        const connection = await connect.getConnection();

        // Start a transaction for database operations
        await connection.beginTransaction();

        // Insert appointment details
        const [appointmentResult] = await connection.execute(
            "INSERT INTO customer_appointment (name,email,phone,address,message,manufacturer,car_model, generation,service_date, service_time ,created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,NOW())",
            [name, email, phone, address, message, manufacturer, car_model, generation, service_date, slotTime]
        );

        const appointmentId = appointmentResult.insertId;

        // Insert services in bulk (optimize for multiple services)
        if (services && services.length > 0) {
            const serviceValues = services.map(serviceId => [appointmentId, serviceId]);
            await connection.query(
                "INSERT INTO customer_appointment_services (appointment_id, service_id) VALUES ?",
                [serviceValues]
            );
        }

        // Commit the transaction
        await connection.commit();

        // Define the email templates
        const mailTemplate = await ejs.renderFile(path.join(__dirname, '..', 'views', 'email-template', 'customer-template.ejs'), {
            name,
            service_date,
            slotTime,
            manufacturer,
            car_model,
            generation
        });

        const mailTemplate2 = await ejs.renderFile(path.join(__dirname, '..', 'views', 'email-template', 'admin-template.ejs'), {
            name,
            service_date,
            slotTime,
            manufacturer,
            car_model,
            generation,
            email, phone, address, message
        });

        // Send emails asynchronously
        sendEmails(email, mailTemplate, mailTemplate2);

        res.json({ success: true, message: 'Appointment booked and email will be sent shortly!' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: 'An error occurred while booking the appointment.' });
    }
}

async function sendEmails(customerEmail, mailTemplate, mailTemplate2) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "jaydenmitchell0282@gmail.com",
            pass: "rtcslwgbcgxkoibh",
        },
    });

    const transporter2 = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "jaydenmitchell0282@gmail.com",
            pass: "rtcslwgbcgxkoibh",
        },
    });

    try {
        // Send customer confirmation email
        await transporter.sendMail({
            from: "fastranking03@gmail.com",
            to: customerEmail,
            subject: "Appointment Confirmation",
            html: mailTemplate,
        });

        // Send admin confirmation email
        await transporter2.sendMail({
            from: customerEmail,
            to: "fastranking03@gmail.com",
            subject: "Service Appointment",
            html: mailTemplate2,
        });
    } catch (error) {
        console.error("Error sending emails:", error);
    }
}