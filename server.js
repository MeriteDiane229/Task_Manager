const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Route de base
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur l'API Gestion des tâches" });
  });

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.listen(process.env.PORT, () => console.log(`Serveur lancé sur le port ${process.env.PORT}`));