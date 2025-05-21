import Match from "../models/Match.js";
import { parseIcsToMatches } from "../utils/icsParser.js";

/**
 * Handle ICS file import
 */
export const importIcs = async (req, res) => {
  try {
    if (!req.files || !req.files.icsFile) {
      req.flash("error", "Geen bestand geüpload.");
      return res.redirect("/beheerderspaneel/speeldata");
    }

    const icsFile = req.files.icsFile;

    // Validate file type
    if (!icsFile.name.endsWith(".ics")) {
      req.flash("error", "Gelieve een geldig .ics bestand te uploaden.");
      return res.redirect("/beheerderspaneel/speeldata");
    }

    // Parse ICS file
    const icsContent = icsFile.data.toString("utf8");

    // Process matches
    let matches = [];
    try {
      matches = parseIcsToMatches(icsContent);

      if (!matches.length) {
        req.flash("warning", "Geen wedstrijden gevonden in het bestand.");
        return res.redirect("/beheerderspaneel/speeldata");
      }

      // Save matches to database
      for (const match of matches) {
        await Match.query().insert(match);
      }

      req.flash(
        "success",
        `${matches.length} wedstrijden succesvol geïmporteerd.`
      );
    } catch (error) {
      console.error("Error processing matches:", error);
      req.flash("error", `Er is een fout opgetreden: ${error.message}`);
    }

    res.redirect("/beheerderspaneel/speeldata");
  } catch (error) {
    console.error("Error importing ICS file:", error);
    req.flash(
      "error",
      `Er ging iets mis bij het importeren van het bestand: ${error.message}`
    );
    res.redirect("/beheerderspaneel/speeldata");
  }
};
