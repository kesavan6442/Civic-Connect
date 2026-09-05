import express from 'express';
import { citizenController } from '../controllers/citizenController.js';
import { upload } from '../middleware/upload.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth context
router.use(authMiddleware);

// Submit Problem (handles optional image and document file uploads)
router.post(
  '/submit-problem',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]),
  citizenController.submitProblem
);

// Problem Queries
router.get('/my-problems', citizenController.getMyProblems);
router.get('/public-challenges', citizenController.getPublicChallenges);
router.get('/problem/:id', citizenController.getProblemById);
router.put('/problem/:id', citizenController.updateProblem);
router.delete('/problem/:id', citizenController.withdrawProblem);
router.post('/problem/:id/upvote', citizenController.upvoteProblem);

// Dashboard Statistics
router.get('/dashboard-stats', citizenController.getDashboardStats);

// Profile
router.get('/profile', citizenController.getProfile);
router.put('/profile', citizenController.updateProfile);

export default router;
