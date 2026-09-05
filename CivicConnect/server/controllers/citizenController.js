import { Problem } from '../models/Problem.js';
import { AIAnalysis } from '../models/AIAnalysis.js';
import { User } from '../models/User.js';
import { aiBridgeService } from '../services/aiBridgeService.js';
import { universityMatchingService } from '../services/universityMatchingService.js';
import { notificationService } from '../services/notificationService.js';

export const citizenController = {
  /**
   * Submit a New Civic Challenge (Full Multi-Modal Workflow)
   */
  async submitProblem(req, res) {
    try {
      const {
        title,
        description,
        category,
        location,
        locationName,
        district = 'Ranchi',
        ward = 'Ward 12',
        latitude,
        longitude,
        additionalDetails,
        impactedCount = 50,
        urgency = 'medium'
      } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: 'Title and description are required fields.'
        });
      }

      const locName = locationName || location || 'Ranchi Municipal Area';
      const lat = latitude ? parseFloat(latitude) : 23.3441;
      const lon = longitude ? parseFloat(longitude) : 85.3096;

      // Generate Official Submission ID
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const problemId = `CC-2026-${randomNum}`;

      // Handle Uploaded File
      let imageUrl = req.body.image || null;
      let imageName = req.body.imageName || null;
      let imageSize = req.body.imageSize || null;
      let documentName = req.body.documentName || null;
      let documentUrl = req.body.documentUrl || null;

      if (req.files) {
        if (req.files.image && req.files.image[0]) {
          imageUrl = `/uploads/${req.files.image[0].filename}`;
          imageName = req.files.image[0].originalname;
          imageSize = `${(req.files.image[0].size / (1024 * 1024)).toFixed(1)} MB`;
        }
        if (req.files.document && req.files.document[0]) {
          documentUrl = `/uploads/${req.files.document[0].filename}`;
          documentName = req.files.document[0].originalname;
        }
      }

      // 1. Fetch existing problems for AI duplicate comparison
      const existingProblems = await Problem.find({}).limit(50).lean();

      // 2. Multi-Modal AI Analysis (Python AI Service)
      const aiResults = await aiBridgeService.analyzeProblem({
        title,
        description,
        category,
        image: imageUrl,
        latitude: lat,
        longitude: lon,
        district,
        existingProblems
      });

      // 3. Save AI Analysis in MongoDB
      const aiDoc = await AIAnalysis.create({
        problemId,
        category: aiResults.category || category || 'Roads & Infrastructure',
        suggestedCategory: aiResults.suggestedCategory,
        categoryConfidence: aiResults.categoryConfidence || 94.0,
        severity: aiResults.severity || 'MEDIUM',
        priority: aiResults.priority || 'HIGH',
        priorityScore: aiResults.priorityScore || 75.0,
        priorityConfidence: aiResults.priorityConfidence || 90.0,
        priorityReasoning: aiResults.priorityReasoning,
        imageConfidence: aiResults.imageConfidence || 0.0,
        hasVisualEvidence: aiResults.hasVisualEvidence || !!imageUrl,
        textConfidence: aiResults.textConfidence || 92.0,
        duplicateProbability: aiResults.duplicateProbability || 0,
        isPossibleDuplicate: aiResults.isPossibleDuplicate || false,
        highestSimilarity: aiResults.highestSimilarity || 0,
        topMatch: aiResults.topMatch || null,
        similarProblems: aiResults.similarProblems || [],
        recommendedDepartment: aiResults.recommendedDepartment,
        recommendedAction: aiResults.recommendedAction
      });

      // 4. Match Universities
      const matchedUniversities = await universityMatchingService.matchUniversitiesForProblem({
        category: aiResults.category,
        district,
        latitude: lat,
        longitude: lon
      });

      // 5. Initial 5-Stage Timeline
      const initialTimeline = [
        {
          stage: 'Submitted',
          title: 'Challenge Registered by Resident',
          date: 'Just now',
          completed: true,
          note: `Acknowledgement token generated: ${problemId}. Transmitted to Central Grievance Monitoring System.`
        },
        {
          stage: 'Under Review',
          title: 'Automated AI Pre-Screening & Triage',
          date: 'Processed',
          completed: true,
          note: `Categorized: ${aiResults.category}. Priority: ${aiResults.priority}. Duplicate probability: ${aiResults.duplicateProbability}%.`
        },
        {
          stage: 'Assigned',
          title: 'Departmental Assignment',
          date: 'Pending',
          completed: false,
          note: `Scheduled for routing to ${aiResults.recommendedDepartment}.`
        },
        {
          stage: 'In Progress',
          title: 'Field Action & Execution',
          date: 'Pending',
          completed: false,
          note: 'Work order deployment upon departmental triage.'
        },
        {
          stage: 'Resolved',
          title: 'Final Quality Verification',
          date: 'Pending',
          completed: false,
          note: 'Citizen inspection and sign-off.'
        }
      ];

      // 6. Save Problem in MongoDB with GeoJSON 2dsphere location
      const newProblem = await Problem.create({
        id: problemId,
        citizenId: req.user?.id || 'CIT-JH-88392',
        title: title.trim(),
        description: description.trim(),
        category: aiResults.category || category || 'Roads & Infrastructure',
        locationName: locName,
        location: {
          type: 'Point',
          coordinates: [lon, lat] // GeoJSON [longitude, latitude]
        },
        latitude: lat,
        longitude: lon,
        district,
        ward,
        image: imageUrl,
        imageName,
        imageSize,
        documentName,
        documentUrl,
        additionalDetails: additionalDetails || '',
        impactedCount: parseInt(impactedCount) || 50,
        urgency,
        status: 'Submitted',
        department: aiResults.recommendedDepartment || 'Government of Jharkhand Civic Nodal Cell',
        assignedOfficer: 'Assigned to Ward Triage Unit',
        upvotes: 1,
        timeline: initialTimeline,
        aiAnalysis: aiDoc,
        matchedUniversities,
        createdAt: new Date()
      });

      // 7. Generate Citizen & Department Notifications
      await notificationService.createNotification({
        recipientId: req.user?.id || 'CIT-JH-88392',
        role: 'citizen',
        title: 'Challenge Registered Successfully',
        message: `Your challenge #${problemId} "${title}" has been recorded. AI triage classified it as ${aiResults.priority} priority.`,
        problemId: problemId,
        category: 'Submission',
        type: 'submission',
        badgeText: 'Submitted',
        badgeColor: 'primary',
        icon: 'bi-send-check'
      });

      console.log('✅ Created challenge in MongoDB:', problemId);

      return res.status(201).json({
        success: true,
        data: newProblem,
        message: 'Challenge submitted and analyzed successfully.'
      });
    } catch (err) {
      console.error('Error submitting problem:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to submit challenge: ' + err.message
      });
    }
  },

  /**
   * Get My Submissions
   */
  async getMyProblems(req, res) {
    try {
      const citizenId = req.user?.id || 'CIT-JH-88392';
      const { search, category, status, sortBy = 'newest' } = req.query;

      const query = { citizenId };

      if (category && category !== 'All') {
        query.category = category;
      }
      if (status && status !== 'All') {
        query.status = status;
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: regex },
          { description: regex },
          { locationName: regex },
          { id: regex }
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
      if (sortBy === 'upvotes') sortOptions = { upvotes: -1 };

      const problems = await Problem.find(query).sort(sortOptions).lean();

      return res.json({
        success: true,
        count: problems.length,
        data: problems
      });
    } catch (err) {
      console.error('Error fetching my problems:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Get Problem Details by ID
   */
  async getProblemById(req, res) {
    try {
      const { id } = req.params;
      const problem = await Problem.findOne({ id }).lean();

      if (!problem) {
        return res.status(404).json({
          success: false,
          error: `Challenge #${id} not found.`
        });
      }

      return res.json({
        success: true,
        data: problem
      });
    } catch (err) {
      console.error('Error fetching problem details:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Get Public Challenges
   */
  async getPublicChallenges(req, res) {
    try {
      const { search, category, district, status, sortBy = 'newest' } = req.query;
      const query = {};

      if (category && category !== 'All') query.category = category;
      if (district && district !== 'All') query.district = district;
      if (status && status !== 'All') query.status = status;
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { description: regex }, { district: regex }];
      }

      let sortOptions = { createdAt: -1 };
      if (sortBy === 'upvotes') sortOptions = { upvotes: -1 };

      const problems = await Problem.find(query).sort(sortOptions).lean();

      return res.json({
        success: true,
        count: problems.length,
        data: problems
      });
    } catch (err) {
      console.error('Error fetching public challenges:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Update Problem (Allowed when Submitted or Under Review)
   */
  async updateProblem(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category, location, additionalDetails } = req.body;

      const problem = await Problem.findOne({ id });
      if (!problem) {
        return res.status(404).json({ success: false, error: 'Challenge not found' });
      }

      if (problem.status !== 'Submitted' && problem.status !== 'Under Review') {
        return res.status(400).json({
          success: false,
          error: 'Only challenges in Submitted or Under Review status can be modified.'
        });
      }

      if (title) problem.title = title.trim();
      if (description) problem.description = description.trim();
      if (category) problem.category = category;
      if (location) problem.locationName = location;
      if (additionalDetails !== undefined) problem.additionalDetails = additionalDetails;
      problem.updatedAt = new Date();

      await problem.save();

      return res.json({
        success: true,
        data: problem,
        message: 'Challenge updated successfully.'
      });
    } catch (err) {
      console.error('Error updating problem:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Withdraw Problem
   */
  async withdrawProblem(req, res) {
    try {
      const { id } = req.params;
      await Problem.findOneAndDelete({ id });
      await AIAnalysis.findOneAndDelete({ problemId: id });
      return res.json({ success: true, message: 'Challenge withdrawn successfully.' });
    } catch (err) {
      console.error('Error withdrawing problem:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Upvote a Problem
   */
  async upvoteProblem(req, res) {
    try {
      const { id } = req.params;
      const problem = await Problem.findOneAndUpdate(
        { id },
        { $inc: { upvotes: 1 } },
        { new: true }
      );
      return res.json({ success: true, data: problem });
    } catch (err) {
      console.error('Error upvoting problem:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Dashboard Aggregation Stats from MongoDB
   */
  async getDashboardStats(req, res) {
    try {
      const citizenId = req.user?.id || 'CIT-JH-88392';
      const allCitizenProblems = await Problem.find({ citizenId }).lean();
      
      const total = allCitizenProblems.length;
      const submitted = allCitizenProblems.filter(p => p.status === 'Submitted').length;
      const underReview = allCitizenProblems.filter(p => p.status === 'Under Review').length;
      const assigned = allCitizenProblems.filter(p => p.status === 'Assigned').length;
      const inProgress = allCitizenProblems.filter(p => p.status === 'In Progress').length;
      const resolved = allCitizenProblems.filter(p => p.status === 'Resolved').length;
      const highPriorityCount = allCitizenProblems.filter(p => p.aiAnalysis?.priority === 'HIGH' || p.aiAnalysis?.priority === 'CRITICAL').length;

      return res.json({
        success: true,
        data: {
          totalSubmissions: total,
          submitted,
          underReview: underReview + assigned,
          inProgress,
          resolved,
          highPriorityCount
        }
      });
    } catch (err) {
      console.error('Error calculating dashboard stats:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Get Citizen Profile
   */
  async getProfile(req, res) {
    try {
      const userId = req.user?.id || 'CIT-JH-88392';
      let user = await User.findOne({ id: userId }).lean();
      if (!user) {
        user = {
          id: 'CIT-JH-88392',
          name: 'Sunil Soren',
          email: 'sunil.soren@jharkhandmail.gov.in',
          phone: '+91 98351 44210',
          district: 'Ranchi',
          ward: 'Ward 12',
          address: 'Kanke Road, Near Central University, Ranchi',
          pincode: '834006',
          aadhaarVerified: true,
          memberSince: 'January 2026',
          avatarInitials: 'SS'
        };
      }
      return res.json({ success: true, data: user });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Update Citizen Profile
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user?.id || 'CIT-JH-88392';
      const updates = req.body;
      const user = await User.findOneAndUpdate(
        { id: userId },
        { ...updates },
        { new: true, upsert: true }
      );
      return res.json({ success: true, data: user });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

export default citizenController;
