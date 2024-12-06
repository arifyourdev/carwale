import connect from "../db/connect.js";
import { getActiveManufacturers } from "../services/manufacturerService.js";

 
 export const viewManufacture = (req,res) =>{
    res.render('admin/add-manufacture')
 }
 
 export const  addManufacturer = async (req,res) =>{
    try{
        const {name,status} = req.body;
        await connect.execute("INSERT INTO manufacturer (name,status) VALUES (?, ?)",[name,status])
        res.redirect('/admin/manufacture-list');
    }
    catch(e){
        console.log(e)
    }
}

export const ManufacturerList = async (req, res) => {
    try {
        const ManuData = await getActiveManufacturers();
        res.render('admin/manufacture-list', { ManuData });
    } catch (e) {
        console.error(e);
    }
};