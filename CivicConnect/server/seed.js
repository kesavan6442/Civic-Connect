import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { University } from './models/University.js';
import { Problem } from './models/Problem.js';
import { Notification } from './models/Notification.js';
import { User } from './models/User.js';

dotenv.config();

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding CivicConnect Database...');

    // 1. Seed User
    const existingUser = await User.findOne({ id: 'CIT-JH-88392' });
    if (!existingUser) {
      await User.create({
        id: 'CIT-JH-88392',
        name: 'Sunil Soren',
        email: 'sunil.soren@jharkhandmail.gov.in',
        phone: '+91 98351 44210',
        role: 'citizen',
        district: 'Ranchi',
        ward: 'Ward 12',
        address: 'Kanke Road, Near Central University, Ranchi',
        pincode: '834006',
        aadhaarVerified: true,
        memberSince: 'January 2026',
        avatarInitials: 'SS'
      });
      console.log('✅ Citizen user seeded.');
    }

    // 2. Seed/Update Universities with Faculty & Teams
    const univData = [
      {
        id: 'UNIV-BIT-MESRA',
        name: 'Birla Institute of Technology (BIT) Mesra',
        shortName: 'BIT Mesra',
        district: 'Ranchi',
        location: { type: 'Point', coordinates: [85.4399, 23.4123] },
        departments: ['Civil & Environmental Engineering', 'Computer Science', 'Remote Sensing & GIS'],
        expertise: ['Roads & Infrastructure', 'Water Management', 'Geospatial Analytics', 'Urban Planning'],
        researchAreas: ['Smart Pavement Materials', 'Urban Flood Hydrology', 'Computer Vision Traffic Systems', 'Infrastructure Durability'],
        contactEmail: 'civic.rnd@bitmesra.ac.in',
        contactPhone: '+91 651 2275444',
        nodalOfficer: 'Dr. A. K. Sinha (Dean R&D)',
        faculty: [
          {
            id: 'FAC-BIT-01',
            name: 'Dr. Anand K. Sinha',
            department: 'Civil & Environmental Engineering',
            designation: 'Professor & Dean (R&D)',
            specialization: 'Pavement Engineering & Smart Materials',
            email: 'ak.sinha@bitmesra.ac.in'
          },
          {
            id: 'FAC-BIT-02',
            name: 'Dr. Rituja Kumari',
            department: 'Civil & Environmental Engineering',
            designation: 'Associate Professor',
            specialization: 'Hydrological Modeling & Storm Drainage',
            email: 'rkumari@bitmesra.ac.in'
          },
          {
            id: 'FAC-BIT-03',
            name: 'Prof. Subhashish Roy',
            department: 'Computer Science & Engineering',
            designation: 'Assistant Professor',
            specialization: 'IoT Sensor Networks & Civic Analytics',
            email: 'sroy@bitmesra.ac.in'
          }
        ],
        teams: [
          {
            id: 'TEAM-BIT-01',
            name: 'Team PaveGuard (Civil Innovation Unit)',
            department: 'Civil & Environmental Engineering',
            leadStudent: 'Aditya Raj (B.Tech Final Year)',
            membersCount: 4,
            activeProject: 'Pothole Patch Polymer Prototype'
          },
          {
            id: 'TEAM-BIT-02',
            name: 'Team AquaFlow (Hydrology Research Cell)',
            department: 'Civil & Environmental Engineering',
            leadStudent: 'Sneha Murmu (M.Tech Water Engg)',
            membersCount: 5,
            activeProject: 'Harmu Drainage Flow Optimizer'
          }
        ]
      },
      {
        id: 'UNIV-IIT-ISM-DHANBAD',
        name: 'Indian Institute of Technology (IIT ISM) Dhanbad',
        shortName: 'IIT Dhanbad',
        district: 'Dhanbad',
        location: { type: 'Point', coordinates: [86.4412, 23.8144] },
        departments: ['Environmental Science & Engineering', 'Mining Machinery', 'Electrical Engineering'],
        expertise: ['Environment', 'Electricity & Streetlights', 'Groundwater Hydrology', 'Waste Management'],
        researchAreas: ['Industrial Solid Waste', 'Smart Grid Distribution', 'Subsurface Water Mapping', 'Renewable Microgrids'],
        contactEmail: 'rural.tech@iitism.ac.in',
        contactPhone: '+91 326 2235001',
        nodalOfficer: 'Prof. R. Banerjee',
        faculty: [
          {
            id: 'FAC-IIT-01',
            name: 'Prof. R. Banerjee',
            department: 'Electrical Engineering',
            designation: 'Professor',
            specialization: 'Power Distribution & Smart Grid IoT',
            email: 'rbanerjee@iitism.ac.in'
          },
          {
            id: 'FAC-IIT-02',
            name: 'Dr. Meena Soren',
            department: 'Environmental Science & Engineering',
            designation: 'Associate Professor',
            specialization: 'Groundwater Contamination & Filtration',
            email: 'msoren@iitism.ac.in'
          }
        ],
        teams: [
          {
            id: 'TEAM-IIT-01',
            name: 'Team GridSense (Electrical Innovation Cell)',
            department: 'Electrical Engineering',
            leadStudent: 'Priya Sharma (M.Tech)',
            membersCount: 4,
            activeProject: 'Solar Streetlight Blackout Sensor'
          }
        ]
      },
      {
        id: 'UNIV-NIT-JAMSHEDPUR',
        name: 'National Institute of Technology (NIT) Jamshedpur',
        shortName: 'NIT Jamshedpur',
        district: 'East Singhbhum',
        location: { type: 'Point', coordinates: [86.1445, 22.7766] },
        departments: ['Civil Engineering', 'Electronics & Communication', 'Mechanical Engineering'],
        expertise: ['Roads & Infrastructure', 'Sanitation', 'Smart City IoT', 'Public Transportation'],
        researchAreas: ['Recycled Bituminous Concrete', 'Drainage Sensor Networks', 'Low-cost Sanitation', 'Urban Mobility'],
        contactEmail: 'innovation@nitjsr.ac.in',
        contactPhone: '+91 657 2373407',
        nodalOfficer: 'Dr. Sanjay Kumar',
        faculty: [
          {
            id: 'FAC-NIT-01',
            name: 'Dr. Sanjay Kumar',
            department: 'Civil Engineering',
            designation: 'Professor',
            specialization: 'Urban Infrastructure & Highway Materials',
            email: 'skumar@nitjsr.ac.in'
          }
        ],
        teams: [
          {
            id: 'TEAM-NIT-01',
            name: 'Team CleanCity (Sanitation IoT)',
            department: 'Electronics & Communication',
            leadStudent: 'Rohan Gupta (B.Tech)',
            membersCount: 4,
            activeProject: 'Solid Waste Smart Bin Telemetry'
          }
        ]
      },
      {
        id: 'UNIV-CUJ-RANCHI',
        name: 'Central University of Jharkhand (CUJ)',
        shortName: 'CUJ Ranchi',
        district: 'Ranchi',
        location: { type: 'Point', coordinates: [85.2341, 23.2388] },
        departments: ['Water Engineering & Management', 'Mass Communication', 'Rural Development'],
        expertise: ['Water Management', 'Rural Livelihood', 'Education', 'Healthcare'],
        researchAreas: ['Indigenous Water Harvesting', 'Public Sanitation Awareness', 'Tribal Healthcare Logistics'],
        contactEmail: 'social.innovation@cuj.ac.in',
        contactPhone: '+91 651 2974001',
        nodalOfficer: 'Dr. Manoj Kumar',
        faculty: [
          {
            id: 'FAC-CUJ-01',
            name: 'Dr. Manoj Kumar',
            department: 'Water Engineering & Management',
            designation: 'Associate Professor',
            specialization: 'Rural Water Supply & Watershed Planning',
            email: 'mkumar@cuj.ac.in'
          }
        ],
        teams: [
          {
            id: 'TEAM-CUJ-01',
            name: 'Team JalSamvaad (Water Cell)',
            department: 'Water Engineering & Management',
            leadStudent: 'Puja Oraon (Research Scholar)',
            membersCount: 3,
            activeProject: 'Rainwater Recharge Well Design'
          }
        ]
      }
    ];

    for (const u of univData) {
      await University.findOneAndUpdate({ id: u.id }, u, { upsert: true, new: true });
    }
    console.log('✅ State Universities updated with Faculty & Student Teams.');

    // 3. Seed Initial Verified Problems with Dynamic Matching
    const problemCount = await Problem.countDocuments();
    if (problemCount === 0) {
      await Problem.insertMany([
        {
          id: 'CC-2026-08912',
          citizenId: 'CIT-JH-88392',
          title: 'Severe Pothole & Broken Culvert on Harmu Bypass Road',
          description: 'A deep crater and broken storm drain cover on Harmu Bypass road is causing daily traffic bottlenecks and severe accident hazards for two-wheelers during evening hours.',
          category: 'Roads & Infrastructure',
          locationName: 'Harmu Bypass Road, Ward 26, Ranchi',
          location: { type: 'Point', coordinates: [85.3096, 23.3441] },
          latitude: 23.3441,
          longitude: 85.3096,
          district: 'Ranchi',
          ward: 'Ward 26',
          image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          imageName: 'harmu_bypass_pothole.jpg',
          imageSize: '2.4 MB',
          documentName: 'ward_complaint_letter.pdf',
          additionalDetails: 'Near Patel Chowk traffic intersection, opposite Petrol Pump',
          impactedCount: 350,
          urgency: 'high',
          status: 'In Progress',
          department: 'Ranchi Municipal Corporation (RMC) - Engineering Cell',
          assignedOfficer: 'Er. Rajesh Mishra (Executive Engineer)',
          assignedUniversity: {
            universityId: 'UNIV-BIT-MESRA',
            name: 'Birla Institute of Technology (BIT) Mesra',
            department: 'Civil & Environmental Engineering',
            facultyMentor: 'Dr. Anand K. Sinha (Dean R&D)',
            studentTeam: 'Team PaveGuard (Civil Innovation Unit)',
            acceptedAt: new Date('2026-09-02T10:00:00Z'),
            status: 'In Progress'
          },
          upvotes: 48,
          timeline: [
            {
              stage: 'Submitted',
              title: 'Challenge Registered by Resident',
              date: '01 Sep 2026, 10:30 AM',
              completed: true,
              note: 'Challenge recorded under ID #CC-2026-08912.'
            },
            {
              stage: 'Under Review',
              title: 'AI Verification & Municipal Triage',
              date: '01 Sep 2026, 10:32 AM',
              completed: true,
              note: 'AI flagged as HIGH priority. Category verified as Roads & Infrastructure.'
            },
            {
              stage: 'University Review',
              title: 'Matched & Routed to BIT Mesra',
              date: '01 Sep 2026, 11:15 AM',
              completed: true,
              note: 'High match score (96.5%) with Civil & Environmental Engineering research cell.'
            },
            {
              stage: 'Accepted',
              title: 'Accepted by BIT Mesra Civil Cell',
              date: '02 Sep 2026, 10:00 AM',
              completed: true,
              note: 'Assigned to Faculty Mentor Dr. Anand K. Sinha & Team PaveGuard.'
            },
            {
              stage: 'In Progress',
              title: 'Field Assessment & Patch Prototyping Active',
              date: '03 Sep 2026, 11:00 AM',
              completed: true,
              note: 'Fast-curing cold-mix bituminous patch polymer testing on site.'
            },
            {
              stage: 'Resolved',
              title: 'Final Quality Verification',
              date: 'Pending',
              completed: false,
              note: 'Citizen inspection and resolution sign-off.'
            }
          ],
          aiAnalysis: {
            category: 'Roads & Infrastructure',
            suggestedCategory: 'Roads & Infrastructure',
            categoryConfidence: 96.0,
            severity: 'HIGH',
            priority: 'HIGH',
            priorityScore: 84.5,
            priorityConfidence: 94.0,
            priorityReasoning: 'Critical vehicular accident hotspot detected along major municipal arterial route.',
            duplicateProbability: 92,
            isPossibleDuplicate: true,
            highestSimilarity: 92,
            recommendedDepartment: 'Ranchi Municipal Corporation - Engineering Cell',
            recommendedAction: 'Immediate cold-mix bituminous patch and slab replacement.'
          },
          matchedUniversities: [
            {
              universityId: 'UNIV-BIT-MESRA',
              id: 'UNIV-BIT-MESRA',
              name: 'Birla Institute of Technology (BIT) Mesra',
              district: 'Ranchi',
              matchScore: 96.5,
              distanceKm: 9.8,
              relevantDepartment: 'Civil & Environmental Engineering',
              expertise: ['Roads & Infrastructure', 'Water Management'],
              researchAreas: ['Smart Pavement Materials', 'Infrastructure Durability'],
              matchReasons: [
                'Specialized Roads & Infrastructure domain expertise',
                'Active research in Smart Pavement Materials',
                'Civil & Environmental Engineering faculty & lab testing facilities',
                'Located in same district (Ranchi, 9.8 km away)'
              ],
              contact: 'civic.rnd@bitmesra.ac.in',
              status: 'In Progress'
            },
            {
              universityId: 'UNIV-NIT-JAMSHEDPUR',
              id: 'UNIV-NIT-JAMSHEDPUR',
              name: 'National Institute of Technology (NIT) Jamshedpur',
              district: 'East Singhbhum',
              matchScore: 88.0,
              distanceKm: 106.0,
              relevantDepartment: 'Civil Engineering',
              expertise: ['Roads & Infrastructure', 'Sanitation'],
              researchAreas: ['Recycled Bituminous Concrete'],
              matchReasons: [
                'Civil Engineering department and highway materials lab',
                'Recycled Bituminous Concrete research'
              ],
              contact: 'innovation@nitjsr.ac.in',
              status: 'Available for Assignment'
            }
          ],
          createdAt: new Date('2026-09-01T10:30:00Z')
        },
        {
          id: 'CC-2026-08701',
          citizenId: 'CIT-JH-88392',
          title: 'Major Drinking Water Pipeline Fracture in Sakchi Market',
          description: 'Sub-surface distribution line burst causing continuous clean drinking water loss of over 10,000 liters daily and severe waterlogging across market stalls.',
          category: 'Water Management',
          locationName: 'Sakchi Main Market, Jamshedpur',
          location: { type: 'Point', coordinates: [86.2029, 22.8046] },
          latitude: 22.8046,
          longitude: 86.2029,
          district: 'East Singhbhum',
          ward: 'Ward 8',
          image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
          imageName: 'water_pipe_burst.jpg',
          imageSize: '1.8 MB',
          additionalDetails: 'Behind vegetable market shed #4',
          impactedCount: 1200,
          urgency: 'high',
          status: 'Under Review',
          department: 'Drinking Water & Sanitation Department (DWSD)',
          assignedOfficer: 'Assigned to Zonal Water Maintenance Unit',
          upvotes: 31,
          timeline: [
            {
              stage: 'Submitted',
              title: 'Challenge Registered by Resident',
              date: '02 Sep 2026, 09:15 AM',
              completed: true,
              note: 'Challenge recorded under ID #CC-2026-08701.'
            },
            {
              stage: 'Under Review',
              title: 'Automated AI Pre-Screening & Triage',
              date: '02 Sep 2026, 09:16 AM',
              completed: true,
              note: 'High severity pipeline rupture detected. Prioritized for rapid containment.'
            },
            {
              stage: 'University Review',
              title: 'Matched to NIT Jamshedpur & CUJ',
              date: '02 Sep 2026, 09:18 AM',
              completed: true,
              note: 'Routed to NIT Jamshedpur Civil & Smart City Cell (94% match score).'
            }
          ],
          aiAnalysis: {
            category: 'Water Management',
            suggestedCategory: 'Water Management',
            categoryConfidence: 97.0,
            severity: 'HIGH',
            priority: 'HIGH',
            priorityScore: 89.0,
            priorityConfidence: 95.0,
            priorityReasoning: 'Massive drinking water wastage impacting 1200+ commercial vendors and residents.',
            duplicateProbability: 14,
            isPossibleDuplicate: false,
            recommendedDepartment: 'Drinking Water & Sanitation Department (DWSD)',
            recommendedAction: 'Emergency valve shutdown and sleeve joint installation.'
          },
          matchedUniversities: [
            {
              universityId: 'UNIV-NIT-JAMSHEDPUR',
              id: 'UNIV-NIT-JAMSHEDPUR',
              name: 'National Institute of Technology (NIT) Jamshedpur',
              district: 'East Singhbhum',
              matchScore: 94.5,
              distanceKm: 6.4,
              relevantDepartment: 'Civil Engineering',
              expertise: ['Water Management', 'Smart City IoT'],
              researchAreas: ['Drainage Sensor Networks', 'Low-cost Sanitation'],
              matchReasons: [
                'Specialized Water Management & Drainage expertise',
                'Located in same district (East Singhbhum, 6.4 km away)',
                'Hydrology testing lab & sensor team'
              ],
              contact: 'innovation@nitjsr.ac.in',
              status: 'Available for Assignment'
            },
            {
              universityId: 'UNIV-CUJ-RANCHI',
              id: 'UNIV-CUJ-RANCHI',
              name: 'Central University of Jharkhand (CUJ)',
              district: 'Ranchi',
              matchScore: 82.0,
              distanceKm: 110.0,
              relevantDepartment: 'Water Engineering & Management',
              expertise: ['Water Management', 'Rural Development'],
              researchAreas: ['Indigenous Water Harvesting'],
              matchReasons: [
                'Water Engineering & Management Department',
                'Water harvesting and conservation portfolio'
              ],
              contact: 'social.innovation@cuj.ac.in',
              status: 'Available for Assignment'
            }
          ],
          createdAt: new Date('2026-09-02T09:15:00Z')
        }
      ]);
      console.log('✅ Initial verified problems seeded with multi-factor university matching.');
    }

    console.log('🎉 Database seeding completed successfully.');
  } catch (err) {
    console.error('Error during database seed:', err);
  }
}

export default seedDatabase;
