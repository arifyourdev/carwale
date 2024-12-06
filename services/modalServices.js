import connect from "../db/connect.js";

export const getAllModals = async () =>{
  try{
    const [modalList] = await connect.execute(`
        SELECT m.modal_name, m.manufacturer_id, f.name 
        FROM car_modal m
        JOIN manufacturer f ON m.manufacturer_id = f.id
      `);
      return modalList
  }catch(e){
    console.log(e)
  }
}


export const getmodalName = async () =>{
    try{
       const [modalName] = await connect.execute("SELECT * FROM car_modal")
       return modalName
    }catch(e){
        console.log(e)
    }
}
