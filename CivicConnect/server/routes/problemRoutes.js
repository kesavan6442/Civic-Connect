import express from 'express';
import { citizenController } from '../controllers/citizenController.js';
import { universityController } from '../controllers/universityController.js';
import { upload } from '../middleware/upload.js';
import { authMiddleware } from '../middleware/auth.js';
import { Problem } from '../models/Problem.js';
import { universityMatchingService } from '../services/universityMatchingService.js';

const router = express.Router();

// Apply auth context
router.use(authMiddleware);

// POST /api/problems - Create challenge
router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]),
  citizenController.submitProblem
);

// GET /api/problems - List challenges
router.get('/', citizenController.getPublicChallenges);

// GET /api/problems/:id - Get challenge details
router.get('/:id', citizenController.getProblemById);

// GET /api/problems/:id/matches - Get matched universities
router.get('/:id/matches', async (req, res) => {
  try {
    const problem = await Problem.findOne({ id: req.params.id }).lean();
    if (!problem) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }
    const matches = await universityMatchingService.matchUniversitiesForProblem({
      title: problem.title,
      description: problem.description,
      category: problem.category,
      district: problem.district || 'Ranchi',
      latitude: problem.latitude,
      longitude: problem.longitude
    });
    return res.json({ success: true, count: matches.length, data: matches });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/problems/:id/accept - University accepts challenge
router.post('/:id/accept', (req, res, next) => {
  req.params.problemId = req.params.id;
  universityController.acceptChallenge(req, res, next);
});

// POST /api/problems/:id/upvote - Citizen upvotes challenge
router.post('/:id/upvote', citizenController.upvoteProblem);

export default router;
