export const dismissBackInStockNotification = async (req, res) => {
  try {
    const { consumableId } = req.params;
    const userId = req.user.id;

    const Notification = (await import("../../models/Notification.js")).default;

    await Notification.query()
      .patch({ is_read: true })
      .where("user_id", userId)
      .where("consumable_id", consumableId)
      .where("type", "back_in_stock");

    return res.json({ success: true });
  } catch (error) {
    console.error("Error dismissing notification:", error);
    return res.status(500).json({ error: "Failed to dismiss notification" });
  }
};

export const dismissAllBackInStockNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const Notification = (await import("../../models/Notification.js")).default;

    await Notification.query()
      .patch({ is_read: true })
      .where("user_id", userId)
      .where("type", "back_in_stock");

    return res.json({ success: true });
  } catch (error) {
    console.error("Error dismissing all notifications:", error);
    return res
      .status(500)
      .json({ error: "Failed to dismiss all notifications" });
  }
};
