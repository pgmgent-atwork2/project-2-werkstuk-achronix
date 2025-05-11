import Category from "../../models/Category.js";

export const index = async (req, res) => {
  try {
    const categories = await Category.query();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.query().findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

export const store = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await Category.query().insert({ name });
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await Category.query().findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const updatedCategory = await Category.query().patchAndFetchById(id, {
      name,
    });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

export const destroy = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.query().findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        await Category.query().deleteById(id);
        res.json({ message: "Category deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting category", error });
    }
}