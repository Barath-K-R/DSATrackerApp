import mongoose from 'mongoose';

const problemTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const ProblemType = mongoose.model('ProblemType', problemTypeSchema);

export default ProblemType;
