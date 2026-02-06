import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  features: [{
    type: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.model('Service', serviceSchema);