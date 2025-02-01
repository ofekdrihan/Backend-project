// routes/costs.js
import express from 'express';
import { addCost, getReport } from '../controllers/costController.js';
const router = express.Router();

router.post('/add', addCost);
router.get('/report', getReport);

export default router;