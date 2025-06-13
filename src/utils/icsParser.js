export function parseIcsToMatches(icsContent) {
  try {
    const events = extractEvents(icsContent);

    return events
      .map((event) => {
        try {
          const description = event.description || "";
          const summary = event.summary || "";

          let matchDetails;
          if (description && description.includes("/")) {
            matchDetails = description;
          } else if (summary && summary.includes("/")) {
            matchDetails = summary;
          } else {
            matchDetails = description || summary;
          }

          const isHome = event.location && event.location.includes("Assenede");

          const teamId = determineTeamId(matchDetails);

          const dateInfo = parseIcsDate(event.dtstart);
          const endTimeInfo = event.dtend ? parseIcsTime(event.dtend) : null;

          const match = {
            date: dateInfo.date,
            start_time: parseIcsTime(event.dtstart),
            end_time: endTimeInfo,
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

function determineTeamId(matchDetails) {
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

function extractEvents(icsContent) {
  try {
    const events = [];
    const eventBlocks = icsContent.split("BEGIN:VEVENT");

    for (let i = 1; i < eventBlocks.length; i++) {
      const eventBlock = eventBlocks[i].split("END:VEVENT")[0];
      const event = {};

      const lines = eventBlock.split("\n");
      let currentField = null;
      let currentValue = "";

      for (let j = 0; j < lines.length; j++) {
        const line = lines[j].trim();

        if (!line) continue;

        if (line.startsWith(" ") && currentField) {
          currentValue += line;
          continue;
        }

        if (currentField && currentValue) {
          event[currentField] = currentValue;
          currentField = null;
          currentValue = "";
        }

        if (line.startsWith("DTSTART")) {
          currentField = "dtstart";
          if (line.includes(":")) {
            currentValue = line.split(":").pop();
          }
        } else if (line.startsWith("DTEND")) {
          currentField = "dtend";
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

function parseIcsDate(icsDate) {
  try {
    if (!icsDate) return { date: new Date().toISOString().split("T")[0] };

    if (icsDate.includes(";")) {
      icsDate = icsDate.split(":").pop();
    }

    const year = parseInt(icsDate.substring(0, 4));
    const month = parseInt(icsDate.substring(4, 6)) - 1; // JS months are 0-indexed
    const day = parseInt(icsDate.substring(6, 8));
    const hour = parseInt(icsDate.substring(9, 11) || "0");
    const minute = parseInt(icsDate.substring(11, 13) || "0");

    // Convert to ISO format string for SQLite compatibility
    const date = new Date(year, month, day, hour, minute);

    // Return ISO date string for SQLite compatibility
    return {
      date: date.toISOString().split("T")[0],
    };
  } catch (err) {
    console.error("Error parsing date:", err);
    return { date: new Date().toISOString().split("T")[0] };
  }
}

function parseIcsTime(icsDate) {
  try {
    if (!icsDate) return null;

    // Handle dates with timezone identifiers
    if (icsDate.includes(";")) {
      icsDate = icsDate.split(":").pop();
    }

    // Extract hours and minutes
    const hour = parseInt(icsDate.substring(9, 11) || "0");
    const minute = parseInt(icsDate.substring(11, 13) || "0");

    // Format as HH:MM
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  } catch (err) {
    console.error("Error parsing time:", err);
    return null;
  }
}

function parseLocation(location = "") {
  try {
    // Clean up escaped characters
    return location.replace(/\\,/g, ",").replace(/\\n/g, " ").trim();
  } catch (err) {
    console.error("Error parsing location:", err);
    return location;
  }
}
