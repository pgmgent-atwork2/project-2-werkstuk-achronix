import { Model } from "objection";
import Consumable from "./Consumable.js";
import User from "./User.js";

class ShoppingCart extends Model {
  static get tableName() {
    return "shopping_cart";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "consumable_id",
        "user_id",
        "quantity",
        "price",
        "consumableName",
      ],

      properties: {
        id: { type: "integer" },
        consumable_id: { type: "integer" },
        user_id: { type: "integer" },
        quantity: { type: "integer", minimum: 1 },
        price: { type: "number" },
        consumableName: { type: "string", minLength: 1 },
        consumableImage: { type: ["string", "null"] },
        created_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      consumable: {
        relation: Model.BelongsToOneRelation,
        modelClass: Consumable,
        join: {
          from: "shopping_cart.consumable_id",
          to: "consumables.id",
        },
      },

      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "shopping_cart.user_id",
          to: "users.id",
        },
      },
    };
  }
}

export default ShoppingCart;
