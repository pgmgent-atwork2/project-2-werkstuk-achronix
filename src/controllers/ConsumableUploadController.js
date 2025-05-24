import Consumable from "../models/Consumable.js";

export const uploadConsumableImage = async (req, res) => {
  try {
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `/uploads/consumables/${req.file.filename}`;

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
