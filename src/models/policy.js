const mongoose = require('mongoose');

const policySchema = mongoose.Schema({
  policyCode: {
    type: String,
    required: [true, 'Policy Code is required'],
    unique: true,
    trim: true, // Built-in trimming
    uppercase: true // Auto-convert to uppercase (e.g., " pol123 " -> "POL123")
  },
  policyName: {
    type: String,
    required: [true, 'Policy Name is required'],
    trim: true
  },
  policyType: {
    type: String,
    required: true,
    trim: true,
    enum: ['Life', 'Health', 'Vehicle', 'Property'] // Restricted values
  },
  policyCategory: {
    type: String,
    required: true,
    trim: true,
    enum: ['Individual', 'Corporate', 'Family']
  },
  coverageAmount: {
    type: Number,
    required: true,
    min: [0, 'Coverage amount cannot be negative'] // Validation
  },
  premiumAmount: {
    type: Number,
    required: true,
    min: 0
  },
  premiumFrequency: {
    type: String,
    required: true,
    trim: true,
    enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']
  },
  durationYears: {
    type: Number,
    required: true,
    min: 1
  },
  maxClaimAmount: {
    type: Number,
    required: true
  },
  waitingPeriodDays: {
    type: Number,
    required: true,
    default: 0
  },
  renewable: {
    type: Boolean,
    required: true
  },
  gracePeriodDays: {
    type: Number,
    required: true,
    default: 15
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// --- NEW FUNCTIONALITIES ---

// 1. Virtual Property: Calculate Total Annual Cost (Not stored in DB, calculated on fly)
policySchema.virtual('annualCost').get(function() {
  const map = {
    'Monthly': 12,
    'Quarterly': 4,
    'Half-Yearly': 2,
    'Yearly': 1
  };
  return this.premiumAmount * (map[this.premiumFrequency] || 0);
});

// 2. Instance Method: Check if a specific claim amount is valid
policySchema.methods.isValidClaim = function(claimAmount) {
  return this.isActive && claimAmount <= this.maxClaimAmount;
};

// 3. Static Method: Find all policies for a specific category
policySchema.statics.findByCategory = function(category) {
  return this.find({ policyCategory: category, isActive: true });
};

// 4. Pre-save hook: Only complex logic goes here (Removed simple trims/checks)
// We kept this just in case you need to do something strictly before saving
// that the Schema definitions can't handle.
policySchema.pre('save', async function(next) {
  // Example: If coverage is high, force grace period to be longer
  if (this.coverageAmount > 1000000 && this.gracePeriodDays < 30) {
    this.gracePeriodDays = 30;
  }
  next();
});

module.exports = mongoose.model('Policy', policySchema);