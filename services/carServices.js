import connect from "../db/connect.js"

export const getAllCarParts = async () =>{
    try{
      const [carData] = await connect.execute("SELECT * FROM car_parts")
      return carData
    }catch(e){
        console.log(e);
    }
}