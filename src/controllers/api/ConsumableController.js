import Consumable from "../../models/Consumable.js";

export const show = async (req, res) => {
  const id = req.params.id;
  const consumable = await Consumable.query().findById(id);
  if (!consumable) {
    return res.status(404).json({ error: "Consumable not found" });
  }
  return res.json(consumable);
};

export const index = async (req, res) => {
  const consumables = await Consumable.query();
  return res.json(consumables);
};

export const store = async (req, res) => {
  const { name, price, stock, image_url, category_id } = req.body;

  try {
    const consumable = await Consumable.query().insert({
      name,
      price,
      stock,
      image_url,
      category_id,
    });
    return res.json(consumable);
  } catch (error) {
    console.error("Error creating consumable:", error);
    return res.status(400).json({ error: "Failed to create consumable" });
  }
};

export const update = async (req, res) => {
  const id = req.params.id;
  const { name, price, stock, image_url, category_id } = req.body;

  try {
    const consumableExists = await Consumable.query().findById(id);
    if (!consumableExists) {
      return res.status(404).json({ error: "Consumable not found" });
    }
    const updatedConsumable = await Consumable.query().patchAndFetchById(id, {
      name,
      price,
      stock,
      image_url,
      category_id,
    });
    return res.json(updatedConsumable);
  } catch (error) {
    console.error("Error updating consumable:", error);
    return res.status(400).json({ error: "Failed to update consumable" });
  }
};

export const destroy = async (req, res) => {
  const id = req.params.id;

  try {
    const consumableExists = await Consumable.query().findById(id);
    if (!consumableExists) {
      return res.status(404).json({ error: "Consumable not found" });
    }
    await Consumable.query().deleteById(id);
    return res.json({ message: "Consumable deleted successfully" });
  } catch (error) {
    console.error("Error deleting consumable:", error);
    return res.json({ error: "Failed to delete consumable" });
  }
};

export const updateStock = async (req, res) => {
  const { stock } = req.body;
  const id = req.params.id;

  try {
    const consumableExists = await Consumable.query().findById(id);
    if (!consumableExists) {
      return res.status(404).json({ error: "Consumable not found" });
    }
    const newStock = consumableExists.stock - stock;
    const updatedConsumable = await Consumable.query().patchAndFetchById(id, {
      stock: newStock,
    });
    return res.json(updatedConsumable);
  } catch (error) {
    console.error("Error updating stock:", error);
    return res.status(400).json({ error: "Failed to update stock" });
  }
};

export const findByName = async (req, res) => {
  const { name } = req.params;

  if (name === "undefined") {
    try {
      const consumables = await Consumable.query();
      return res.json(consumables);
    } catch (error) {
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het ophalen van producten.",
        error: error.message,
      });
    }
  }

  try {
    const consumables = await Consumable.query().where(
      "name",
      "like",
      `%${name}%`
    );

    return res.json(consumables);
  } catch (error) {
    console.log("Error fetching products:", error);
    return res.status(500).json({
      message: "Er is een fout opgetreden bij het zoeken naar producten.",
      error: error.message,
    });
  }
};

export const findByCategory = async (req, res) => {
  const { categoryId } = req.params;

  if (categoryId === "undefined") {
    try {
      const consumables = await Consumable.query();
      return res.json(consumables);
    } catch (error) {
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het ophalen van producten.",
        error: error.message,
      });
    }
  }

  try {
    const consumables = await Consumable.query().where(
      "category_id",
      categoryId
    );
    return res.json(consumables);
  } catch (error) {
    console.log("Error fetching products by category:", error);
    return res.status(500).json({
      message: "Er is een fout opgetreden bij het zoeken naar producten.",
      error: error.message,
    });
  }
};
