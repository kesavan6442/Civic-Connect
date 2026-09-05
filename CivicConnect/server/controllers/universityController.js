import { University } from '../models/University.js';
import { Problem } from '../models/Problem.js';
import { notificationService } from '../services/notificationService.js';
import { universityMatchingService } from '../services/universityMatchingService.js';

export const universityController = {
  /**
   * Get all registered universities
   */
  async getUniversities(req, res) {
    try {
      const { district, expertise } = req.query;
      const query = {};
      if (district && district !== 'All') query.district = district;
      if (expertise && expertise !== 'All') query.expertise = expertise;

      const list = await University.find(query).lean();
      return res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Get University Profile & Faculty/Teams
   */
  async getProfile(req, res) {
    try {
      const univId = req.query.universityId || 'UNIV-BIT-MESRA';
      let univ = await University.findOne({ id: univId }).lean();
      if (!univ) {
        univ = await University.findOne({}).lean();
      }
      return res.json({ success: true, data: univ });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Get Recommended Challenges for Logged-In University
   */
  async getRecommendedChallenges(req, res) {
    try {
      const univId = req.query.universityId || 'UNIV-BIT-MESRA';
      const univ = await University.findOne({ id: univId }).lean();
      
      if (!univ) {
        return res.json({ success: true, count: 0, data: [] });
      }

      // Fetch unaccepted challenges or challenges under review from MongoDB
      const allProblems = await Problem.find({
        status: { $in: ['Submitted', 'Under Review', 'University Review', 'In Progress'] }
      }).sort({ createdAt: -1 }).lean();

      // Dynamically score and match each problem for this university
      const recommended = [];

      for (const p of allProblems) {
        // Skip if already accepted by another university
        if (p.assignedUniversity && p.assignedUniversity.universityId && p.assignedUniversity.universityId !== univId && p.status === 'In Progress') {
          continue;
        }

        const matches = await universityMatchingService.matchUniversitiesForProblem({
          title: p.title,
          category: p.category,
          description: p.description,
          district: p.district || 'Ranchi',
          latitude: p.latitude || p.location?.coordinates?.[1],
          longitude: p.longitude || p.location?.coordinates?.[0]
        });

        const matchedItem = matches.find(m => m.universityId === univId || m.id === univId);

        if (matchedItem && matchedItem.matchScore >= 45) {
          recommended.push({
            ...p,
            matchScore: matchedItem.matchScore,
            matchReasons: matchedItem.matchReasons && matchedItem.matchReasons.length > 0
              ? matchedItem.matchReasons
              : [
                  `Specialized ${p.category} domain expertise`,
                  `Regional proximity (${matchedItem.distanceKm} km from ${univ.district || 'campus'})`
                ],
            relevantDepartment: matchedItem.relevantDepartment || univ.departments?.[0] || 'Civil & Environmental Engineering',
            distanceKm: matchedItem.distanceKm
          });
        }
      }

      // Sort by AI match score descending
      recommended.sort((a, b) => b.matchScore - a.matchScore);

      return res.json({
        success: true,
        count: recommended.length,
        data: recommended
      });
    } catch (err) {
      console.error('Error fetching recommended challenges for university:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Get Challenges Accepted / In Progress by this University
   */
  async getMyChallenges(req, res) {
    try {
      const univId = req.query.universityId || 'UNIV-BIT-MESRA';
      const problems = await Problem.find({
        'assignedUniversity.universityId': univId
      }).sort({ updatedAt: -1 }).lean();

      return res.json({
        success: true,
        count: problems.length,
        data: problems
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * University Accepts a Challenge
   */
  async acceptChallenge(req, res) {
    try {
      const { problemId } = req.params;
      const {
        universityId = 'UNIV-BIT-MESRA',
        universityName = 'Birla Institute of Technology (BIT) Mesra',
        department = 'Civil & Environmental Engineering'
      } = req.body;

      const problem = await Problem.findOne({ id: problemId });
      if (!problem) {
        return res.status(404).json({ success: false, error: 'Challenge not found' });
      }

      // Update Problem Status & Assigned University
      problem.status = 'In Progress';
      problem.assignedUniversity = {
        universityId,
        name: universityName,
        department,
        acceptedAt: new Date(),
        status: 'Accepted'
      };

      // Add timeline entry
      problem.timeline.push({
        stage: 'In Progress',
        title: `Challenge Accepted by ${universityName}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        note: `Research & Solution Development assigned to ${department}.`
      });
      problem.updatedAt = new Date();

      await problem.save();

      // Notify Citizen
      await notificationService.createNotification({
        recipientId: problem.citizenId || 'CIT-JH-88392',
        role: 'citizen',
        title: `Challenge Accepted by ${universityName}`,
        message: `Your reported challenge #${problem.id} has been accepted by ${universityName} (${department}) for solution prototyping.`,
        problemId: problem.id,
        category: 'University Assignment',
        type: 'assigned',
        badgeText: 'University Assigned',
        badgeColor: 'success',
        icon: 'bi-mortarboard-fill'
      });

      return res.json({
        success: true,
        data: problem,
        message: `Challenge #${problem.id} successfully accepted by ${universityName}.`
      });
    } catch (err) {
      console.error('Error accepting challenge:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Assign Faculty Mentor & Student Research Team
   */
  async assignTeam(req, res) {
    try {
      const { problemId } = req.params;
      const { facultyMentor, studentTeam, department } = req.body;

      const problem = await Problem.findOne({ id: problemId });
      if (!problem) {
        return res.status(404).json({ success: false, error: 'Challenge not found' });
      }

      if (!problem.assignedUniversity) {
        problem.assignedUniversity = {
          universityId: 'UNIV-BIT-MESRA',
          name: 'Birla Institute of Technology (BIT) Mesra',
          status: 'Accepted'
        };
      }

      problem.assignedUniversity.facultyMentor = facultyMentor;
      problem.assignedUniversity.studentTeam = studentTeam;
      if (department) problem.assignedUniversity.department = department;
      problem.status = 'In Progress';

      problem.timeline.push({
        stage: 'In Progress',
        title: `Assigned to ${facultyMentor || 'Faculty Mentor'} & ${studentTeam || 'Student Team'}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        completed: true,
        note: `Field study and technical design initiated by ${studentTeam}.`
      });
      problem.updatedAt = new Date();

      await problem.save();

      // Notify Citizen
      await notificationService.createNotification({
        recipientId: problem.citizenId || 'CIT-JH-88392',
        role: 'citizen',
        title: `Project Team Assigned by University`,
        message: `Challenge #${problem.id} has been assigned to Faculty Mentor ${facultyMentor} and Student Research Team ${studentTeam}.`,
        problemId: problem.id,
        category: 'University Team',
        type: 'in_progress',
        badgeText: 'Team Active',
        badgeColor: 'primary',
        icon: 'bi-people-fill'
      });

      return res.json({
        success: true,
        data: problem,
        message: 'Team successfully assigned to challenge.'
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Submit Research Solution / Technical Blueprint
   */
  async submitSolution(req, res) {
    try {
      const { problemId } = req.params;
      const { summary, prototypeUrl, submittedBy } = req.body;

      const problem = await Problem.findOne({ id: problemId });
      if (!problem) {
        return res.status(404).json({ success: false, error: 'Challenge not found' });
      }

      problem.status = 'Solution Submitted';
      if (!problem.assignedUniversity) {
        problem.assignedUniversity = {};
      }
      problem.assignedUniversity.solution = {
        summary: summary || 'Comprehensive engineering solution and field pilot recommendations prepared.',
        prototypeUrl: prototypeUrl || 'https://github.com/civicconnect-solutions',
        submittedAt: new Date(),
        submittedBy: submittedBy || 'Research Innovation Team'
      };

      problem.timeline.push({
        stage: 'Solution Submitted',
        title: 'Innovative Technical Solution Submitted',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        completed: true,
        note: `Engineering proposal & prototype blueprint submitted by ${problem.assignedUniversity?.name || 'Assigned University'}. Forwarded to Municipal Administration for execution.`
      });
      problem.updatedAt = new Date();

      await problem.save();

      // Notify Citizen
      await notificationService.createNotification({
        recipientId: problem.citizenId || 'CIT-JH-88392',
        role: 'citizen',
        title: 'Solution Blueprint Submitted by University',
        message: `A technical solution proposal for challenge #${problem.id} has been submitted by ${problem.assignedUniversity?.name || 'University Team'} and sent for municipal implementation.`,
        problemId: problem.id,
        category: 'Solution Ready',
        type: 'resolved',
        badgeText: 'Solution Ready',
        badgeColor: 'success',
        icon: 'bi-check-circle-fill'
      });

      return res.json({
        success: true,
        data: problem,
        message: 'Solution blueprint submitted successfully.'
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * University Real Problem Metrics
   */
  async getMetrics(req, res) {
    try {
      const univId = req.query.universityId || 'UNIV-BIT-MESRA';
      const allProblems = await Problem.find({}).lean();
      const myProblems = allProblems.filter(p => p.assignedUniversity?.universityId === univId);

      const totalProblems = allProblems.length;
      const newProblems = allProblems.filter(p => p.status === 'Submitted' || p.status === 'Under Review' || p.status === 'University Review').length;
      const currentlyWorking = myProblems.filter(p => p.status === 'In Progress').length;
      const submittedProblems = myProblems.length;
      const fundingApproved = myProblems.filter(p => p.status === 'Solution Submitted' || p.status === 'Resolved').length;
      const submittedToGovernment = myProblems.filter(p => p.status === 'Solution Submitted').length;

      return res.json({
        success: true,
        data: {
          totalProblems,
          newProblems,
          currentlyWorking,
          submittedProblems,
          fundingApproved,
          submittedToGovernment
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

export default universityController;
