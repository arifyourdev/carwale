import connect from "../db/connect.js"

export const getAllEngines = async () =>{
    try{
      const [engineData] = await connect.execute("SELECT * FROM engines");
      return engineData;
    }catch(e){
        console.log(e)
    }
}