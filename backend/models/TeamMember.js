import mongoose from 'mongoose';

const teamMemberSchema = mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., "Founder", "Lead Planner"
  bio: { type: String, required: false },
  imageUrl: { type: String, required: true },
  linkedinId: { type: String, required: false },
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
export default TeamMember;