import express from "express";
import router from "./routes/index.js";
import dotenv from "dotenv";
import { config as dbConfig } from "./config/db.js";
import { config as passportConfig } from "./config/passport.js";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

dbConfig();
passportConfig(app);

const corsOptions = {
  origin: process.env.REACT_BASE_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
