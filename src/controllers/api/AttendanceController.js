import Attendance from "../../models/Attendance.js";
import { sendMail } from "../../utils/mailer.js";
import User from "../../models/User.js";
import Match from "../../models/Match.js";

export const show = async (req, res) => {
  try {
    const id = req.params.id;
    const attendance = await Attendance.query().findById(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    return res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Error retrieving attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance record",
      error: error.message,
    });
  }
};

export const index = async (req, res) => {
  try {
    const attendances = await Attendance.query();
    return res.json({
      success: true,
      data: attendances,
    });
  } catch (error) {
    console.error("Error retrieving attendances:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance records",
      error: error.message,
    });
  }
};

export const store = async (req, res) => {
  try {
    const { match_id, user_id, status } = req.body;

    if (!match_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const existingRecord = await Attendance.query()
      .where("match_id", match_id)
      .where("user_id", user_id)
      .first();

    if (existingRecord) {
      return res.status(409).json({
        success: false,
        message: "Attendance record already exists for this match and user",
      });
    }

    const attendanceRecord = await Attendance.query().insert({
      match_id,
      user_id,
      status: status || "unknown",
    });

    return res.status(201).json({
      success: true,
      message: "Attendance record created successfully",
      data: attendanceRecord,
    });
  } catch (error) {
    console.error("Error creating attendance record:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create attendance record",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { matchId, userId, status, match_id, user_id } = req.body;

    if (!id && (matchId || match_id) && (userId || user_id)) {
      const matchIdToUse = matchId || match_id;
      const userIdToUse = userId || user_id;
      const statusToUse = status || "unknown";

      const match = await Match.query()
        .findById(matchIdToUse)
        .withGraphFetched("team");
      if (!match) {
        return res.status(404).json({
          success: false,
          message: "Match not found",
        });
      }

      const user = await User.query().findById(userIdToUse);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      let attendanceRecord = await Attendance.query()
        .where("match_id", matchIdToUse)
        .where("user_id", userIdToUse)
        .first();

      let message;
      let wasNewOrUpdatedToAvailable = false;

      if (attendanceRecord) {
        const oldStatus = attendanceRecord.status;
        attendanceRecord = await Attendance.query().updateAndFetchById(
          attendanceRecord.id,
          {
            match_id: matchIdToUse,
            user_id: userIdToUse,
            status: statusToUse,
          }
        );
        message = "Attendance status updated";

        // Check if status changed to 'available'
        wasNewOrUpdatedToAvailable =
          oldStatus !== "available" && statusToUse === "available";
      } else {
        attendanceRecord = await Attendance.query().insert({
          match_id: matchIdToUse,
          user_id: userIdToUse,
          status: statusToUse,
        });
        message = "Attendance status created";

        // Check if new record with 'available' status
        wasNewOrUpdatedToAvailable = statusToUse === "available";
      }

      // Send email when user marks themselves as available
      if (
        wasNewOrUpdatedToAvailable &&
        user.email &&
        user.receive_notifications
      ) {
        console.log(
          `Sending attendance confirmation email to ${user.email} for match ${matchIdToUse}`
        );
        await sendAttendanceConfirmationEmail(user, match);
      }

      return res.status(200).json({
        success: true,
        message: message,
        data: attendanceRecord,
      });
    } else if (id) {
      const attendance = await Attendance.query().findById(id);

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: "Attendance record not found",
        });
      }

      const updatedAttendance = await Attendance.query().updateAndFetchById(
        id,
        {
          match_id: match_id !== undefined ? match_id : attendance.match_id,
          user_id: user_id !== undefined ? user_id : attendance.user_id,
          status: status || attendance.status,
        }
      );

      return res.json({
        success: true,
        message: "Attendance record updated successfully",
        data: updatedAttendance,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update attendance record",
      error: error.message,
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const id = req.params.id;
    const attendance = await Attendance.query().findById(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    await Attendance.query().deleteById(id);

    return res.json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete attendance record",
      error: error.message,
    });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { matchId, userId } = req.params;

    if (!matchId) {
      return res.status(400).json({
        success: false,
        message: "Match ID is required",
      });
    }

    let query = Attendance.query().where("match_id", matchId);

    if (userId) {
      query = query.where("user_id", userId);
    }

    const attendanceRecords = await query.withGraphFetched("[user, match]");

    return res.status(200).json({
      success: true,
      data: attendanceRecords,
    });
  } catch (error) {
    console.error("Error getting attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get attendance records",
      error: error.message,
    });
  }
};

export const updateAttendance = update;

export const updateSelection = async (req, res) => {
  try {
    const { match_id, user_id, is_selected } = req.body;

    console.log("=== SELECTION UPDATE REQUEST ===");
    console.log("Request body:", { match_id, user_id, is_selected });
    console.log("Admin user:", {
      id: req.user?.id,
      role_id: req.user?.role_id,
    });

    if (!match_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: match_id and user_id",
      });
    }

    if (req.user && req.user.role_id !== 1) {
      console.log("User is not admin, denying access");
      return res.status(403).json({
        success: false,
        message: "You don't have permission to select players",
      });
    }

    const match = await Match.query()
      .findById(match_id)
      .withGraphFetched("team");
    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    const user = await User.query().findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let attendanceRecord = await Attendance.query()
      .where("match_id", match_id)
      .where("user_id", user_id)
      .first();

    let message;

    if (attendanceRecord) {
      console.log("Updating existing attendance record:", attendanceRecord.id);

      
      const newStatus =
        is_selected === "selected"
          ? "available"
          : attendanceRecord.status || "unknown";

      attendanceRecord = await Attendance.query().updateAndFetchById(
        attendanceRecord.id,
        {
          match_id,
          user_id,
          is_selected,
          status: newStatus,
        }
      );
      message =
        is_selected === "selected"
          ? "Player selected and marked available"
          : "Player deselected";
    } else {
      console.log("Creating new attendance record");

      const newStatus = is_selected === "selected" ? "available" : "unknown";

      attendanceRecord = await Attendance.query().insert({
        match_id,
        user_id,
        status: newStatus,
        is_selected,
      });
      message =
        is_selected === "selected"
          ? "Player selected and marked available"
          : "Player deselected";
    }

    console.log("Selection update completed:", {
      id: attendanceRecord.id,
      match_id: attendanceRecord.match_id,
      user_id: attendanceRecord.user_id,
      is_selected: attendanceRecord.is_selected,
      status: attendanceRecord.status,
    });

    if (
      is_selected === "selected" &&
      user.email &&
      user.receive_notifications
    ) {
      await sendSelectionEmail(user, match);
    }

    console.log("=== SELECTION UPDATE COMPLETE ===");

    return res.status(200).json({
      success: true,
      message: message,
      data: attendanceRecord,
    });
  } catch (error) {
    console.error("Error updating player selection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update player selection",
      error: error.message,
    });
  }
};

async function sendSelectionEmail(user, match) {
  try {
    if (!user || !user.email || !match) {
      return;
    }

    const matchDate = new Date(match.date);

    const emailData = {
      user: user,
      match: match,
      matchDate: matchDate,
      teamName: match.team ? match.team.name : "het team",
      data: {
        user: user,
        match: match,
        matchDate: matchDate,
        teamName: match.team ? match.team.name : "het team",
      },
    };

    await sendMail(
      user.email,
      "Je bent geselecteerd! | Ping Pong Tool",
      "selectionMail.ejs",
      emailData
    );
  } catch (error) {
    console.error("Error sending selection email:", error);
  }
}

async function sendAttendanceConfirmationEmail(user, match) {
  try {
    if (!user || !user.email || !match) {
      return;
    }

    const matchDate = new Date(match.date);

    const emailData = {
      user: user,
      match: match,
      matchDate: matchDate,
      teamName: match.team ? match.team.name : "het team",
      data: {
        user: user,
        match: match,
        matchDate: matchDate,
        teamName: match.team ? match.team.name : "het team",
      },
    };

    await sendMail(
      user.email,
      "Aanmelding bevestigd | Ping Pong Tool",
      "selectionMail.ejs",
      emailData
    );
  } catch (error) {
    console.error("Error sending attendance confirmation email:", error);
  }
}

export const searchUsersInMatch = async (req, res) => {
  try {
    const { matchId, searchTerm } = req.params;

    if (!matchId) {
      return res.status(400).json({
        success: false,
        message: "Match ID is required",
      });
    }

    const match = await Match.query().findById(matchId).select("team_id");

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    if (searchTerm === "undefined" || !searchTerm.trim()) {
      const usersWithAttendance = await User.query()
        .leftJoinRelated("attendance")
        .where("attendance.match_id", matchId)
        .orWhere("attendance.match_id", null)
        .withGraphFetched("attendance(filterByMatch)")
        .modifiers({
          filterByMatch(builder) {
            builder.where("match_id", matchId);
          },
        });

      return res.json({
        success: true,
        data: usersWithAttendance,
      });
    }

    const users = await User.query()
      .distinct("users.id")
      .select("users.*")
      .leftJoinRelated("attendance")
      .where((builder) => {
        if (searchTerm && searchTerm !== "undefined") {
          builder
            .where("users.firstname", "like", `%${searchTerm}%`)
            .orWhere("users.lastname", "like", `%${searchTerm}%`)
            .orWhereRaw("LOWER(users.firstname || users.lastname) LIKE ?", [
              `%${searchTerm.toLowerCase()}%`,
            ])
            .orWhereRaw(
              "LOWER(users.firstname || ' ' || users.lastname) LIKE ?",
              [`%${searchTerm.toLowerCase()}%`]
            );
        }
      })
      .withGraphFetched("attendance(filterByMatch)")
      .modifiers({
        filterByMatch(builder) {
          builder.where("match_id", matchId);
        },
      });

    return res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error searching users in match:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search users in match",
      error: error.message,
    });
  }
};
