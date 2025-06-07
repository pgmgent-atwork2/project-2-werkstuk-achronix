import { Model } from "objection";

class Notification extends Model {
  static get tableName() {
    return "notification";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "consumable_id", "title", "message"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        consumable_id: { type: "integer" },
        title: { type: "string" },
        message: { type: "string" },
        type: { type: "string", default: "back_in_stock" },
        is_read: { type: "boolean", default: false },
        created_at: { type: "string" },
        updated_at: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: "User",
        join: {
          from: "notification.user_id",
          to: "users.id",
        },
      },
      consumable: {
        relation: Model.BelongsToOneRelation,
        modelClass: "Consumable",
        join: {
          from: "notification.consumable_id",
          to: "consumables.id",
        },
      },
    };
  }
}

export default Notification;
