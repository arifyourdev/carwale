import express from "express";
import { addToCart ,disCart ,addAddress ,disAddress ,updateCartQuantity, removeCart} from "../controllers/cartController.js";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import { buyNow } from "../controllers/buynowController.js";

const router = express.Router();

router.get('/cu-cart', disCart);

router.post('/add-to-cart', addToCart);

router.get('/delivery-info', ensureAuthenticated, disAddress);

router.post('/delivery-info', addAddress);

router.post('/buy-now',buyNow)

router.post('/update-cart-quantity' ,updateCartQuantity);

router.delete('/remove-item/:id' ,removeCart);

export default router