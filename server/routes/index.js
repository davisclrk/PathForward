import express from 'express';
import { createUser, createLinkToken, getInfo } from '../controller.js';

const router = express.Router();

router.get('/health', (req, res) => {
    res.json({"status": "UP"});
});

router.post('/createUser', createUser);
router.post('/createLinkToken', createLinkToken); 
// router.post('/getInfo', getInfo);


export default router;