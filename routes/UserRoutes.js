const express = require("express");
const User = require("../models/User");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  userSchema,
  updateUserSchema,
} = require("../validations/userValidation");
const checkOwner = require("../middleware/checkOwner");
const isAdmin = require("../middleware/isAdmin");
const bcrypt = require("bcrypt");
const updateUserLimiter = require("../middleware/rateLimiter");
const { Op } = require("sequelize");

router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    // if (req.user.isAdmin === false) {
    //   return res
    //     .status(403)
    //     .json({ error: "Access denied: Admins only can view all users" });
    // }
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authMiddleware, checkOwner, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (user) res.status(200).json(user);
    else res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { error, value } = userSchema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     const user = await User.create({
//       ...value,
//       createdBy: req.user.id,
//     });
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.put(
  "/:id",
  authMiddleware,
  checkOwner,
  updateUserLimiter,
  async (req, res) => {
    try {
      const { error, value } = updateUserSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      if (value.password) {
        value.password = await bcrypt.hash(value.password, 10);
      }

      if (value.email) {
        const existingUser = await User.findOne({
          where: { email: value.email, id: { [Op.ne]: req.params.id } },
        });
        if (existingUser) {
          return res.status(400).json({ error: "Email already in use" });
        }
      }

      const [updated] = await User.update(
        { ...value, modifiedBy: req.user.id },
        { where: { id: req.params.id } }
      );

      if (!updated) return res.status(404).json({ error: "User not found" });

      const updatedUser = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password"] },
      });
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.delete("/:id", authMiddleware, checkOwner, async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (deleted) res.json({ message: "User deleted" });
    else res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
