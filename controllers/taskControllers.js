const Task = require("../models/task");
const jwt = require("jsonwebtoken");

const getallTask = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    let query = {};

    // Check if the user is an admin
    if (decodedToken.role === "admin") {
      // Return tasks of all users
      query = {};
    } else {
      // Return tasks of specific user
      query = { creator_id: userId };
    }

    // Apply status filter if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Sort tasks in reverse order of creation date
    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
      error: err.message,
    });
  }
};

module.exports = {
  getallTask,
};
