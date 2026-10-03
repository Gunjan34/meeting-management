const pool = require("../config/db");
// GET all meetings
const getMeetings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        meetings.id,
        meetings.title,
        meetings.description,
        meetings.meeting_date,
        meetings.start_time,
        meetings.end_time,
        meetings.location,
        meetings.created_by,
        users.name AS created_by_name,
        meetings.created_at
      FROM meetings
      LEFT JOIN users
        ON meetings.created_by = users.id
      ORDER BY meetings.meeting_date ASC, meetings.start_time ASC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
  console.error("Error fetching meetings:", error);

  res.status(500).json({
    success: false,
    message: "Failed to fetch meetings",
    error: error.message,
  });
}
};


// GET single meeting by ID
const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        meetings.id,
        meetings.title,
        meetings.description,
        meetings.meeting_date,
        meetings.start_time,
        meetings.end_time,
        meetings.location,
        meetings.created_by,
        users.name AS created_by_name,
        meetings.created_at
      FROM meetings
      LEFT JOIN users
        ON meetings.created_by = users.id
      WHERE meetings.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching meeting:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch meeting",
    });
  }
};


// CREATE meeting
// const createMeeting = async (req, res) => {
//   try {
//     // const {
//     //   title,
//     //   description,
//     //   meeting_date,
//     //   start_time,
//     //   end_time,
//     //   location,
//     //   created_by,
//     // } = req.body;
//     const {
//   title,
//   description,
//   meeting_date,
//   start_time,
//   end_time,
//   location,
// } = req.body;

//     // Basic validation
//     if (!title || !meeting_date || !start_time || !end_time) {
//       return res.status(400).json({
//         success: false,
//         message: "Title, date, start time and end time are required",
//       });
//     }

//     const result = await pool.query(
//       `
//       INSERT INTO meetings
//       (
//         title,
//         description,
//         meeting_date,
//         start_time,
//         end_time,
//         location,
//         created_by
//       )
//       VALUES ($1, $2, $3, $4, $5, $6, $7)
//       RETURNING *
//       `,
//       [
//         title,
//         description || null,
//         meeting_date,
//         start_time,
//         end_time,
//         location || null,
//         // created_by || null,
//       ]
//     );

//     res.status(201).json({
//       success: true,
//       message: "Meeting created successfully",
//       data: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Error creating meeting:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to create meeting",
//     });
//   }
// };

const createMeeting = async (req, res) => {
  try {
    const {
      title,
      description,
      meeting_date,
      start_time,
      end_time,
      location,
    } = req.body;

    // Validation
    if (!title || !meeting_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "Title, date, start time and end time are required",
      });
    }

    // Get logged-in user's ID from JWT
    const created_by = req.user.id;

    const result = await pool.query(
      `
      INSERT INTO meetings
      (
        title,
        description,
        meeting_date,
        start_time,
        end_time,
        location,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        title,          // $1
        description || null, // $2
        meeting_date,   // $3
        start_time,     // $4
        end_time,       // $5
        location || null, // $6
        created_by      // $7
      ]
    );

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error creating meeting:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create meeting",
      error: error.message,
    });
  }
};

// UPDATE meeting
const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      meeting_date,
      start_time,
      end_time,
      location,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE meetings
      SET
        title = $1,
        description = $2,
        meeting_date = $3,
        start_time = $4,
        end_time = $5,
        location = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        title,
        description || null,
        meeting_date,
        start_time,
        end_time,
        location || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating meeting:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update meeting",
    });
  }
};


// DELETE meeting
const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM meetings
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting meeting:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete meeting",
    });
  }
};


module.exports = {
  getMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};