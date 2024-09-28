import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const APP_PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({ "Hello": "World", "Version": 2 });
});

mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(APP_PORT, () => {
            console.log(`API listening at http://localhost:${APP_PORT}`)
        });
    })
    .catch(err => {
        console.log("Failed to connect to MongoDB", err);
    });