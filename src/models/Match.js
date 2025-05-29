import knex from "../lib/Knex.js";
import { Model } from "objection";
import Team from "./Team.js";
import Attendance from "./Attendance.js";

Model.knex(knex);

class Match extends Model {
  static get tableName() {
    return "matches";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["date", "location", "home_away"],
      properties: {
        id: { type: "integer" },
        date: { type: "string", format: "date" },
        location: { type: "string", minLength: 1, maxLength: 255 },
        home_away: { type: "string", enum: ["THUIS", "UIT"] },
        team_id: { type: ["integer", "null"] },
        start_time: { type: ["string", "null"] },
        end_time: { type: ["string", "null"] },
      },
    };
  }

  static get relationMappings() {
    return {
      team: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => Team,
        join: {
          from: "matches.team_id",
          to: "teams.id",
        },
      },
      attendance: {
        relation: Model.HasManyRelation,
        modelClass: () => Attendance,
        join: {
          from: "matches.id",
          to: "attendance.match_id",
        },
      },
    };
  }
}

export default Match;
