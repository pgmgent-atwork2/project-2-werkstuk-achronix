import knex from "../lib/Knex.js";
import { Model } from "objection";
import User from "./User.js";
import Match from "./Match.js";

Model.knex(knex);

class Attendance extends Model {
  static get tableName() {
    return "attendance";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "match_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        match_id: { type: "integer" },
        status: { type: "string", default: "unknown" },
        is_selected: { type: "string", default: "not_selected" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => User,
        join: {
          from: "attendance.user_id",
          to: "users.id",
        },
      },
      match: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => Match,
        join: {
          from: "attendance.match_id",
          to: "matches.id",
        },
      },
    };
  }
}

export default Attendance;
