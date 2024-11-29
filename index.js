import express from 'express';
import router from './routes/index.js';
import dotenv from 'dotenv';
import {config as dbConfig} from './config/db.js';
import {config as passportConfig} from'./config/passport.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

dbConfig();
passportConfig(app);


app.use(express.json());
// app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use('/api', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

