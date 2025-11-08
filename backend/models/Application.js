import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Career',
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;