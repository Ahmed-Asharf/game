const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.route('/').post(adminController.adminSignUp);
router.route('/signIn').post(adminController.adminLogin);

module.exports = router;
