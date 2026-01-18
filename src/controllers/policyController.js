const Policy = require('../models/policy');

// ==========================================
//  PUBLIC / SERVICE ENDPOINTS (Read Only)
// ==========================================

// 1. Get a single policy by Policy Code
// Usage: GET /api/policies/LIF001
const getPolicyByCode = async (req, res) => {
    try {
        const { code } = req.params;
        
        // We explicitly exclude '_id' and '__v' from the result to keep it clean
        const policy = await Policy.findOne({ policyCode: code })
            .select('-_id -__v'); 

        if (!policy) {
            return res.status(404).json({ message: `Policy '${code}' not found` });
        }
        
        // Return pure business data
        res.status(200).json(policy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get all Active policies (For Consumers/Frontend)
// Usage: GET /api/policies
const getAllActivePolicies = async (req, res) => {
    try {
        // Only return Active policies to public
        const policies = await Policy.find({ isActive: true })
            .select('-_id -__v');
            
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
//  ADMIN ENDPOINTS (Write & Management)
// ==========================================

// 3. Create Policy
// Usage: POST /api/admin/policies
const createPolicy = async (req, res) => {
    try {
        const newPolicy = new Policy(req.body);
        await newPolicy.save();
        
        // Return the created object without database artifacts
        const responseObj = newPolicy.toObject();
        delete responseObj._id;
        delete responseObj.__v;

        res.status(201).json(responseObj);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: `Policy Code '${req.body.policyCode}' already exists` });
        }
        res.status(400).json({ message: error.message });
    }
};

// 4. Update Policy by Code
// Usage: PUT /api/admin/policies/LIF001
const updatePolicyByCode = async (req, res) => {
    try {
        const { code } = req.params;

        // findOneAndUpdate returns the document *before* update unless { new: true } is set
        const updatedPolicy = await Policy.findOneAndUpdate(
            { policyCode: code },
            req.body,
            { new: true, runValidators: true }
        ).select('-_id -__v');

        if (!updatedPolicy) {
            return res.status(404).json({ message: `Policy '${code}' not found` });
        }
        res.status(200).json(updatedPolicy);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5. Delete Policy by Code
// Usage: DELETE /api/admin/policies/LIF001
const deletePolicyByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const deletedPolicy = await Policy.findOneAndDelete({ policyCode: code });

        if (!deletedPolicy) {
            return res.status(404).json({ message: `Policy '${code}' not found` });
        }
        res.status(200).json({ message: `Policy '${code}' deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Toggle Status (Soft Delete)
// Usage: PATCH /api/admin/policies/LIF001/toggle
const togglePolicyStatus = async (req, res) => {
    try {
        const { code } = req.params;
        const policy = await Policy.findOne({ policyCode: code });

        if (!policy) {
            return res.status(404).json({ message: `Policy '${code}' not found` });
        }

        policy.isActive = !policy.isActive;
        await policy.save();

        res.status(200).json({ 
            message: `Policy '${code}' is now ${policy.isActive ? 'Active' : 'Inactive'}`,
            currentStatus: policy.isActive
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 7. Get Full Stats (Admin Dashboard)
// Usage: GET /api/admin/stats
const getAdminStats = async (req, res) => {
    try {
        const stats = await Policy.aggregate([
            {
                $group: {
                    _id: "$policyType",
                    count: { $sum: 1 },
                    avgPremium: { $avg: "$premiumAmount" },
                    activeCount: { 
                        $sum: { $cond: ["$isActive", 1, 0] } 
                    }
                }
            }
        ]);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPolicyByCode,
    getAllActivePolicies,
    createPolicy,
    updatePolicyByCode,
    deletePolicyByCode,
    togglePolicyStatus,
    getAdminStats
};