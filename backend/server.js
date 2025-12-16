import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"; 
import thoughtRoutes from "./routes/thoughtRoutes.js";
import sequelize from "./config/db.js";


dotenv.config();

const app = express();

// calling middleware of express and cors
app.use(cors());
app.use(express.json()); // to accept json data .


// sample routes
app.get("/", (req, res) => {
  res.send("Working on BrainBank");
});


// routes
app.use("/api/thoughts", thoughtRoutes)


// backend port
const PORT = process.env.PORT || 5000;

// Connect DB first, then start server (listen)
const startServer = async () => {
  await connectDB();

  //  added: models irundha tables create / update pannum
  // await sequelize.sync({ alter: true });
  // console.log("Tables synced ✅");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
};

startServer();
