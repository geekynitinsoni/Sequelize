const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
require("dotenv").config();
const db = require("./db");
const userRoutes = require("./routes/UserRoutes");
const authRoutes = require("./routes/AuthRoutes");

app.use(express.json());

// database msg
async function DBconnection() {
  try {
    await db.authenticate();
    console.log("DB connection successful");
  } catch (err) {
    console.error("DB connection failed:", err);
    return;
  }
}

DBconnection();

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);

db.sync().then(() => {
  console.log("✅ Database synced");
  app.listen(port, () =>
    console.log(`App running on http://localhost:${port}`)
  );
});
