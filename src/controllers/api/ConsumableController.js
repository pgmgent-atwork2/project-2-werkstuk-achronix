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
  const { name, price, image_url, category_id } = req.body;

  try {
    const consumable = await Consumable.query().insert({
      name,
      price,
      image_url,
      category_id,
    });
    return res.json(consumable);
  } catch (error) {
    return res.status(400).json({ error: "Failed to create consumable" });
  }
};

export const update = async (req, res) => {
  const id = req.params.id;
  const { name, price, image_url, category_id } = req.body;

  try {
    const consumableExists = await Consumable.query().findById(id);
    if (!consumableExists) {
      return res.status(404).json({ error: "Consumable not found" });
    }
    const updatedConsumable = await Consumable.query().patchAndFetchById(id, {
      name,
      description,
      price,
      image_url,
      category_id,
    });
    return res.json(updatedConsumable);
  } catch (error) {
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
    return res.json({ error: "Failed to delete consumable" });
  }
};
