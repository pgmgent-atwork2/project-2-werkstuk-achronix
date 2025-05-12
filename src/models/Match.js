import knex from "../lib/Knex.js";
import { Model } from "objection";
import Team from "./Team.js";

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
      },
    };
  }

  static get relationMappings() {
    return {
      team: {
        relation: Model.BelongsToOneRelation,
        modelClass: Team,
        join: {
          from: "matches.team_id",
          to: "teams.id",
        },
      },
    };
  }
}

export default Match;
