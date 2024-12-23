import express from "express";
import { addManufacturer ,ManufacturerList ,viewManufacture } from "../controllers/manufacturerController.js";
import { ModalList ,ViewModal,AddModal } from "../controllers/modelController.js";
import { AppointmentList } from "../controllers/adminController.js";
import { engineList ,viewEngine ,addEngine ,editEngine ,updateEngine ,deleteEngine} from "../controllers/engineController.js";
import { carPartsList, viewAddCard ,addCarParts ,editCarParts, updateCarParts } from "../controllers/carPartsController.js";
import { editContent, updateContent } from "../controllers/contentController.js";
import { upload } from "../multer-config.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin/index');
});
router.get('/index', (req, res) => {
    res.render('admin/index');
});

//Manufacturer
router.get('/add-manufacture', viewManufacture)
router.post('/add-manufacture',addManufacturer)
router.get('/manufacture-list',ManufacturerList)

router.get('/appointments-list',AppointmentList);

// Engines Route
router.get('/engines-list', engineList)
router.get('/add-engines',viewEngine)
router.post('/add-engines', upload.fields([
    { name: 'main_image_path', maxCount: 1 }, // Single main image
    { name: 'product_image', maxCount: 10 },  // Up to 10 additional images
]), addEngine);
router.get('/edit-engine/:id' ,editEngine)
router.post('/edit-engine',updateEngine)
router.delete('/delete-engine/:id',deleteEngine)

// Car Parts Engine
router.get('/car-parts-list',carPartsList)
router.get('/add-car-parts',viewAddCard)
router.post('/add-car-parts',addCarParts)
router.get('/edit-car-parts/:id',editCarParts)
router.post('/edit-car-parts',updateCarParts)

// Content
router.get('/contents/:id',editContent)
router.post('/contents',updateContent)
// Manufacturer Modal
router.get('/modal-list',ModalList)
router.get('/add-modal', ViewModal)
router.post('/add-modal',AddModal)

export default router