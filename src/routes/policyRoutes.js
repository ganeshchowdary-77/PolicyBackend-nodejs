const express = require('express');
const router = express.Router();
const controller = require('../controllers/policyController');

// =======================================================
//  PUBLIC / SERVICE ROUTES (The "Consumption" Layer)
//  These routes allow other services to fetch data easily
// =======================================================

// List all active policies
// GET /api/policies
router.get('/', controller.getAllActivePolicies);

// Get specific policy details
// GET /api/policies/LIF001
router.get('/:code', controller.getPolicyByCode);


// =======================================================
//  ADMIN ROUTES (The "Management" Layer)
//  prefixed with /admin to indicate restricted access
// =======================================================

// Dashboard Stats
// GET /api/policies/admin/stats
router.get('/admin/stats', controller.getAdminStats);

// Create New Policy
// POST /api/policies/admin/create
router.post('/admin/create', controller.createPolicy);

// Update Policy
// PUT /api/policies/admin/LIF001
router.put('/admin/:code', controller.updatePolicyByCode);

// Toggle Active/Inactive
// PATCH /api/policies/admin/LIF001/toggle
router.patch('/admin/:code/toggle', controller.togglePolicyStatus);

// Hard Delete Policy
// DELETE /api/policies/admin/LIF001
router.delete('/admin/:code', controller.deletePolicyByCode);

module.exports = router;