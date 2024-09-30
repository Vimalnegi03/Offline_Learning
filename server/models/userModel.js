import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  skills:{
    type: [String],
  },
  photo: {
    type: String, // URL to the user's avatar
  },
  role: {
    type: String,
    enum: ['learner', 'tutor', 'admin'],
    default: 'learner',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'Point' for 2dsphere index
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  swipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to User model
  }]
}, { timestamps: true });
userSchema.index({ location: '2dsphere' })
const User = mongoose.model('User', userSchema);

export default User;
