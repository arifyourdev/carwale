import connect from "../db/connect.js"
import { getAllModals } from "../services/modalServices.js";

 
export const ModalList = async (req, res) => {
    try {
      const  modalList = await getAllModals()
      res.render('admin/modal-list', { modalList });
    } catch (error) {
      res.status(500).send('Error fetching modal data');
    }
  };
  
export const ViewModal = async (req,res) =>{
    try {
        const [ManuData] = await connect.execute("SELECT * FROM manufacturer");
         res.render('admin/add-modal', { ManuData });
   } catch (error) {
        res.status(500).send('Error fetching manufacturer data');
   }
}

export const AddModal = async (req,res) =>{
    try{
        const {manufacturer_id, modal_name} = req.body
        await connect.execute("INSERT INTO car_modal (manufacturer_id ,modal_name) VALUES (?, ?)", [manufacturer_id,modal_name]);
        res.redirect('/admin/modal-list')
    }
    catch(e){
        console.log(e)
    }
}