import knex from "../lib/Knex.js";
import { Model } from "objection";

Model.knex(knex);

class Consumable extends Model {
  static get tableName() {
    return "consumables";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "description", "price", "image_url", "category_id"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        price: { type: "number" },
        image_url: { type: "string", minLength: 1, maxLength: 255 },
        category_id: { type: "integer" },
      },
    };
  }
}

export default Consumable;
