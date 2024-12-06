import connect from "../db/connect.js";
import { getCartData } from "../services/cartService.js";

export const addToCart = async (req, res) => {
    const productData = req.body;

    if (req.session.user) {
        try {
            const userId = req.session.user.id;
            const { product_id, product_name, product_price, quantity, product_image } = productData;

            const [existingProduct] = await connect.execute(
                'SELECT quantity FROM cu_cart WHERE user_id = ? AND product_id = ?',
                [userId, product_id]
            );

            if (existingProduct.length > 0) {

                await connect.execute(
                    'UPDATE cu_cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                    [quantity, userId, product_id]
                );
            } else {

                await connect.execute(
                    'INSERT INTO cu_cart (user_id, product_id, product_name, product_price, quantity, product_image, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                    [userId, product_id, product_name, product_price, quantity, product_image]
                );
            }

            res.json({ success: true, message: 'Product added to cart.' });
        } catch (err) {
            console.error(err);
            res.json({ success: false, message: 'Failed to add product to cart.' });
        }
    } else {

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const existingProductIndex = req.session.cart.findIndex(item => item.product_id.trim() === productData.product_id.trim());

        if (existingProductIndex !== -1) {

            req.session.cart[existingProductIndex].quantity = parseInt(req.session.cart[existingProductIndex].quantity) + parseInt(productData.quantity);
        } else {

            req.session.cart.push(productData);
        }

        res.json({ success: true, message: 'Product added to cart in session.' });
    }
};

// Update Cart Value
export const updateCartQuantity = async (req, res) => {
    const { product_id, action } = req.body;

    if (req.session.user) {
        const userId = req.session.user.id;

        try {
            const [product] = await connect.execute(
                'SELECT quantity, product_price FROM cu_cart WHERE user_id = ? AND product_id = ?',
                [userId, product_id]
            );

            if (product.length > 0) {
                let newQuantity = product[0].quantity;
                const productPrice = product[0].product_price;

                if (action === 'increase') {
                    newQuantity += 1;
                } else if (action === 'decrease' && newQuantity > 1) {
                    newQuantity -= 1;
                }

                await connect.execute(
                    'UPDATE cu_cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                    [newQuantity, userId, product_id]
                );

                // Calculate subtotal for the updated product
                const newSubtotal = newQuantity * productPrice;

                // Get the total cost for all products in the cart
                const [cart] = await connect.execute(
                    'SELECT SUM(product_price * quantity) AS total FROM cu_cart WHERE user_id = ?',
                    [userId]
                );
                const totalCost = cart[0].total;

                res.json({
                    success: true,
                    newQuantity: newQuantity,
                    newSubtotal: newSubtotal,
                    totalCost: totalCost
                });
            } else {
                res.json({ success: false, message: 'Product not found in cart.' });
            }
        } catch (err) {
            console.error(err);
            res.json({ success: false, message: 'Failed to update cart quantity.' });
        }
    } else {
        // Handle session-based cart for guest users
        if (req.session.cart) {
            const productIndex = req.session.cart.findIndex(item => item.product_id === product_id);
            if (productIndex !== -1) {
                let newQuantity = parseInt(req.session.cart[productIndex].quantity, 10);
                const productPrice = req.session.cart[productIndex].product_price;

                if (action === 'increase') {
                    newQuantity += 1;
                } else if (action === 'decrease' && newQuantity > 1) {
                    newQuantity -= 1;
                }

                req.session.cart[productIndex].quantity = parseInt(newQuantity);

                const newSubtotal = newQuantity * productPrice;
                const totalCost = req.session.cart.reduce((total, item) => total + (parseInt(item.product_price) * parseInt(item.quantity)), 0);

                res.json({
                    success: true,
                    newQuantity: newQuantity,
                    newSubtotal: newSubtotal,
                    totalCost: totalCost
                });
            } else {
                res.json({ success: false, message: 'Product not found in session cart.' });
            }
        } else {
            res.json({ success: false, message: 'No cart found in session.' });
        }
    }
};


// Cart Delete Controller
export const removeCart = async (req, res) => {
    const productId = req.params.id;

    if (req.session.user) {
       
        try {
            const userId = req.session.user.id
            const [cart_query] = await connect.execute("DELETE FROM cu_cart WHERE user_id =? AND product_id = ?", [userId, productId])
            if (cart_query.affectedRows  > 0) {
                return res.json({ success: true, message: 'Item removed from cart successfully' });
            } else {
                return res.json({ success: false, message: 'Item not found in cart' });
            }

        } catch (e) {
            console.log(e)
            return res.status(500).json({ success: false, message: 'Error occurred while removing item from cart' });
        }
    }
    else {

        let cart = req.session.cart || [];
        const itemIndex = cart.findIndex(item => parseFloat(item.product_id) === parseInt(productId));
        if (itemIndex > -1) {

            cart.splice(itemIndex, 1);
            req.session.cart = cart;

            return res.json({ success: true, message: 'Item removed successfully' });
        } else {
            return res.json({ success: false, message: 'Item not found' });
        }
    }

}

export const disCart = async (req, res, next) => {

    try {
        const { cartData, cartCount } = await getCartData(req)
        res.render('cu-cart', { cartData, cartCount });
    } catch (err) {
        console.error(err);
        res.render('cu-cart', { cartData: [], cartCount: 0 });
    }
}

export const addAddress = async (req, res) => {
    try {
        const userId = req.session.user.id
        const { full_name, mobile, email, address, city, state, postcode, delivery_date, delivery_time } = req.body
        await connect.execute("INSERT INTO customer_address (user_id, full_name, mobile ,email, address,city,state,postcode,delivery_date,delivery_time ,created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())", [userId, full_name, mobile, email, address, city, state, postcode, delivery_date, delivery_time])
        res.redirect('/delivery-info')
    } catch (e) {
        console.log(e)
        res.render('delivery-info', { message: "Something wrong in query" })
    }
}

export const disAddress = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { cartData, cartCount } = await getCartData(req)
        const [cu_address] = await connect.execute("SELECT * FROM customer_address WHERE user_id = ?", [userId])
        res.render('delivery-info', { cu_address, cartData, cartCount })

    } catch (e) {
        console.log(e)
        res.render('delivery-info', { cartData: [], cartCount: 0 });
    }
}