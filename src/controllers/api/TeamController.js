import Team from "../../models/Team.js";

export const index = async (req, res) => {
  try {
    const teams = await Team.query();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams", error });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Team.query().findById(id);
    if (!team) {
      return res.status(404).json({ message: "team not found" });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team", error });
  }
};

export const store = async (req, res) => {
  const { name } = req.body;
  try {
    const newteam = await Team.query().insert({ name });
    res.json(newteam);
  } catch (error) {
    res.status(500).json({ message: "Error creating team", error });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const team = await Team.query().findById(id);
    if (!team) {
      return res.status(404).json({ message: "team not found" });
    }
    const updatedteam = await Team.query().patchAndFetchById(id, {
      name,
    });
    res.json(updatedteam);
  } catch (error) {
    res.status(500).json({ message: "Error updating team", error });
  }
};

export const destroy = async (req, res) => {
    const { id } = req.params;
    try {
        const team = await Team.query().findById(id);
        if (!team) {
            return res.status(404).json({ message: "team not found" });
        }
        await Team.query().deleteById(id);
        res.json({ message: "team deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting team", error });
    }
}