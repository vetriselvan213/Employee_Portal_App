const express = require('express');
const { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .post(protect, authorize('Admin', 'Supervisor'), createEmployee)
    .get(protect, getEmployees);

router.route('/:id')
    .get(protect, getEmployeeById)
    .put(protect, authorize('Admin', 'Supervisor'), updateEmployee)
    .delete(protect, authorize('Admin'), deleteEmployee);

module.exports = router;
