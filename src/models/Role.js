import knex from "../lib/Knex.js";
import { Model } from "objection";
import User from "./User.js";

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
  static get relationMappings() {
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: () => User,
        join: {
          from: "roles.id",
          to: "users.role_id",
        },
      },
    };
  }
}

export default Role;
