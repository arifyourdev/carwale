import connect from "../db/connect.js";
import { getAllCarParts } from "../services/carServices.js";
import { getActiveManufacturers } from "../services/manufacturerService.js"
import { getAllModals } from "../services/modalServices.js";

export const carPartsList = async(req,res) =>{
    try{
       const carData = await getAllCarParts();
       res.render('admin/car-parts-list',{carData})
    }catch(e){
        console.log(e)
    }
}

export const viewAddCard = async(req,res) =>{
    try{
        const manufacture_data = await getActiveManufacturers();
        const car_modal = await getAllModals();
       res.render('admin/add-car-parts',{manufacture_data ,car_modal})
    }catch(e){
        console.log(e)
    }
}

export const addCarParts = async (req,res) =>{
    try{
        const {manufacturer,c_modal,c_gen,part_name,seo_url,description,price,discount, main_price ,main_image_path} = req.body
        await connect.execute("INSERT INTO car_parts (manufacturer,c_modal,c_gen,part_name,seo_url,description,price,discount,main_price,main_image_path,created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",[manufacturer,c_modal,c_gen,part_name,seo_url,description,price,discount,main_price,main_image_path,]);
        res.redirect('/admin/car-parts-list');
    }catch(e){
        console.log(e)
    }
}

export const editCarParts = async (req,res) =>{
    const{id} = req.params;
    const [edit_car] = await connect.execute("SELECT * FROM car_parts WHERE id = ?",[id]);
    const manufacture_data = await getActiveManufacturers();
    const car_modal = await getAllModals();
    res.render('admin/edit-car-parts',{edit_car:edit_car[0],manufacture_data ,car_modal})
}

export const updateCarParts = async (req,res) =>{
    try{
        const {id,manufacturer,c_modal,c_gen,part_name,seo_url,description,price,discount, main_price ,main_image_path} = req.body
        const query = `
         UPDATE car_parts 
            SET 
                manufacturer = ?, 
                c_modal = ?, 
                c_gen = ?, 
                part_name = ?, 
                seo_url = ?, 
                description = ?, 
                price = ?, 
                discount = ?, 
                main_price = ?,
                main_image_path = ? 
            WHERE id = ?
        `
        await connect.execute(query,[manufacturer,c_modal,c_gen,part_name,seo_url,description,price,discount, main_price ,main_image_path,id])
        res.redirect('/admin/car-parts-list')
    }catch(e){
        console.log(e)
    }
}