import connect from "../db/connect.js";

export const buyNow = async (req, res) => {
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

            res.json({ success: true, message: 'Proceed to checkout.' });
        } catch (err) {
            console.error(err);
            res.json({ success: false, message: 'Failed to proceed to checkout.' });
        }
    } else {

        if (!req.session.buyNow) {
            req.session.buyNow = [];
        }
        req.session.buyNow.push(productData);
        res.json({ success: true, message: 'Proceed to login.' });
    }
};
