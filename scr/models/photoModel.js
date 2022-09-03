const mongoose = require("mongoose")

const photoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['oyila', 'ish', 'shaxsiy']
  },
  owner: {
    type: String,
    required: true
  }
},
{
  timestamps: true
})

module.exports = mongoose.model("Photo", photoSchema)