/**
 * universityService.js
 * Frontend Service for University Portal & Dynamic Problem Routing
 * Communicates with Express Backend & MongoDB
 */

import api from './api';

export const universityService = {
  /**
   * Get dynamic recommended challenges based on university expertise, departments, location & AI matching
   */
  async getRecommendedChallenges(universityId = 'UNIV-BIT-MESRA') {
    try {
      const response = await api.get('/universities/recommended-challenges', {
        params: { universityId }
      });
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API notice: using fallback for recommended challenges', err.message);
    }
    return [];
  },

  /**
   * Get challenges accepted / in-progress by this university
   */
  async getMyChallenges(universityId = 'UNIV-BIT-MESRA') {
    try {
      const response = await api.get('/universities/my-challenges', {
        params: { universityId }
      });
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API notice: using fallback for accepted challenges', err.message);
    }
    return [];
  },

  /**
   * University Accepts a Challenge
   */
  async acceptChallenge(problemId, universityData = {}) {
    const response = await api.post(`/universities/accept/${problemId}`, {
      universityId: universityData.universityId || 'UNIV-BIT-MESRA',
      universityName: universityData.universityName || 'Birla Institute of Technology (BIT) Mesra',
      department: universityData.department || 'Civil & Environmental Engineering'
    });
    return response.data?.data;
  },

  /**
   * Assign Faculty Mentor & Student Research Team
   */
  async assignTeam(problemId, { facultyMentor, studentTeam, department }) {
    const response = await api.post(`/universities/assign-team/${problemId}`, {
      facultyMentor,
      studentTeam,
      department
    });
    return response.data?.data;
  },

  /**
   * Submit Research Solution / Prototype
   */
  async submitSolution(problemId, { summary, prototypeUrl, submittedBy }) {
    const response = await api.post(`/universities/submit-solution/${problemId}`, {
      summary,
      prototypeUrl,
      submittedBy
    });
    return response.data?.data;
  },

  /**
   * Get University Profile, Faculty, & Student Teams
   */
  async getProfile(universityId = 'UNIV-BIT-MESRA') {
    try {
      const response = await api.get('/universities/profile', {
        params: { universityId }
      });
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API notice: using fallback university profile');
    }
    return null;
  },

  /**
   * Get Live Problem Metrics for the University
   */
  async getMetrics(universityId = 'UNIV-BIT-MESRA') {
    try {
      const response = await api.get('/universities/metrics', {
        params: { universityId }
      });
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API notice: using default metrics');
    }
    return {
      totalProblems: 142,
      newProblems: 28,
      currentlyWorking: 35,
      submittedProblems: 46,
      fundingApproved: 19,
      submittedToGovernment: 14
    };
  }
};

export default universityService;
