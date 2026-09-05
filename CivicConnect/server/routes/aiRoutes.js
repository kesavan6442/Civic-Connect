import express from 'express';
import { aiController } from '../controllers/aiController.js';

const router = express.Router();

router.post('/analyze', aiController.analyze);
router.post('/analyze/:problemId', aiController.analyzeProblemById);
router.post('/duplicate-check', aiController.duplicateCheck);

export default router;
