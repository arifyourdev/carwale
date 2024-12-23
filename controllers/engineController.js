import connect from "../db/connect.js"
import { getAllEngines } from "../services/engineService.js"
import { getActiveManufacturers } from "../services/manufacturerService.js"
import { getAllModals } from "../services/modalServices.js";
import  cloudinary from "cloudinary";
import fs from 'fs';

export const engineList = async(req,res) =>{
    try{
       const engineData = await getAllEngines(); 
       res.render('admin/engines-list',{engineData});
    }catch(e){
        console.log(e)
    }
}

export const viewEngine = async (req,res) =>{
    try {
        const manufacture_data = await getActiveManufacturers();
        const car_modal = await getAllModals();
        res.render('admin/add-engines', { manufacture_data ,car_modal });
    } catch (e) {
        console.error(e);
    }
}

// Add Engine
export const addEngine = async (req, res) => {
    try {
        const { manufacturer, c_modal, c_gen, engine_name, seo_url, description, price, discount, main_price, size, quantity } = req.body;

        const mainImage = req.files['main_image_path'][0]; // Single file
        const additionalImages = req.files['product_image']; // Array of files

         const mainImageResult = await cloudinary.v2.uploader.upload(mainImage.path, {
            folder: 'engine-images',
        });
        const main_image_path = mainImageResult.secure_url;

        // Insert engine data into `engines` table
        const [engineResult] = await connect.execute(
            "INSERT INTO engines (manufacturer, c_modal, c_gen, engine_name, seo_url, description, price, discount, main_price, main_image_path, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
            [manufacturer, c_modal, c_gen, engine_name, seo_url, description, price, discount, main_price, main_image_path]
        );

        const product_id = engineResult.insertId;

        const imageInsertData = [];

        for (const file of additionalImages) {
            const result = await cloudinary.v2.uploader.upload(file.path, {
                folder: 'engine-images',
            });
            imageInsertData.push([product_id, result.secure_url]);
            fs.unlink(file.path, (err) => {
                if (err) console.error(err);
            });
        }

        if (imageInsertData.length > 0) {
            await connect.query(
                "INSERT INTO product_images (product_id, product_image) VALUES ?",
                [imageInsertData]
            );
        }

        // Insert sizes and quantities
        if (Array.isArray(size) && Array.isArray(quantity)) {
            const sizeData = size.map((sizeValue, index) => [
                product_id,
                sizeValue,
                quantity[index],
            ]);

            await connect.query(
                "INSERT INTO size (product_id, size, quantity) VALUES ?",
                [sizeData]
            );
        } else if (size && quantity) {
            await connect.execute(
                "INSERT INTO size (product_id, size, quantity) VALUES (?, ?, ?)",
                [product_id, size, quantity]
            );
        }

        res.redirect('/admin/engines-list');
    } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred.");
    }
};


export const editEngine = async (req, res) => {
    try {
        const { id } = req.params;
        const [edit_data] = await connect.execute("SELECT * FROM engines WHERE id = ?", [id]);
        const manufacture_data = await getActiveManufacturers();
        const car_modal = await getAllModals();

        if (edit_data.length > 0) {
            res.render('admin/edit-engine', { edit_data: edit_data[0] ,manufacture_data ,car_modal});
        } else {
            res.status(404).send('Engine not found');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};


export const updateEngine = async (req, res) => {
    try {
        const { id, manufacturer, c_modal, c_gen, engine_name, seo_url, description, price, discount, main_price, main_image_path } = req.body;
        const query = `
            UPDATE engines 
            SET 
                manufacturer = ?, 
                c_modal = ?, 
                c_gen = ?, 
                engine_name = ?, 
                seo_url = ?, 
                description = ?, 
                price = ?, 
                discount = ?, 
                main_price = ?,
                main_image_path = ? 
            WHERE id = ?
        `;

        // Execute the query with the values from the request body
        await connect.execute(query, [manufacturer, c_modal, c_gen, engine_name, seo_url, description, price, discount,  main_price, main_image_path, id]);

        // Send a success response
        res.redirect('/admin/engines-list');
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Error updating engine' });
    }
};


export const deleteEngine = async (req, res) => {
    try {
        const { id } = req.params;
        await connect.execute("DELETE FROM engines WHERE id = ?", [id]);
        // req.flash('success', 'Engine deleted successfully');
        res.redirect('/admin/engines-list');
    } catch (e) {
        console.log(e);
        // req.flash('error', 'Failed to delete engine');
        res.redirect('/admin/engines-list');
    }
};
