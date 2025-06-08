import { Model } from "objection";

export default class Setting extends Model {
  static get tableName() {
    return "settings";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        key: { type: "string" },
        value: { type: "string" },
      },
    };
  }
}
