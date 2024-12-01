import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  prices: {
    normal: { type: Number, required: true },
    premium: { type: Number, required: true }
  },
  tags: [String],
  poster: { type: String, default: 'default.png' }
});

//export default mongoose.model('Movie', movieSchema);
module.exports = mongoose.model('Movie', movieSchema);