import { aiBridgeService } from '../services/aiBridgeService.js';
import { Problem } from '../models/Problem.js';

export const aiController = {
  async analyze(req, res) {
    try {
      const { title, description, category, image, latitude, longitude, district } = req.body;
      const existingProblems = await Problem.find({}).limit(50).lean();
      
      const analysis = await aiBridgeService.analyzeProblem({
        title,
        description,
        category,
        image,
        latitude,
        longitude,
        district,
        existingProblems
      });

      return res.json({ success: true, data: analysis });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async duplicateCheck(req, res) {
    try {
      const { title, description, latitude, longitude, image } = req.body;
      const existingProblems = await Problem.find({}).limit(50).lean();

      const analysis = await aiBridgeService.analyzeProblem({
        title,
        description,
        latitude,
        longitude,
        image,
        existingProblems
      });

      return res.json({
        success: true,
        data: {
          duplicateProbability: analysis.duplicateProbability,
          isPossibleDuplicate: analysis.isPossibleDuplicate,
          highestSimilarity: analysis.highestSimilarity,
          topMatch: analysis.topMatch,
          similarProblems: analysis.similarProblems
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async analyzeProblemById(req, res) {
    try {
      const { problemId } = req.params;
      const problem = await Problem.findOne({ id: problemId });
      if (!problem) {
        return res.status(404).json({ success: false, error: 'Challenge not found' });
      }

      const existingProblems = await Problem.find({ id: { $ne: problemId } }).limit(50).lean();
      const analysis = await aiBridgeService.analyzeProblem({
        title: problem.title,
        description: problem.description,
        category: problem.category,
        image: problem.image,
        latitude: problem.latitude,
        longitude: problem.longitude,
        district: problem.district,
        existingProblems
      });

      problem.aiAnalysis = analysis;
      if (analysis.category) problem.category = analysis.category;
      if (analysis.recommendedDepartment) problem.department = analysis.recommendedDepartment;
      await problem.save();

      return res.json({ success: true, data: { problem, analysis } });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

export default aiController;
