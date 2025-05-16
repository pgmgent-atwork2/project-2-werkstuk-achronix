import knex from "../lib/Knex.js";
import { Model } from "objection";
import User from "./User.js";
import Consumable from "./Consumable.js";

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
      required: [
        "quantity",
        "price",
        "status",
        "consumable_id",
        "user_id",
        "order_on",
      ],
      properties: {
        id: { type: "integer" },
        quantity: { type: "integer", minLength: 1 },
        price: { type: "string", minLength: 1, maxLength: 255 },
        status: { type: "string", minLength: 1, maxLength: 255 },
        consumable_id: { type: "integer", minLength: 1 },
        user_id: { type: "integer", minLength: 1 },
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
      consumable: {
        relation: Model.BelongsToOneRelation,
        modelClass: Consumable,
        join: {
          from: "orders.consumable_id",
          to: "consumables.id",
        },
      },
    };
  }
}

export default Consumable;
