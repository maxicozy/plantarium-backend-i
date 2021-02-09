import mongoose from 'mongoose';
const { Schema, model } = mongoose

const schema = new Schema({
  plant: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  plantedOn: {
    type: Date,
  },
  garden: {
    type: Schema.Types.ObjectId,
    ref: 'garden',
  },
  sensorData: [{
    type: Schema.Types.ObjectId,
    ref: 'sensorData',
  }]
})

schema.index({ position: 1, garden: 1 }, { unique: true });

const Module = model('module', schema);

export default Module;