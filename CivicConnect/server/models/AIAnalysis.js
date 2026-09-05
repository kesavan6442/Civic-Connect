import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema({
  problemId: { type: String, required: true, index: true },
  category: { type: String, required: true },
  suggestedCategory: { type: String },
  categoryConfidence: { type: Number, default: 94.0 },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  priorityScore: { type: Number, default: 78.5 },
  priorityConfidence: { type: Number, default: 92.0 },
  priorityReasoning: { type: String },
  imageConfidence: { type: Number, default: 0.0 },
  hasVisualEvidence: { type: Boolean, default: false },
  textConfidence: { type: Number, default: 90.0 },
  duplicateProbability: { type: Number, default: 0.0 },
  isPossibleDuplicate: { type: Boolean, default: false },
  highestSimilarity: { type: Number, default: 0.0 },
  topMatch: {
    id: String,
    title: String,
    similarity: Number,
    distanceMeters: Number
  },
  similarProblems: [{
    id: String,
    title: String,
    category: String,
    similarity: Number,
    distanceMeters: Number,
    status: String
  }],
  recommendedDepartment: { type: String },
  recommendedAction: { type: String },
  matchedUniversities: [{
    id: String,
    name: String,
    district: String,
    matchScore: Number,
    distanceKm: Number,
    relevantDepartment: String,
    expertise: [String],
    contact: String
  }],
  rawInferenceData: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

export const AIAnalysis = mongoose.models.AIAnalysis || mongoose.model('AIAnalysis', aiAnalysisSchema);
export default AIAnalysis;
