import connect from "../db/connect.js";

export const getCartData = async (req) => {
    if (req.session.user) {
        const userId = req.session.user.id;
        try {
            const [cartData] = await connect.execute(
                'SELECT * FROM cu_cart WHERE user_id = ?',
                [userId]
            );
            return { cartData, cartCount: cartData.length };
        } catch (err) {
            console.error(err);
            return { cartData: [], cartCount: 0 };
        }
    } else {
        const cartData = req.session.cart || [];
        return { cartData, cartCount: cartData.length };
    }
};
