import express from 'express';
import { createUser, createLinkToken, logIn, createAccessToken, getInfo } from '../controller.js';

const router = express.Router();

router.get('/health', (req, res) => {
    res.json({"status": "UP"});
});


router.post('/logIn', logIn);
router.post('/createUser', createUser);
router.post('/createLinkToken', createLinkToken); 
router.post('/createAccessToken', createAccessToken);

// router.post('/getInfo', getInfo);


export default router;