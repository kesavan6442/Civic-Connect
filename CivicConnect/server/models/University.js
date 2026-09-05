import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  shortName: { type: String },
  district: { type: String, required: true, index: true },
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
  departments: [{ type: String }],
  expertise: [{ type: String }],
  categories: [{ type: String }],
  researchAreas: [{ type: String }],
  contactEmail: { type: String },
  contactPhone: { type: String },
  nodalOfficer: { type: String },
  
  // Real Faculty Registry
  faculty: [{
    id: { type: String },
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, default: 'Associate Professor' },
    specialization: { type: String },
    email: { type: String }
  }],

  // Real Student & Innovation Teams
  teams: [{
    id: { type: String },
    name: { type: String, required: true },
    department: { type: String, required: true },
    leadStudent: { type: String, required: true },
    membersCount: { type: Number, default: 4 },
    activeProject: { type: String, default: 'None' }
  }],

  activeProjectsCount: { type: Number, default: 0 },
  resolvedProblemsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

universitySchema.index({ location: '2dsphere' });
universitySchema.index({ expertise: 1 });

export const University = mongoose.models.University || mongoose.model('University', universitySchema);
export default University;
