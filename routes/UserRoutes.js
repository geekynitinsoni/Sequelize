const express = require("express");
const User = require("../models/User");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

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
    const user = await User.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    const [updated] = await User.update(
      { name, email, modifiedBy: req.user.id },
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
