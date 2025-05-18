import medicineModel from "../models/medchineModel"
import cloudinary from "cloudinary"
import fs from "fs"

const addMedicine = async (req, res) => {
  try {
    const { name, brand, description, price, stock, category, latitude, longitude } = req.body
    const imageFile = req.file

    if (!name || !price) {
      return res.json({ success: false, message: "Required fields missing: name or price." })
    }

    let imageUrl = ""
    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image"
      })
      imageUrl = uploadResult.secure_url
      fs.unlinkSync(imageFile.path) // Cleanup local file
    }

    const newMedicine = new medicineModel({
      name,
      brand,
      description,
      price,
      stock,
      image: imageUrl,
      category,
      pharmacyLocation: { latitude, longitude }
    })

    await newMedicine.save()
    res.json({ success: true, message: "Medicine added successfully." })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const updateMedicine = async (req, res) => {
  try {
    const medicineId = req.params.id
    const updates = req.body

    const updatedMedicine = await medicineModel.findByIdAndUpdate(medicineId, updates, { new: true })

    if (!updatedMedicine) {
      return res.json({ success: false, message: "Medicine not found" })
    }

    res.json({ success: true, message: "Medicine updated", data: updatedMedicine })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const deleteMedicine = async (req, res) => {
  try {
    const medicineId = req.params.id

    const deletedMedicine = await medicineModel.findByIdAndDelete(medicineId)

    if (!deletedMedicine) {
      return res.json({ success: false, message: "Medicine not found" })
    }

    res.json({ success: true, message: "Medicine deleted successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const viewAllMedicines = async (req, res) => {
  try {
    const allMedicines = await medicineModel.find()
    res.json({ success: true, data: allMedicines })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const searchMedicineByOCR = async (req, res) => {
  try {
    const { text } = req.query

    if (!text) {
      return res.json({ success: false, message: "Search text not provided" })
    }

    const regex = new RegExp(text, "i") // case-insensitive partial match

    const results = await medicineModel.find({
      $or: [
        { name: regex },
        { brand: regex },
        { description: regex },
        { category: regex }
      ]
    })

    if (results.length === 0) {
      return res.json({ success: false, message: "No medicine found matching the text" })
    }

    res.json({ success: true, data: results })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const searchMedicinesByTextOrSymptoms = async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required" })
    }

    const regex = new RegExp(query, "i")

    const results = await medicineModel.find({
      $or: [
        { name: regex },
        { brand: regex },
        { description: regex },
        { category: regex },
        { symptoms: regex }
      ]
    })

    if (!results.length) {
      return res.status(404).json({ success: false, message: "No matching medicines found" })
    }

    res.status(200).json({ success: true, data: results })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}




export { addMedicine,updateMedicine, deleteMedicine, viewAllMedicines, searchMedicineByOCR, searchMedicinesByTextOrSymptoms  }