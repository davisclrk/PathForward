import express from 'express';
import { createUser } from '../controller.js';

const router = express.Router();

router.get('/health', (req, res) => {
    res.json({"status": "UP"});
});

router.post('/createUser', createUser);

export default router;