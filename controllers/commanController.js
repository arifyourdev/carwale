
// Manufecturer List
import connect from "../db/connect.js";
import { getAllCarParts } from "../services/carServices.js";
import { getCartData } from "../services/cartService.js";
import { getAllEngines } from "../services/engineService.js";
import { getActiveManufacturers } from "../services/manufacturerService.js";
import { getmodalName } from "../services/modalServices.js";

export const getManufacturers = async (req, res) => {
    try {
        const ManuData = await getActiveManufacturers();
        res.json({ ManuData });
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch manufacturers' });
    }
};

// Modal List Api
export const getModals = async (req,res) =>{
    try{
     const modalData = await getmodalName()
     res.json({modalData})
    }catch(e){
        console.log(e)
    }
}

// Engine List
export const allEngineList = async (req ,res) =>{
    try{
       const engineAllData = await getAllEngines()
       res.json({engineAllData})
    }catch(e){
        console.log(e)
    }
}

// Single Engine
export const getSingleEngine = async (req,res) =>{
    try{
      const {seo_url} = req.params;
      const [engineData] = await connect.execute("SELECT * FROM engines WHERE seo_url = ?",[seo_url])
      const [sizesData] = await connect.execute("SELECT size, quantity FROM size WHERE product_id = ?", [engineData[0].id]);
      const {cartData ,cartCount} = await getCartData(req)
      res.render('engine-detail', {
        engineData: engineData[0],
        sizes: sizesData, // Pass sizes data to the template
        cartData,
        cartCount,
    });
    }catch(e){
        console.log(e);
    }
}

// Car Parts List
export const allCarParts = async (req,res) =>{
    try{
      const carPartsData = await getAllCarParts()
       res.json({carPartsData})
    }catch(e){
        res.json("error in code")
    }
}

export const getSingleCarPart = async (req,res) =>{
    try{
      const {seo_url} = req.params
      const [carData] = await connect.execute("SELECT * FROM car_parts WHERE seo_url = ?",[seo_url])
      const {cartData ,cartCount} = await getCartData(req)
      res.render('car-part-detail',{carData:carData[0],cartData ,cartCount})
    }catch(e){
        console.log(e)
    }
}