// thula than db ah connect pannanum.
// config/db.js

import { Sequelize } from "sequelize"; // sequelize na orm package , like mongoose package to connect db need sequlize.
import dotenv from "dotenv";

dotenv.config();


// new Sequelize() : Database connection create pannala , Database-oda details-ah memory-la ready pannudhu,
// Just “connection configuration object” create pannudhu
// Real-life example:
// Phone number save pannradhu maari , Call pannala → just number save pannirukkom
// call pannanum na server la pannanum.

const sequelize = new Sequelize( // new Sequelize(...) → creates a connection object (like mongoose.connect).
  process.env.DB_NAME, // Inside it we pass: DB name, user, password, and options.
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres", // dialect: "postgres" → tells Sequelize which database type.
    logging: true, // prod-la false, dev-la true
  }
);


// new Sequelize()            → Connection details ready
// sequelize.authenticate()   → Real DB connection check
// sequelize.sync()           → Tables create / sync


// db connection ingave panniyachu , server la call panna pothum..
export const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Real DB connection check , Safe-aa server start
    console.log("PostgreSQL connected ✅");
  } catch (error) {
    console.error("DB connection failed ❌", error);
    process.exit(1);
  }
};

// db ku thevayanathallam , ingave panniyachu..
export default sequelize;
