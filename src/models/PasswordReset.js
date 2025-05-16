import knex from "../lib/Knex.js";
import { Model } from "objection";
import User from "./User.js";

Model.knex(knex);

class PasswordReset extends Model {
  static get tableName() {
    return "password_resets";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "token", "created_at", "expires_at"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        token: { type: "string", minLength: 1, maxLength: 255 },
        created_at: { type: "string", format: "date-time" },
        expires_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "password_resets.user_id",
          to: "users.id",
        },
      },
    };
  }
}

export default PasswordReset;
