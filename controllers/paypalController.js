import axios from "axios"

async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    })

    return response.data.access_token
}

export const createOrder = async (req,res) => {
    const accessToken = await generateAccessToken()
   try{
    
    const cartData = JSON.parse(req.body.cartData); // Parse cartData from the form

        // Ensure cartData is not empty
        if (!cartData || cartData.length === 0) {
            return res.status(400).json({ error: 'Cart data is required' });
        }

        let total = 0;
        const items = cartData.map(item => {
            total += item.product_price * item.quantity;
            const price = parseFloat(item.product_price);
            return {
                name: item.product_name,
                description: item.product_name,
                quantity: item.quantity,
                unit_amount: {
                    currency_code: 'GBP',
                    value: price.toFixed(2)
                }
            };
        });

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    items: items,

                    amount: {
                        currency_code: 'GBP',
                       value: total.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'GBP',
                               value: total.toFixed(2)
                            }
                        }
                    }
                }
            ],

            application_context: {
                return_url: process.env.BASE_URL + '/complete-order',
                cancel_url: process.env.BASE_URL + '/cancel-order',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'cajhb'
            }
        })
    })
    const approvalLink = response.data.links.find(link => link.rel === 'approve').href
    res.redirect(approvalLink);
   }catch(e){
    console.log(e)
   }
}


export const capturePayment = async (orderId) => {
    try {
        const accessToken = await generateAccessToken()

        const response = await axios({
            url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        })

        return response.data
    } catch (error) {
        console.error(error)
        throw new Error('Error capturing payment: ' + error.message)
    }
}

export const completeOrder = async (req, res) => {
    try {
        await capturePayment(req.query.token)
        res.send('Course purchased successfully')
    } catch (error) {
        res.status(500).send('Error: ' + error.message)
    }
}

export const cancelOrder = (req, res) => {
    res.redirect('/')
}