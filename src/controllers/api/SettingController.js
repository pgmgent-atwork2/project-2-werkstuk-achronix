import Setting from "../../models/Setting.js";

export const getSpendingLimit = async (req, res) => {
  try {
    const setting = await Setting.query()
      .where("key", "spending_limit_per_order")
      .first();

    if (!setting) {
      return res.json({
        success: true,
        data: {
          limit: 0,
        },
      });
    }

    return res.json({
      success: true,
      data: {
        limit: parseFloat(setting.value),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch spending limit",
      error: error.message,
    });
  }
};

export const updateSpendingLimit = async (req, res) => {
  try {
    const { limit } = req.body;

    if (limit === undefined || isNaN(limit) || limit < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid limit amount",
      });
    }

    const setting = await Setting.query()
      .where("key", "spending_limit_per_order")
      .first();

    if (setting) {
      await Setting.query()
        .where("key", "spending_limit_per_order")
        .patch({ value: limit.toString() });
    } else {
      await Setting.query().insert({
        key: "spending_limit_per_order",
        value: limit.toString(),
      });
    }

    return res.json({
      success: true,
      message: "Spending limit updated successfully",
      data: {
        limit: parseFloat(limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update spending limit",
      error: error.message,
    });
  }
};
