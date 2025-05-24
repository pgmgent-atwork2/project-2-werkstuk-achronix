import Consumable from "../models/Consumable.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export const uploadConsumableImage = async (req, res) => {

  try {
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    if (!req.files) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `/uploads/consumables/${req.files.image.name}`;

    const image = req.files.image;

    const uploadDir = path.join(__dirname, "../../public/uploads/consumables");
    const filePath = path.join(uploadDir, req.files.image.name);

    await image.mv(filePath);

    const consumableData = {
      name: req.body.name,
      price: parseFloat(req.body.price),
      image_url: imageUrl,
      category_id: parseInt(req.body.category),
    };

    const newConsumable = await Consumable.query().insert(consumableData);

    res.status(201).json({
      message: "Consumable created successfully",
      consumable: newConsumable,
    });
  } catch (error) {
    console.error("Error uploading consumable image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
