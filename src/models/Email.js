import { Model } from "objection";
import knex from "../lib/Knex.js";

Model.knex(knex);
class Email extends Model {
  static get tableName() {
    return "emails";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "subject", "content", "is_sent"],
      properties: {
        id: { type: "integer" },
        email: { type: "string", minLength: 1 },
        subject: { type: "string", minLength: 1 },
        content: { type: "string", minLength: 1 },
        is_sent: { type: "boolean" },
      },
    };
  }
}

export default Email;
