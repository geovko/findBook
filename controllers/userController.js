// need to check once more

const { User } = require("../models");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();

      const userObj = {
        users,
      };

      res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single user by id along with thought and friend data
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({
        _id: req.params.userId,
      }).select("-__v");

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json({
        user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update a user by id
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No such user exists" });
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Delete a user by id and remove them from any friends arrays
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({
        _id: req.params.userId,
      });

      if (!user) {
        return res.status(404).json({ message: "No such user exists" });
      }

      const friend = await User.findOneAndUpdate(
        { friends: req.params.friendId },
        { $pull: { users: req.params.userId } },
        { new: true }
      );

      if (!friend) {
        return res.status(404).json({
          message: "User deleted, but no friends found",
        });
      }

      res.json(friend);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a friend to a user friend list
  async addFriend(req, res) {
    console.log("You're making friends~'");
    console.log(req.body);

    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: "No user found with that ID :(" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove friend from a user
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: { friendId: req.params.friendId } } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: "No user found with that ID :(" });
      }

      res.json(user);
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
