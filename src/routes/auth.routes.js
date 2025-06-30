import { Router } from "express";   
import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/', authController.login); // POST /api/auth/login
export default router;


