import express from 'express';
import { universityController } from '../controllers/universityController.js';

const router = express.Router();

router.get('/', universityController.getUniversities);
router.get('/profile', universityController.getProfile);
router.get('/metrics', universityController.getMetrics);
router.get('/recommended-challenges', universityController.getRecommendedChallenges);
router.get('/recommendations', universityController.getRecommendedChallenges);
router.get('/my-challenges', universityController.getMyChallenges);
router.post('/accept/:problemId', universityController.acceptChallenge);
router.post('/assign-team/:problemId', universityController.assignTeam);
router.post('/submit-solution/:problemId', universityController.submitSolution);

export default router;
