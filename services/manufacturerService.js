import connect from "../db/connect.js";

export const getActiveManufacturers = async () => {
    try {
        const [ManuData] = await connect.execute("SELECT * FROM manufacturer WHERE status = 1");
        return ManuData;
    } catch (e) {
        throw new Error(e);
    }
};