import Order from "../../models/Order.js";

export const index = async (req, res) => {
  try {
    const orders = await Order.query();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const Order = await Order.query().findById(id);
    if (!Order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(Order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Order", error });
  }
};

export const store = async (req, res) => {
  try {
    const newOrder = await Order.query().insert(req.body);
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating Order", error });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { quantity, price, status, consumable_id, user_id, order_on } =
    req.body;
  try {
    const Order = await Order.query().findById(id);
    if (!Order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const updatedOrder = await Order.query().patchAndFetchById(id, {
      quantity,
      price,
      status,
      consumable_id,
      user_id,
      order_on,
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating Order", error });
  }
};

export const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const Order = await Order.query().findById(id);
    if (!Order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Order.query().deleteById(id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Order", error });
  }
};
