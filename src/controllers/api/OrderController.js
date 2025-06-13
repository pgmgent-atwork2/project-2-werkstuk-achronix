import Order from "../../models/Order.js";
import jwt from "jsonwebtoken";

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
    const order = await Order.query()
      .findById(id)
      .withGraphFetched("orderItems.consumable");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Order", error });
  }
};

export const store = async (req, res) => {
  try {
    const { user_id } = req.body;
    const userToken = req.cookies.token;

    const userData = jwt.verify(userToken, process.env.TOKEN_SALT);

    if (userData.role.name !== "admin" && userData.userId !== user_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newOrder = await Order.query().insert(req.body);
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating Order", error });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { status, user_id, order_on } = req.body;
  try {
    const Order = await Order.query().findById(id);
    if (!Order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const updatedOrder = await Order.query().patchAndFetchById(id, {
      user_id,
      status,
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
    const order = await Order.query().findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Order.query().deleteById(id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Order", error });
  }
};

export const findByName = async (req, res) => {
  const { name } = req.params;

  try {
    if (name === "undefined") {
      const orders = await Order.query()
        .withGraphFetched("user")
        .withGraphFetched("orderItems.consumable")
        .orderBy("order_on", "desc");

      return res.json(orders);
    }

    const orders = await Order.query()
      .joinRelated("user")
      .where("user.firstname", "like", `%${name}%`)
      .orWhere("user.lastname", "like", `%${name}%`)
      .withGraphFetched("user")
      .withGraphFetched("orderItems.consumable")
      .orderBy("order_on", "desc");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders by name:", error);
    res.status(500).json({ message: "Error fetching orders by name", error });
  }
};

export const findByStatus = async (req, res) => {
  const { status } = req.params;

  if (status === "undefined") {
    try {
      const orders = await Order.query()
        .withGraphFetched("user")
        .withGraphFetched("orderItems.consumable")
        .orderBy("order_on", "desc");

      if (!orders || orders.length === 0) {
        return res.status(204).json({ message: "No orders found" });
      }

      return res.json(orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      return res
        .status(500)
        .json({ message: "Error fetching all orders", error });
    }
  }

  try {
    const orders = await Order.query()
      .where("status", status)
      .withGraphFetched("user")
      .withGraphFetched("orderItems.consumable")
      .orderBy("order_on", "desc");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res.status(500).json({ message: "Error fetching orders by status", error });
  }
};

export const findByPaymentMethod = async (req, res) => {
  const { paymentMethod } = req.params;

  try {
    const orders = await Order.query()
      .where("method", paymentMethod)
      .withGraphFetched("user")
      .withGraphFetched("orderItems.consumable")
      .orderBy("order_on", "desc");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders by payment method:", error);
    res.status(500).json({
      message: "Error fetching orders by payment method",
      error,
    });
  }
};

export const findStatusByUser = async (req, res) => {
  const { user_id, status } = req.params;

  try {
    const orders = await Order.query()
      .where("user_id", user_id)
      .andWhere("status", status)
      .withGraphFetched("user")
      .withGraphFetched("orderItems.consumable")
      .orderBy("order_on", "desc");

    if (!orders || orders.length === 0) {
      return res.status(204).json({ message: "No orders found" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders by user and status:", error);
    res.status(500).json({
      message: "Error fetching orders by user and status",
      error,
    });
  }
};
