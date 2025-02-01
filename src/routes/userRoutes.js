// routes/users.js
import express from 'express';
import { getUserDetails,getDevelopers,createUser } from '../controllers/userController.js';
const router = express.Router();

router.get('/about', getDevelopers);
router.get('/:id', getUserDetails);
router.post('/adduser', createUser);

export default router;