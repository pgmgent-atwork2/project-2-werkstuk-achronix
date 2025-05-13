import Match from "../models/Match.js";
import { parseIcsToMatches } from "../utils/icsParser.js";

/**
 * Handle ICS file import
 */
export const importIcs = async (req, res) => {
  try {
    console.log("Import ICS called");
    console.log("Request files:", req.files);
    console.log("Request body:", req.body);

    if (!req.files || !req.files.icsFile) {
      console.log("No file uploaded");
      req.flash("error", "Geen bestand geüpload.");
      return res.redirect("/wedstrijden");
    }

    const icsFile = req.files.icsFile;
    const teamId = parseInt(req.body.teamId) || null;

    console.log("File name:", icsFile.name);
    console.log("Team ID:", teamId);

    // Validate file type (simple check)
    if (!icsFile.name.endsWith(".ics")) {
      console.log("Invalid file type");
      req.flash("error", "Gelieve een geldig .ics bestand te uploaden.");
      return res.redirect("/wedstrijden");
    }

    // Parse ICS file
    const icsContent = icsFile.data.toString("utf8");
    console.log("ICS content sample:", icsContent.substring(0, 200));
    console.log("ICS file size:", icsFile.data.length, "bytes");

    let matches = [];
    try {
      matches = parseIcsToMatches(icsContent, teamId);
      console.log("Parsed matches:", matches.length);
    } catch (parseError) {
      console.error("Error parsing ICS:", parseError);
      console.error("Error stack:", parseError.stack);
      req.flash(
        "error",
        `Er is een fout opgetreden bij het verwerken van het ICS-bestand: ${parseError.message}`
      );
      return res.redirect("/wedstrijden");
    }

    if (!matches.length) {
      req.flash("warning", "Geen wedstrijden gevonden in het bestand.");
      return res.redirect("/wedstrijden");
    }

    // Save all matches to database
    try {
      console.log(
        "Attempting to insert matches to database:",
        JSON.stringify(matches[0])
      );

      // Insert matches one by one to better isolate errors
      for (const match of matches) {
        try {
          await Match.query().insert(match);
        } catch (insertError) {
          console.error("Error inserting match:", match, insertError);
          throw new Error(`Database error: ${insertError.message}`);
        }
      }

      req.flash(
        "success",
        `${matches.length} wedstrijden succesvol geïmporteerd.`
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      req.flash("error", `Database fout: ${dbError.message}`);
    }

    res.redirect("/wedstrijden");
  } catch (error) {
    console.error("Error importing ICS file:", error);
    console.error("Error stack:", error.stack);
    req.flash(
      "error",
      `Er ging iets mis bij het importeren van het bestand: ${error.message}`
    );
    res.redirect("/wedstrijden");
  }
};
