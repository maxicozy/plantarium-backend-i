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
  tds: {
    type: Number,
  },
  ph: {
    type: Number,
  },
  module: {
    //id des moduls aus dem die sensordaten kommen
    type: Schema.Types.ObjectId,
    ref: 'module',
  }
});

const SensorData = mongoose.model('sensorData', schema);

export default SensorData;