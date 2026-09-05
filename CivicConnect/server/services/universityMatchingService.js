import { University } from '../models/University.js';

const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://localhost:8000/api/ai';

function calculateGeoDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const universityMatchingService = {
  /**
   * Dynamic Multi-Factor University Matching connected to Python AI matching microservice
   */
  async matchUniversitiesForProblem({ category, description = '', title = '', district = 'Ranchi', latitude, longitude }) {
    try {
      const universities = await University.find({}).lean();
      
      if (!universities || universities.length === 0) {
        return [];
      }

      // Format university documents for Python AI
      const formattedUnivs = universities.map(u => ({
        id: u.id,
        name: u.name,
        district: u.district || 'Ranchi',
        latitude: u.location?.coordinates?.[1] || (u.district === 'East Singhbhum' ? 22.7766 : u.district === 'Dhanbad' ? 23.8144 : 23.4123),
        longitude: u.location?.coordinates?.[0] || (u.district === 'East Singhbhum' ? 86.1445 : u.district === 'Dhanbad' ? 86.4412 : 85.4399),
        departments: u.departments || [],
        expertise: u.expertise || [],
        researchAreas: u.researchAreas || [],
        contact: u.contactEmail || 'nodal@jharkhand.edu.in'
      }));

      // 1. Try Python AI Microservice
      try {
        const aiResponse = await fetch(`${PYTHON_AI_URL}/university-match`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: category || '',
            text: `${title} ${description}`.trim(),
            district: district || 'Ranchi',
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            universities: formattedUnivs
          }),
          signal: AbortSignal.timeout(3000)
        });

        if (aiResponse.ok) {
          const aiMatches = await aiResponse.json();
          if (Array.isArray(aiMatches) && aiMatches.length > 0) {
            console.log(`🤖 Python AI University Matching: computed ${aiMatches.length} matches for "${title || category}"`);
            return aiMatches;
          }
        }
      } catch (aiErr) {
        console.warn('⚠️ Python AI matcher unreachable, executing Node multi-factor matching engine:', aiErr.message);
      }

      // 2. Native Multi-Factor Scoring Engine (Matches Python AI algorithm)
      const descLower = `${title} ${description}`.toLowerCase();
      const catLower = (category || '').toLowerCase();

      const matched = formattedUnivs.map(u => {
        const uId = u.id;
        const uDistrict = u.district;
        const uExpertise = u.expertise;
        const uResearch = u.researchAreas;
        const uDepts = u.departments;
        const uLat = u.latitude;
        const uLon = u.longitude;

        const matchReasons = [];

        // Factor 1: Category & Expertise Match (up to 40 pts)
        let expertiseScore = 15;
        const matchedExp = uExpertise.find(exp => catLower.includes(exp.toLowerCase()) || exp.toLowerCase().includes(catLower));
        if (matchedExp) {
          expertiseScore = 40;
          matchReasons.push(`Specialized ${matchedExp} domain expertise`);
        } else if (uExpertise.some(exp => descLower.includes(exp.toLowerCase()))) {
          expertiseScore = 25;
          matchReasons.push('Relevant institutional research portfolio');
        }

        // Factor 2: Research Areas Overlap (up to 25 pts)
        let researchScore = 10;
        const matchedRA = uResearch.find(ra => ra.toLowerCase().split(' ').some(w => w.length > 3 && descLower.includes(w)));
        if (matchedRA) {
          researchScore = 25;
          matchReasons.push(`Active research in ${matchedRA}`);
        }

        // Factor 3: Department Relevance (up to 15 pts)
        let deptScore = 8;
        let relevantDept = uDepts[0] || 'Urban Innovation Cell';
        if (catLower.includes('road') && uDepts.some(d => d.toLowerCase().includes('civil'))) {
          deptScore = 15;
          relevantDept = uDepts.find(d => d.toLowerCase().includes('civil'));
          matchReasons.push(`${relevantDept} faculty & lab testing facilities`);
        } else if (catLower.includes('water') && uDepts.some(d => d.toLowerCase().includes('water') || d.toLowerCase().includes('environ'))) {
          deptScore = 15;
          relevantDept = uDepts.find(d => d.toLowerCase().includes('water') || d.toLowerCase().includes('environ'));
          matchReasons.push(`${relevantDept} hydrology lab`);
        } else if (catLower.includes('electric') && uDepts.some(d => d.toLowerCase().includes('electric'))) {
          deptScore = 15;
          relevantDept = uDepts.find(d => d.toLowerCase().includes('electric'));
          matchReasons.push(`${relevantDept} smart grid testing cell`);
        }

        // Factor 4: Location Proximity from actual GPS coordinates (up to 20 pts)
        let distanceKm = 45.0;
        if (latitude && longitude && uLat && uLon) {
          distanceKm = calculateGeoDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(uLat), parseFloat(uLon));
        } else if (district.toLowerCase() === uDistrict.toLowerCase()) {
          distanceKm = 12.5;
        }

        let proximityScore = 8;
        if (distanceKm <= 20.0) {
          proximityScore = 20;
          matchReasons.push(`Located in same district (${uDistrict}, ${distanceKm} km away)`);
        } else if (distanceKm <= 65.0) {
          proximityScore = 14;
          matchReasons.push(`Regional proximity (${distanceKm} km from site)`);
        }

        const totalMatchScore = Math.min(98.5, Math.max(45.0, Math.round((expertiseScore + researchScore + deptScore + proximityScore) * 10) / 10));

        return {
          universityId: uId,
          id: uId,
          name: u.name,
          district: uDistrict,
          matchScore: totalMatchScore,
          distanceKm,
          relevantDepartment: relevantDept,
          expertise: uExpertise,
          researchAreas: uResearch,
          matchReasons,
          contact: u.contact,
          status: 'Available for Assignment'
        };
      });

      matched.sort((a, b) => b.matchScore - a.matchScore);
      return matched;
    } catch (err) {
      console.error('Error in dynamic university matching service:', err);
      return [];
    }
  }
};

export default universityMatchingService;
