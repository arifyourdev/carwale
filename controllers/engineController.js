import connect from "../db/connect.js"
import { getAllEngines } from "../services/engineService.js"
import { getActiveManufacturers } from "../services/manufacturerService.js"
import { getAllModals } from "../services/modalServices.js";

export const engineList = async(req,res) =>{
    try{
       const engineData = await getAllEngines(); 
       res.render('admin/engines-list',{engineData})
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

export const addEngine = async (req,res) =>{
    try{
        const {manufacturer,c_modal,c_gen,engine_name,seo_url,description,price,discount, main_price ,main_image_path} = req.body
        await connect.execute("INSERT INTO engines (manufacturer,c_modal,c_gen,engine_name,seo_url,description,price,discount,main_price,main_image_path,created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",[manufacturer,c_modal,c_gen,engine_name,seo_url,description,price,discount,main_price,main_image_path,]);
        res.redirect('/admin/engines-list');
    }catch(e){
        console.log(e)
    }
}

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
