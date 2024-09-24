// didn't get to

const { ObjectId } = require("mongoose").Types;
const { Student, Course } = require("../models");

// Aggregate function to get the number of students overall
const headCount = async () => {
  const numberOfStudents = await Student.aggregate().count("studentCount");
  return numberOfStudents;
};

// Aggregate function for getting the overall grade using $avg
const grade = async (studentId) =>
  Student.aggregate([
    // only include the given student by using $match
    { $match: { _id: new ObjectId(studentId) } },
    {
      $unwind: "$assignments",
    },
    {
      $group: {
        _id: new ObjectId(studentId),
        overallGrade: { $avg: "$assignments.score" },
      },
    },
  ]);

module.exports = {
  // Get all students
  async getStudents(req, res) {
    try {
      const students = await Student.find();

      const studentObj = {
        students,
        headCount: await headCount(),
      };

      res.json(studentObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single student
  async getSingleStudent(req, res) {
    try {
      const student = await Student.findOne({
        _id: req.params.studentId,
      }).select("-__v");

      if (!student) {
        return res.status(404).json({ message: "No student with that ID" });
      }

      res.json({
        student,
        grade: await grade(req.params.studentId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new student
  async createStudent(req, res) {
    try {
      const student = await Student.create(req.body);
      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a student and remove them from the course
  async deleteStudent(req, res) {
    try {
      const student = await Student.findOneAndRemove({
        _id: req.params.studentId,
      });

      if (!student) {
        return res.status(404).json({ message: "No such student exists" });
      }

      const course = await Course.findOneAndUpdate(
        { students: req.params.studentId },
        { $pull: { students: req.params.studentId } },
        { new: true }
      );

      if (!course) {
        return res.status(404).json({
          message: "Student deleted, but no courses found",
        });
      }

      res.json({ message: "Student successfully deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add an assignment to a student
  async addAssignment(req, res) {
    console.log("You are adding an assignment");
    console.log(req.body);

    try {
      const student = await Student.findOneAndUpdate(
        { _id: req.params.studentId },
        { $addToSet: { assignments: req.body } },
        { runValidators: true, new: true }
      );

      if (!student) {
        return res
          .status(404)
          .json({ message: "No student found with that ID :(" });
      }

      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove assignment from a student
  async removeAssignment(req, res) {
    try {
      const student = await Student.findOneAndUpdate(
        { _id: req.params.studentId },
        { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
        { runValidators: true, new: true }
      );

      if (!student) {
        return res
          .status(404)
          .json({ message: "No student found with that ID :(" });
      }

      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");

//

// // GET all users
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET a single user by Id
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       res.status(400).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500), json({ message: err.message });
//   }
// });

// // POST a new user
// router.post("/", async (req, res) => {
//   const { username, email } = req.body;

//   const newUser = new User({
//     username,
//     email,
//   });

//   try {
//     const savedUser = await newUser.save();
//     res.status(200).json(savedUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // PUT update a user by id
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedUser) {
//       es.status(400).json({ message: "User not found" });
//       res.json(updatedUser);
//     }
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // DELETE user by Id
// router.delete("/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       res.status(400).json({ message: "User not found" });
//     }
//     res.json({ message: "Item deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST a new friend to a user's friend list
// router.post("/userId/friends/:friendId", async (req, res) => {
//   const { username, email } = req.body;

//   const newUser = new User({
//     username,
//     email,
//   });

//   try {
//     const savedUser = await newUser.save();
//     res.status(200).json(savedUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // DELETE a friend from a user's friend list
// router.delete("/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       res.status(400).json({ message: "User not found" });
//     }
//     res.json({ message: "Item deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
