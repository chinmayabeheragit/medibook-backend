import express from "express"
import multer from "multer"
import {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  viewAllMedicines,
  searchMedicineByOCR
} from "../controllers/medchineController.js"
import authAdmin from "../middleware/authAdmin.js"

const router = express.Router()
const upload = multer({ dest: "uploads/" })

// 🔐 Admin-only APIs
router.post("/add-medicine", authAdmin, upload.single("image"), addMedicine)
router.put("/update-medicine/:id", authAdmin, updateMedicine)
router.delete("/delete-medicine/:id", authAdmin, deleteMedicine)

// 🌐 Public APIs (search and view)
router.get("/view-all-medicines", viewAllMedicines)
router.get("/search-medicine", searchMedicineByOCR)

export default router
