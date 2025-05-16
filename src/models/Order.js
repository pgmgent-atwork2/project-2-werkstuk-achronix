import knex from "../lib/Knex.js";
import { Model } from "objection";
import User from "./User.js";
import OrderItem from "./OrderItems.js";

Model.knex(knex);

class Order extends Model {
  static get tableName() {
    return "orders";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["status", "user_id", "order_on"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        status: { type: "string" },
        order_on: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
     
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "orders.user_id",
          to: "users.id",
        },
      },

      orderItems: {
        relation: Model.HasManyRelation,
        modelClass: OrderItem,
        join: {
          from: "orders.id",
          to: "order_items.order_id",
        },
      },
    };
  }
}

export default Order;
