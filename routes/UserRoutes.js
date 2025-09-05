const express = require("express");
const User = require("../models/User");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  userSchema,
  updateUserSchema,
} = require("../validations/userValidation");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) res.status(200).json(user);
    else res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { err, val } = userSchema.validate(req.body);
    console.log("Validation result:", val);

    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const user = await User.create({
      ...val,
      createdBy: req.user.id,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { err, val } = updateUserSchema.validate(req.body);

    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const [updated] = await User.update(
      { ...val, modifiedBy: req.user.id },
      { where: { id: req.params.id } }
    );

    if (!updated) return res.status(404).json({ error: "User not found" });

    const updatedUser = await User.findByPk(req.params.id);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
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
