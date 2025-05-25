import Consumable from "../models/Consumable.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadConsumableImage = async (req, res) => {
  try {
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

export const updateConsumableImage = async (req, res) => {
  try {
    const { id, name, price, category } = req.body;

    const consumable = await Consumable.query().findById(id);

    if (!consumable) {
      return res.status(404).json({ error: "Consumable not found" });
    }

    if (!req.files) {
      await Consumable.query().patchAndFetchById(id, {
        name,
        price: parseFloat(price),
        category_id: parseInt(category),
      });

      return res.status(200).json({
        message: "Consumable updated successfully ",
      });
    }

    const oldImagePath = path.join(
      __dirname,
      "../../public",
      consumable.image_url
    );

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    const imageUrl = `/uploads/consumables/${req.files.image.name}`;
    const image = req.files.image;
    const uploadDir = path.join(__dirname, "../../public/uploads/consumables");
    const filePath = path.join(uploadDir, req.files.image.name);
    await image.mv(filePath);

    await Consumable.query().patchAndFetchById(id, {
      name,
      price: parseFloat(price),
      image_url: imageUrl,
      category_id: parseInt(category),
    });

    res.status(200).json({
      message: "Consumable updated successfully",
    });
  } catch (error) {
    console.error("Error updating consumable image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
