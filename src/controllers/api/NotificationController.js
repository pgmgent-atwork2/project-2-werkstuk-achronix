import Notification from "../../models/Notification.js";
import User from "../../models/User.js";

export const index = async (req, res) => {
  try {
    const notifications = await Notification.query()
      .where("type", "admin_message")
      .orderBy("created_at", "desc");

    return res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      message: "Er is een fout opgetreden bij het ophalen van notificaties.",
      error: error.message,
    });
  }
};

export const show = async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await Notification.query().findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notificatie niet gevonden." });
    }

    return res.json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    return res.status(500).json({
      message: "Er is een fout opgetreden bij het ophalen van de notificatie.",
      error: error.message,
    });
  }
};

export const store = async (req, res) => {
  try {
    const { title, message, recipient_type, selected_user } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Titel en bericht zijn verplicht.",
      });
    }

    if (
      !recipient_type ||
      (recipient_type !== "all" && recipient_type !== "single")
    ) {
      return res.status(400).json({
        message: "Ongeldig ontvanger type.",
      });
    }

    if (recipient_type === "single" && !selected_user) {
      return res.status(400).json({
        message: "Selecteer een gebruiker voor persoonlijke notificatie.",
      });
    }

    let users;
    if (recipient_type === "single") {
      const user = await User.query().findById(selected_user);
      if (!user) {
        return res.status(404).json({
          message: "Geselecteerde gebruiker niet gevonden.",
        });
      }
      users = [user];
    } else {
      users = await User.query();
    }

    const notifications = [];
    for (const user of users) {
      const notificationData = {
        user_id: user.id,
        consumable_id: null,
        title,
        message,
        type: "admin_message",
        is_read: false,
      };

      const notification = await Notification.query().insert(notificationData);
      notifications.push(notification);
    }

    const successMessage =
      recipient_type === "single"
        ? `Notificatie succesvol verstuurd naar ${users[0].firstname} ${users[0].lastname}`
        : "Notificatie succesvol aangemaakt voor alle gebruikers";

    return res.status(201).json({
      success: true,
      message: successMessage,
      data: notifications[0],
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({
      success: false,
      message: "Er is een fout opgetreden bij het aanmaken van de notificatie.",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Titel en bericht zijn verplicht.",
      });
    }

    const originalNotification = await Notification.query().findById(id);

    if (!originalNotification) {
      return res.status(404).json({ message: "Notificatie niet gevonden." });
    }

    await Notification.query()
      .where("type", "admin_message")
      .where("title", originalNotification.title)
      .where("message", originalNotification.message)
      .patch({
        title,
        message,
        updated_at: new Date(),
      });

    return res.json({
      success: true,
      message: "Notificatie succesvol bijgewerkt voor alle gebruikers",
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({
      success: false,
      message:
        "Er is een fout opgetreden bij het bijwerken van de notificatie.",
      error: error.message,
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const id = req.params.id;

    const notification = await Notification.query().findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notificatie niet gevonden." });
    }

    await Notification.query()
      .where("type", "admin_message")
      .where("title", notification.title)
      .where("message", notification.message)
      .delete();

    return res.json({
      success: true,
      message: "Notificatie succesvol verwijderd voor alle gebruikers",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      success: false,
      message:
        "Er is een fout opgetreden bij het verwijderen van de notificatie.",
      error: error.message,
    });
  }
};

export const findByTitle = async (req, res) => {
  const { title } = req.params;

  if (title === "undefined") {
    try {
      const notifications = await Notification.query()
        .where("type", "admin_message")
        .orderBy("created_at", "desc");
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het ophalen van notificaties.",
        error: error.message,
      });
    }
  }

  try {
    const notifications = await Notification.query()
      .where("type", "admin_message")
      .where("title", "like", `%${title}%`)
      .orderBy("created_at", "desc");

    return res.json(notifications);
  } catch (error) {
    console.log("Error fetching notifications:", error);
    return res.status(500).json({
      message: "Er is een fout opgetreden bij het zoeken naar notificaties.",
      error: error.message,
    });
  }
};

export const dismissBackInStock = async (req, res) => {
  try {
    const { consumableId } = req.params;
    const userId = req.user.id;

    await Notification.query()
      .where("user_id", userId)
      .where("consumable_id", consumableId)
      .where("type", "back_in_stock")
      .patch({ is_read: true });

    return res.json({
      success: true,
      message: "Notificatie weggeveegd",
    });
  } catch (error) {
    console.error("Error dismissing notification:", error);
    return res.status(500).json({
      success: false,
      message: "Er is een fout opgetreden bij het wegvegen van de notificatie.",
      error: error.message,
    });
  }
};

export const dismissAllBackInStock = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.query()
      .where("user_id", userId)
      .where("type", "back_in_stock")
      .patch({ is_read: true });

    return res.json({
      success: true,
      message: "Alle notificaties weggeveegd",
    });
  } catch (error) {
    console.error("Error dismissing all notifications:", error);
    return res.status(500).json({
      success: false,
      message:
        "Er is een fout opgetreden bij het wegvegen van alle notificaties.",
      error: error.message,
    });
  }
};

export const dismissAdminNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await Notification.query()
      .where("id", id)
      .where("user_id", userId)
      .where("type", "admin_message")
      .patch({ is_read: true });

    return res.json({
      success: true,
      message: "Admin notificatie weggeveegd",
    });
  } catch (error) {
    console.error("Error dismissing admin notification:", error);
    return res.status(500).json({
      success: false,
      message: "Er is een fout opgetreden bij het wegvegen van de notificatie.",
      error: error.message,
    });
  }
};

export const dismissAllAdminNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.query()
      .where("user_id", userId)
      .where("type", "admin_message")
      .patch({ is_read: true });

    return res.json({
      success: true,
      message: "Alle admin notificaties weggeveegd",
    });
  } catch (error) {
    console.error("Error dismissing all admin notifications:", error);
    return res.status(500).json({
      success: false,
      message:
        "Er is een fout opgetreden bij het wegvegen van alle notificaties.",
      error: error.message,
    });
  }
};
