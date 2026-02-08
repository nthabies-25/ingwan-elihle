const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

// Public routes
router.post('/submit', enquiryController.submitEnquiry);

// Protected routes (add authentication middleware later)
router.get('/', enquiryController.getAllEnquiries);
router.get('/stats', enquiryController.getEnquiryStats);
router.get('/:id', enquiryController.getEnquiryById);
router.patch('/:id/status', enquiryController.updateEnquiryStatus);

module.exports = router;