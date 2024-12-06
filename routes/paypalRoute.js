import express from "express"
import { completeOrder, createOrder ,cancelOrder } from "../controllers/paypalController.js";

const router = express.Router();

router.post('/pay', createOrder)


router.get('/complete-order', completeOrder)
router.get('/cancel-order', cancelOrder)

router.get('/cancel-order', (req, res) => {
    res.redirect('/')
})


export default router