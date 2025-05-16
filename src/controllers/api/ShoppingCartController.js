import ShoppingCart from "../../models/ShoppingCart.js";

export const index = async (req, res) => {
  try {
    const shoppingCarts = await ShoppingCart.query();
    res.status(200).json(shoppingCarts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ShoppingCarts", error });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const shoppingCart = await ShoppingCart.query().findById(id);
    if (!shoppingCart) {
      return res.status(404).json({ message: "ShoppingCart not found" });
    }
    res.json(shoppingCart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ShoppingCart", error });
  }
};

export const store = async (req, res) => {
  try {
    const newShoppingCart = await ShoppingCart.query().insert(req.body);
    res.json(newShoppingCart);
  } catch (error) {
    res.status(500).json({ message: "Error creating ShoppingCart", error });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const {
    quantity,
    price,
    consumable_id,
    user_id,
    consumableName,
    consumableImage,
  } = req.body;
  try {
    const ShoppingCart = await ShoppingCart.query().findById(id);
    if (!ShoppingCart) {
      return res.status(404).json({ message: "ShoppingCart not found" });
    }
    const updatedShoppingCart = await ShoppingCart.query().patchAndFetchById(
      id,
      {
        quantity,
        price,
        consumable_id,
        user_id,
        consumableName,
        consumableImage,
      }
    );
    res.json(updatedShoppingCart);
  } catch (error) {
    res.status(500).json({ message: "Error updating ShoppingCart", error });
  }
};

export const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const shoppingCart = await ShoppingCart.query().findById(id);
    if (!shoppingCart) {
      return res.status(404).json({ message: "ShoppingCart not found" });
    }
    await ShoppingCart.query().deleteById(id);
    res.json({ message: "ShoppingCart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ShoppingCart", error });
  }
};
