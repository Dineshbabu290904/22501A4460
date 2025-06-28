import mongoose from 'mongoose';

const ClickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  referrer: { type: String, default: 'Direct' },
  location: { type: String, default: 'Unknown' },
});

const UrlSchema = new mongoose.Schema({
  shortcode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  clickDetails: [ClickSchema],
});

const Url = mongoose.model('Url', UrlSchema);
export default Url;