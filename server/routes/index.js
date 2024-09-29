import express from 'express';
import { createUser, createLinkToken, logIn, createAccessToken, getTransactions, categorizeTransactions, addBudget, getBudget, addGoal, getGoals, deleteGoal } from '../controller.js';

const router = express.Router();

router.get('/health', (req, res) => {
    res.json({"status": "UP"});
});

router.post('/login', logIn);
router.post('/createUser', createUser);
router.post('/createLinkToken', createLinkToken); 
router.post('/createAccessToken', createAccessToken);
router.post('/getTransactions', getTransactions);
router.post('/categorizeTransactions', categorizeTransactions);
router.post('/addBudget', addBudget);
router.post('/getBudget', getBudget);
router.post('/addGoal', addGoal);
router.post('/getGoals', getGoals);
router.post('/deleteGoal', deleteGoal);


export default router;