import Attendance from "../../models/Attendance.js";
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

    // Check if attendance record already exists
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

    // Create new attendance record
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

    // If this is the /api/attendance/update endpoint
    if (!id && (matchId || match_id) && (userId || user_id)) {
      const matchIdToUse = matchId || match_id;
      const userIdToUse = userId || user_id;
      const statusToUse = status || "unknown";

      // Check if the match exists
      const match = await Match.query().findById(matchIdToUse);
      if (!match) {
        return res.status(404).json({
          success: false,
          message: "Match not found",
        });
      }

      // Check if the user exists
      const user = await User.query().findById(userIdToUse);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if attendance record already exists
      let attendanceRecord = await Attendance.query()
        .where("match_id", matchIdToUse)
        .where("user_id", userIdToUse)
        .first();

      let message;

      if (attendanceRecord) {
        // Update existing record
        attendanceRecord = await Attendance.query().updateAndFetchById(
          attendanceRecord.id,
          {
            match_id: matchIdToUse,
            user_id: userIdToUse,
            status: statusToUse,
          }
        );
        message = "Attendance status updated";
      } else {
        // Create new record
        attendanceRecord = await Attendance.query().insert({
          match_id: matchIdToUse,
          user_id: userIdToUse,
          status: statusToUse,
        });
        message = "Attendance status created";
      }

      return res.status(200).json({
        success: true,
        message: message,
        data: attendanceRecord,
      });
    }
    // Regular update endpoint using ID
    else if (id) {
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

    // If userId is provided, filter by user
    if (userId) {
      query = query.where("user_id", userId);
    }

    // Get attendance records
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

// Alias for the route
export const updateAttendance = update;
