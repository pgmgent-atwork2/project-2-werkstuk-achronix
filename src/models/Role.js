import knex from "../lib/Knex.js";
import { Model } from "objection";

Model.knex(knex);

class Role extends Model {
  static get tableName() {
    return "roles";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
      },
    };
  }
}

export default Role;
