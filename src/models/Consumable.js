import knex from "../lib/Knex.js";
import { Model } from "objection";
import Category from "./Category.js";

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
      required: ["name", "price", "image_url", "category_id"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        price: { type: "number" },
        image_url: { type: "string", minLength: 1, maxLength: 255 },
        category_id: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: "consumables.category_id",
          to: "categories.id",
        },
      },
    };
  }
}

export default Consumable;
