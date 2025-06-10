import OrderItem from "../../models/OrderItem.js";
import jwt from "jsonwebtoken";

export const index = async (req, res) => {
  try {
    const orderItems = await OrderItem.query();
    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order items", error });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const orderItem = await OrderItem.query().findById(id);
    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }
    res.json(orderItem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order item", error });
  }
};

export const store = async (req, res) => {
  try {
    const { user_id, order_id, consumable_id, quantity, price } = req.body;
    const userToken = req.cookies.token;

    const userData = jwt.verify(userToken, process.env.TOKEN_SALT);

    if (userData.role.name !== "admin" && userData.userId !== user_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newOrderItem = await OrderItem.query().insert({
      order_id,
      consumable_id,
      quantity,
      price,
    });
    res.status(201).json(newOrderItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating order item", error });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { user_id, order_id, consumable_id, quantity, price } = req.body;
  try {
    const userToken = req.cookies.token;

    const userData = jwt.verify(userToken, process.env.TOKEN_SALT);

    if (userData.role.name !== "admin" && userData.userId !== user_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orderItem = await OrderItem.query().findById(id);
    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }
    const updatedOrderItem = await OrderItem.query().patchAndFetchById(id, {
      order_id,
      consumable_id,
      quantity,
      price,
    });
    res.json(updatedOrderItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating order item", error });
  }
};

export const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const orderItem = await OrderItem.query().findById(id);
    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }
    await OrderItem.query().deleteById(id);
    res.json({ message: "Order item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order item", error });
  }
};

export const getItemsByOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const orderItems = await OrderItem.query()
      .where("order_id", orderId)
      .withGraphFetched("consumable");

    if (orderItems.length === 0) {
      return res.status(404).json({ message: "No items found for this order" });
    }

    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order items", error });
  }
};
