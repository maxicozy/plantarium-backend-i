import mongoose from 'mongoose';
const { Schema, model } = mongoose

//anlegen des Gartenschemas
const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  modules: [{
    //hier kommt die id vom modul rein
    type: Schema.Types.ObjectId,
    ref: 'module',
  }]
});

const Garden = model('garden', schema);

export default Garden;