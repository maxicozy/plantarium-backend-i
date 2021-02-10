import mongoose from 'mongoose';
const { Schema, model } = mongoose

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  modules: [{
    type: Schema.Types.ObjectId,
    ref: 'module',
  }]
});

const Garden = model('garden', schema);

export default Garden;