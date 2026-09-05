import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  citizenId: { type: String, default: 'CIT-JH-88392', index: true },
  title: { type: String, required: true, index: 'text' },
  description: { type: String, required: true, index: 'text' },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Roads & Infrastructure',
      'Water Management',
      'Sanitation',
      'Electricity & Streetlights',
      'Education',
      'Healthcare',
      'Agriculture',
      'Environment',
      'Rural Livelihood',
      'Accessibility',
      'Public Services',
      'Other'
    ],
    index: true 
  },
  locationName: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  district: { type: String, default: 'Ranchi', index: true },
  ward: { type: String, default: 'Ward 12' },
  
  image: { type: String },
  imageName: { type: String },
  imageSize: { type: String },
  documentName: { type: String },
  documentUrl: { type: String },
  additionalDetails: { type: String, default: '' },
  impactedCount: { type: Number, default: 50 },
  urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'University Review', 'Accepted', 'In Progress', 'Solution Submitted', 'Resolved'],
    default: 'Submitted',
    index: true
  },
  department: { type: String, default: 'Government of Jharkhand Civic Nodal Cell' },
  assignedOfficer: { type: String, default: 'Assigned to Ward Triage Unit' },
  
  // Assigned University Details
  assignedUniversity: {
    universityId: { type: String },
    name: { type: String },
    department: { type: String },
    facultyMentor: { type: String },
    studentTeam: { type: String },
    acceptedAt: { type: Date },
    status: { type: String, default: 'Accepted' },
    solution: {
      summary: { type: String },
      prototypeUrl: { type: String },
      submittedAt: { type: Date },
      submittedBy: { type: String }
    }
  },
  
  upvotes: { type: Number, default: 1, index: true },
  upvotedBy: [{ type: String }],
  
  timeline: [{
    stage: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    completed: { type: Boolean, default: false },
    note: { type: String }
  }],
  
  aiAnalysis: { type: mongoose.Schema.Types.Mixed },
  matchedUniversities: [{
    universityId: String,
    id: String,
    name: String,
    district: String,
    matchScore: Number,
    matchReasons: [String],
    distanceKm: Number,
    relevantDepartment: String,
    expertise: [String],
    researchAreas: [String],
    contact: String,
    status: { type: String, default: 'Available for Assignment' }
  }],
  
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

problemSchema.index({ location: '2dsphere' });
problemSchema.index({ citizenId: 1, createdAt: -1 });

export const Problem = mongoose.models.Problem || mongoose.model('Problem', problemSchema);
export default Problem;
