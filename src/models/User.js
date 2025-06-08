import knex from "../lib/Knex.js";
import { Model } from "objection";
import Attendance from "./Attendance.js";
import Role from "./Role.js";

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
        role_id: { type: "integer" },
        receive_notifications: { type: "boolean", default: true },
      },
    };
  }

  static get relationMappings() {
    return {
      attendance: {
        relation: Model.HasManyRelation,
        modelClass: () => Attendance,
        join: {
          from: "users.id",
          to: "attendance.user_id",
        },
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => Role,
        join: {
          from: "users.role_id",
          to: "roles.id",
        },
      }
    };
  }
}

export default User;
