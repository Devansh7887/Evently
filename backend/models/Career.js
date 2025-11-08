import mongoose from 'mongoose';

const careerSchema = mongoose.Schema({
  jobTitle: { type: String, required: true },
  slug: { type: String, unique: true },
  location: { type: String, required: true }, // e.g., "Remote", "Delhi"
  description: { type: String, required: true },
  applyLink: { type: String, required: false }, // Optional link
});

careerSchema.pre('save', function (next) {
  if (this.isModified('jobTitle')) {
    this.slug = slugify(this.jobTitle, { lower: true, strict: true });
  }
  next();
});

const Career = mongoose.model('Career', careerSchema);
export default Career;