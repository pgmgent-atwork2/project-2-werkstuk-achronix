import { Model } from "objection";
import Order from "./Order.js";
import Consumable from "./Consumable.js";

class OrderItem extends Model {
  static get tableName() {
    return "order_items";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["order_id", "consumable_id", "quantity", "price"],

      properties: {
        id: { type: "integer" },
        order_id: { type: "integer" },
        consumable_id: { type: "integer" },
        quantity: { type: "integer", minimum: 1 },
        price: { type: "number", minimum: 0 },
        created_at: { type: "string", format: "date-time" }
      }
    };
  }

  static get relationMappings() {
    return {
    
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: "order_items.order_id",
          to: "orders.id"
        }
      },
      
      
      consumable: {
        relation: Model.BelongsToOneRelation,
        modelClass: Consumable,
        join: {
          from: "order_items.consumable_id",
          to: "consumables.id"
        }
      }
    };
  }
}

export default OrderItem;