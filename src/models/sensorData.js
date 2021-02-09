import mongoose from 'mongoose';
const { Schema, model } = mongoose

const schema = new Schema({
  time: {
    type: Date,
    required: true,
  },
  waterLevel: {
    type: Number,
    required: true,
  },
  ec: {
    type: Number,
  },
  ph: {
    type: Number,
  },
  module: {
    type: Schema.Types.ObjectId,
    ref: 'module',
  }
});

const SensorData = mongoose.model('sensorData', schema);

export default SensorData;