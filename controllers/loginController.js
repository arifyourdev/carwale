import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import connect from "../db/connect.js"
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Account Email
const sendAcOtpEmail = async (email, otp) => {
    const Actransporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // Define the email template content
    const AcmailTemplate = await ejs.renderFile(path.join(__dirname, '..', 'views', 'email-template', 'ac-template.ejs'), {
        otp
    });
 
    await Actransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        html: AcmailTemplate
    });
};

// Password Otp Email
const sendPassOtpEmail = async (email, otp) => {
    const Actransporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // Define the email template content
    const mailTemplate = await ejs.renderFile(path.join(__dirname, '..', 'views', 'email-template', 'password-template.ejs'), {
        otp
    });
 
    await Actransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        html: mailTemplate
    });
};

export const signUp = async (req,res) =>{
    const {name,email,password} = req.body
    try{
        const [existingUser] = await connect.execute("SELECT * FROM cu_users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
             return res.render("sign-up", { error: "User already registered with this email." });
        }

        // Generate OTP
        const otp = generateOtp();
        const otpExpiry = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes

        req.session.otpInfo = {
            email: email,
            otp: otp,
            otpExpiry: otpExpiry,
            name: name,
            password: password,
        };
   
        res.render('ac-verification', { email:email });
        
        sendAcOtpEmail(email, otp);
        
    }catch(e){
        console.log(e)
    }
}

export const verifyOtpAndRegister = async (req, res) => {
    const { email, otp } = req.body;
 
    try {
        const { otp: savedOtp, otpExpiry, name, password ,email } = req.session.otpInfo;

        const userOtp = String(otp).trim();
        if (String(savedOtp) !== userOtp) {
            return res.render('ac-verification', { error: "Incorrect OTP", email });
        }

        if (Date.now() > otpExpiry) {
            return res.render('ac-verification', { error: "OTP has expired", email });
        }

        // OTP verified, proceed with user registration
        const saltRounds = 10;
        const passHash = await bcrypt.hash(password, saltRounds);

        const [result] = await connect.execute(
            "INSERT INTO cu_users (name, email, password, status, created_at) VALUES (?, ?, ?, 0, NOW())",
            [name, email, passHash]
        );
        const userId = result.insertId;

        // Create JWT token
        const token = await JWT.sign({ email }, process.env.TOKEN_KEY, { expiresIn: '1h' });

        // Save user session
        req.session.user = {
            id: userId,
            name: name,
            email: email,
            token: token,
        };

        delete req.session.otpInfo;
        res.redirect('/');

    } catch (e) {
        console.log(e);
        res.render('ac-verification', { error: "Something went wrong", email });
    }
};

// User Login
export const loginUser = async (req,res) =>{
    try{
      const {email,password } = req.body;
      const [userData] = await connect.execute("SELECT * FROM cu_users WHERE email = ?",[email]);

      if(userData.length === 0){
        return res.render('login',{error:"User not found"})

    }

      const user = userData[0]
      const match = await bcrypt.compare(password,user.password);
      if(!match){
        return res.render("login",{error:"Incorrect password"})
      }
      
      const token = await JWT.sign({email:user.email}, process.env.TOKEN_KEY,{ expiresIn: "1h" })

      req.session.user={
        id:user.id,
        name:user.name,
        email:user.email,
        token:token
      }

       // If session cart exists, migrate it to the database
       if (req.session.cart && req.session.cart.length > 0) {
        const userId = user.id;

        for (const product of req.session.cart) {
            const { product_id, product_name, product_size, product_price, quantity, product_image } = product;

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
                    'INSERT INTO cu_cart (user_id, product_id, product_name, product_size, product_price, quantity, product_image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
                    [userId, product_id, product_name, product_size, product_price, quantity, product_image]
                );
            }
        }

        // Clear session cart after migrating to the database
        delete req.session.cart;
    }

    if (req.session.buyNow) {
        const userId = user.id;

        for (const buynow of req.session.buyNow) {
            const { product_id, product_name, product_size, product_price, quantity, product_image } = buynow;

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
                    'INSERT INTO cu_cart (user_id, product_id, product_name, product_size, product_price, quantity, product_image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
                    [userId, product_id, product_name, product_size, product_price, quantity, product_image]
                );
            }
        }

        // Clear the buyNow session data
        delete req.session.buyNow;
    }

    const redirectTo = req.session.redirectTo || '/';
    delete req.session.redirectTo; 
    res.redirect(redirectTo);
    
   
    }catch(e){
        console.log(e)
    }
}

export const requesOtp = async (req,res) =>{
    try{
        const { email } = req.body;

        const connection = await connect.getConnection();
        await connection.beginTransaction();

        const [userData] = await connection.execute("SELECT * FROM cu_users WHERE email = ?", [email]);
      
        if (userData.length === 0) {
            return res.render('forget-password', { error: "User not found" });
        }
        const otp = generateOtp(); 
        const otpExpiry = Date.now() + 15 * 60 * 1000; // valid for 15 minutes

        await connection.execute('UPDATE cu_users SET otp = ?, otp_expiry = ? WHERE email = ?', [otp, otpExpiry, email]);

        await connection.commit();
        res.render('verify-otp', { email }); 

        sendPassOtpEmail(email, otp);

    }catch(e){
        console.log(e)
        res.render('forget-password', { error: "Something went wrong" });
    }
}

export const verifyOtp = async (req,res) =>{
    try{
     const {otp, email} = req.body
     const [userData] = await connect.execute('SELECT otp, otp_expiry FROM cu_users WHERE email = ?', [email]);

        if (userData.length === 0 || userData[0].otp !== otp) {
            return res.render('verify-otp', { error: "Invalid OTP", email });
        }

        const otpExpiry = userData[0].otp_expiry;
        if (Date.now() > otpExpiry) {
            return res.render('verify-otp', { error: "OTP has expired", email });
        }
        res.render('update-password', { email:email });

    }catch(e){
      res.render('verify-otp', { error: "Something went wrong", email });
    }
}

export const updatePassword = async (req,res) =>{
    const {email,new_password} = req.body;
    try{
       const hashedPassword = await bcrypt.hash(new_password, 10);
       await connect.execute('UPDATE cu_users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?', [hashedPassword, email]);
      res.render('login', { success: "Password has been reset. Please login." });

    }catch(e){
        res.render('update-password', { error: "Something went wrong" });  
    }
}

export const logOut = async (req,res) =>{
    try{
       req.session.destroy((err)=>{
        if(err){

        }
        res.redirect("/login");
       })
    }catch(e){
        console.log(e)
    }
}