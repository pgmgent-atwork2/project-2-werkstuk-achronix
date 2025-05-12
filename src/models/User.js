import knex from "../lib/Knex.js";
import { Model } from "objection";

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "firstname", "lastname", "password"],
      properties: {
        id: { type: "integer" },
        email: {
          type: "string",
          format: "email",
          minLength: 1,
          maxLength: 255,
        },
        firstname: { type: "string", minLength: 1, maxLength: 255 },
        lastname: { type: "string", minLength: 1, maxLength: 255 },
        password: { type: "string", minLength: 6, maxLength: 255 },
        is_admin: { type: "boolean", default: false },
        receive_notifications: { type: "boolean", default: true },
      },
    };
  }
}

export default User;
