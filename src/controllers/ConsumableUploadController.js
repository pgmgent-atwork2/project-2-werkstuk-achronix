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
      stock: parseInt(req.body.stock),
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
    const { id, name, stock, price, category } = req.body;

    const consumable = await Consumable.query().findById(id);

    if (!consumable) {
      return res.status(404).json({ error: "Consumable not found" });
    }

    const wasOutOfStock = consumable.stock === 0;
    const isNowInStock = parseInt(stock) > 0;

    let updatedConsumable;

    if (!req.files) {
      updatedConsumable = await Consumable.query().patchAndFetchById(id, {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        category_id: parseInt(category),
      });
    } else {
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
      const uploadDir = path.join(
        __dirname,
        "../../public/uploads/consumables"
      );
      const filePath = path.join(uploadDir, req.files.image.name);
      await image.mv(filePath);

      updatedConsumable = await Consumable.query().patchAndFetchById(id, {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        image_url: imageUrl,
        category_id: parseInt(category),
      });
    }

    if (wasOutOfStock && isNowInStock) {
      setTimeout(async () => {
        await createBackInStockNotifications(updatedConsumable);
      }, 100);
    }

    res.status(200).json({
      message: "Consumable updated successfully",
    });
  } catch (error) {
    console.error("Error updating consumable image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteConsumable = async (req, res) => {
  const id = req.body.consumableId;

  const consumable = await Consumable.query().findById(id);

  if (!consumable) {
    return res.status(404).json({ error: "Consumable not found" });
  }

  const file = path.join(__dirname, "../../public", consumable.image_url);

  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }

  await Consumable.query().deleteById(id);
  res.status(200).json({
    message: "Consumable deleted successfully",
  });
};

let notificationLock = new Set();

async function createBackInStockNotifications(consumable) {
  const lockKey = `notification_${consumable.id}`;
  if (notificationLock.has(lockKey)) {
    return;
  }

  notificationLock.add(lockKey);

  try {
    const User = (await import("../models/User.js")).default;
    const Notification = (await import("../models/Notification.js")).default;

    await Notification.query()
      .delete()
      .where("type", "back_in_stock");

    const users = await User.query();

    for (const user of users) {
      await Notification.query().insert({
        user_id: user.id,
        consumable_id: consumable.id,
        title: "Product terug beschikbaar",
        message: `${consumable.name} is weer beschikbaar!`,
        type: "back_in_stock",
        is_read: false,
      });
      
    }

  } catch (error) {
    console.error("Error creating back in stock notifications:", error);
  }

  setTimeout(() => {
    notificationLock.delete(lockKey);
  }, 5000);
}
