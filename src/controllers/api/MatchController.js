import Match from "../../models/Match.js";
import Team from "../../models/Team.js";

export const show = async (req, res, next) => {
  const id = req.params.id;
  try {
    const match = await Match.query().findById(id).withGraphFetched("team");

    if (!match) {
      return res.status(404).json({ message: "Wedstrijd niet gevonden." });
    }

    return res.json(match);
  } catch (error) {
    return res.status(500).json({
      message: "Er is een fout opgetreden bij het ophalen van de wedstrijd.",
      error: error.message,
    });
  }
};

export const index = async (req, res, next) => {
  try {
    const matches = await Match.query().withGraphFetched("team");
    return res.json(matches);
  } catch (error) {
    return res.status(500).json({
      message: "Er is een fout opgetreden bij het ophalen van de wedstrijden.",
      error: error.message,
    });
  }
};

export const update = async (req, res, next) => {
  const id = req.params.id;
  const { date, start_time, end_time, location, home_away, team_id } = req.body;

  try {
    const matchExists = await Match.query().findById(id);
    if (!matchExists) {
      return res.status(404).json({ message: "Wedstrijd niet gevonden." });
    }

    // Valideer team_id als deze is opgegeven
    if (team_id !== null && team_id !== undefined && team_id !== "") {
      const teamExists = await Team.query().findById(team_id);
      if (!teamExists) {
        return res.status(400).json({ message: "Team niet gevonden." });
      }
    }

    // Maak een schone kopie van de data
    const matchData = {
      location,
      home_away,
      start_time,
      end_time,
    };

    // Alleen date toevoegen als het een geldige waarde is
    if (date) {
      try {
        // Controleer of de datum in een geldig formaat is
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
          // YYYY-MM-DD formaat voor database
          matchData.date = parsedDate.toISOString().split("T")[0];
        } else {
          return res.status(400).json({ message: "Ongeldige datum" });
        }
      } catch (e) {
        return res.status(400).json({ message: "Ongeldige datum" });
      }
    }

    // Verwerk team_id
    matchData.team_id =
      team_id === "" || team_id === undefined ? null : team_id;

    const updatedMatch = await Match.query().patchAndFetchById(id, matchData);
    return res.json(updatedMatch);
  } catch (error) {
    return res.status(400).json({
      message: "Bijwerken van wedstrijd mislukt",
      error: error.message,
    });
  }
};

export const destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    const match = await Match.query().findById(id);

    if (!match) {
      return res.status(404).json({ message: "Wedstrijd niet gevonden." });
    }

    await Match.query().deleteById(id);
    return res.status(200).json({ message: "Wedstrijd succesvol verwijderd." });
  } catch (error) {
    return res.status(500).json({
      message:
        "Er is een fout opgetreden bij het verwijderen van de wedstrijd.",
      error: error.message,
    });
  }
};

export const store = async (req, res, next) => {
  const { date, start_time, end_time, location, home_away, team_id } = req.body;

  try {
    // Valideer team_id als deze is opgegeven
    if (team_id) {
      const teamExists = await Team.query().findById(team_id);
      if (!teamExists) {
        return res.status(400).json({ message: "Team niet gevonden." });
      }
    }

    const newMatch = await Match.query().insert({
      date,
      start_time,
      end_time,
      location,
      home_away,
      team_id,
    });

    return res.status(201).json(newMatch);
  } catch (error) {
    return res.status(400).json({
      message: "Er is een fout opgetreden bij het aanmaken van de wedstrijd.",
      error: error.message,
    });
  }
};
