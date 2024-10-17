const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  industry: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  description: {
    type: String
  },
  additionalInfo: {
    type: mongoose.Schema.Types.Mixed
  }
});

module.exports = mongoose.model('Company', companySchema);