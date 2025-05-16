/**
 * Utility to parse ICS files and extract match data
 */

/**
 * Parse an ICS file content and extract match information
 * @param {string} icsContent - The content of the ICS file
 * @returns {Array} Array of match objects ready to be inserted into the database
 */
export function parseIcsToMatches(icsContent) {
  try {
    const events = extractEvents(icsContent);

    return events
      .map((event) => {
        try {
          const description = event.description || "";
          const summary = event.summary || "";

          // Determine match details from description or summary
          let matchDetails;
          if (description && description.includes("/")) {
            matchDetails = description;
          } else if (summary && summary.includes("/")) {
            matchDetails = summary;
          } else {
            matchDetails = description || summary;
          }

          // Get the teams from the match details
          const teams = matchDetails.includes("/")
            ? matchDetails.split("/").map((t) => t.trim())
            : [];

          // Determine if home or away
          const isHome = event.location && event.location.includes("Assenede");

          // Determine team ID from match details
          const teamId = determineTeamId(matchDetails);

          const match = {
            date: parseIcsDate(event.dtstart),
            location: parseLocation(event.location || ""),
            home_away: isHome ? "THUIS" : "UIT",
            team_id: teamId,
          };

          return match;
        } catch (err) {
          console.error("Error processing event:", err);
          return null;
        }
      })
      .filter((match) => match !== null);
  } catch (err) {
    console.error("Error parsing ICS file:", err);
    return [];
  }
}

/**
 * Determine team ID based on match details
 * @param {string} matchDetails - String containing match details
 * @returns {number|null} Team ID or null if no match
 */
function determineTeamId(matchDetails) {
  // Look for team identifier in the match details
  if (
    matchDetails.includes("Assenede A") ||
    matchDetails.includes("HNO Assenede A")
  ) {
    return 1;
  } else if (
    matchDetails.includes("Assenede B") ||
    matchDetails.includes("HNO Assenede B")
  ) {
    return 2;
  } else if (
    matchDetails.includes("Assenede C") ||
    matchDetails.includes("HNO Assenede C")
  ) {
    return 3;
  }

  return null;
}

/**
 * Extract individual events from ICS content
 * @param {string} icsContent - The content of the ICS file
 * @returns {Array} Array of event objects
 */
function extractEvents(icsContent) {
  try {
    const events = [];
    const eventBlocks = icsContent.split("BEGIN:VEVENT");

    // Skip first element as it's the header
    for (let i = 1; i < eventBlocks.length; i++) {
      const eventBlock = eventBlocks[i].split("END:VEVENT")[0];
      const event = {};

      const lines = eventBlock.split("\n");
      let currentField = null;
      let currentValue = "";

      for (let j = 0; j < lines.length; j++) {
        const line = lines[j].trim();

        // Skip empty lines
        if (!line) continue;

        // If line starts with a space, it's a continuation
        if (line.startsWith(" ") && currentField) {
          currentValue += line;
          continue;
        }

        // Save the previous field if we have one
        if (currentField && currentValue) {
          event[currentField] = currentValue;
          currentField = null;
          currentValue = "";
        }

        // Parse fields
        if (line.startsWith("DTSTART")) {
          currentField = "dtstart";
          if (line.includes(":")) {
            currentValue = line.split(":").pop();
          }
        } else if (line.startsWith("LOCATION")) {
          currentField = "location";
          if (line.includes(":")) {
            currentValue = line.split(":").pop();
          }
        } else if (line.startsWith("SUMMARY")) {
          currentField = "summary";
          if (line.includes(":")) {
            currentValue = line.split(":").pop();
          }
        } else if (line.startsWith("DESCRIPTION")) {
          currentField = "description";
          if (line.includes(":")) {
            currentValue = line.split(":").pop();
          }
        }
      }

      // Don't forget to add the last field
      if (currentField && currentValue) {
        event[currentField] = currentValue;
      }

      events.push(event);
    }

    return events;
  } catch (err) {
    console.error("Error extracting events:", err);
    return [];
  }
}

/**
 * Parse ICS date format to JavaScript Date object
 * @param {string} icsDate - Date string from ICS file
 * @returns {Date} JavaScript Date object
 */
function parseIcsDate(icsDate) {
  try {
    if (!icsDate) return new Date().toISOString().split("T")[0];

    // Handle dates with timezone identifiers
    if (icsDate.includes(";")) {
      icsDate = icsDate.split(":").pop();
    }

    // Basic format: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
    const year = parseInt(icsDate.substring(0, 4));
    const month = parseInt(icsDate.substring(4, 6)) - 1; // JS months are 0-indexed
    const day = parseInt(icsDate.substring(6, 8));
    const hour = parseInt(icsDate.substring(9, 11) || "0");
    const minute = parseInt(icsDate.substring(11, 13) || "0");

    // Convert to ISO format string for SQLite compatibility
    const date = new Date(year, month, day, hour, minute);

    // Return ISO date string for SQLite compatibility
    return date.toISOString().split("T")[0];
  } catch (err) {
    console.error("Error parsing date:", err);
    return new Date().toISOString().split("T")[0];
  }
}

/**
 * Parse location string to a clean format
 * @param {string} location - Location string from ICS file
 * @returns {string} Cleaned location string
 */
function parseLocation(location = "") {
  try {
    // Clean up escaped characters
    return location.replace(/\\,/g, ",").replace(/\\n/g, " ").trim();
  } catch (err) {
    console.error("Error parsing location:", err);
    return location;
  }
}
