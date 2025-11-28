const User = require('../models/User');
const { hashPassword } = require('../utils/auth');

// Create Employee (Admin & Supervisor)
const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, password, employeeId, department, role, managerId, dateOfJoining, status } = req.body;

        // RBAC Check: Supervisors cannot create Admins or Supervisors
        if (req.user.role === 'Supervisor' && (role === 'Admin' || role === 'Supervisor')) {
            return res.status(403).json({ message: 'Supervisors can only create Employees' });
        }

        const hashedPassword = await hashPassword(password);

        // Determine managerId based on role and creator
        let finalManagerId = managerId;

        // If Supervisor is creating an employee, set managerId to themselves
        if (req.user.role === 'Supervisor') {
            finalManagerId = req.user.id;
        }
        // If Admin is creating a Supervisor and no manager specified, set to Admin
        else if (req.user.role === 'Admin' && role === 'Supervisor' && !managerId) {
            finalManagerId = req.user.id;
        }

        const employee = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            employeeId,
            department,
            role: role || 'Employee',
            managerId: finalManagerId,
            dateOfJoining,
            status
        });

        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Employees (with pagination & search)
const getEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role, managerId } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
                { employeeId: { $regex: search, $options: 'i' } },
            ];
        }

        if (role) {
            query.role = role;
        }

        if (managerId) {
            query.managerId = managerId;
        }

        const employees = await User.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-password');

        const count = await User.countDocuments(query);

        res.json({
            employees,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Employee
const getEmployeeById = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id).select('-password');
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Employee
const updateEmployee = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);

        if (employee) {
            // RBAC: Supervisor can only update their own employees
            if (req.user.role === 'Supervisor' && employee.managerId?.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to update this employee' });
            }

            Object.assign(employee, req.body);
            if (req.body.password) {
                employee.password = await hashPassword(req.body.password);
            }

            const updatedEmployee = await employee.save();
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);

        if (employee) {
            // RBAC: Supervisor cannot delete
            if (req.user.role === 'Supervisor') {
                return res.status(403).json({ message: 'Supervisors cannot delete employees' });
            }

            await employee.deleteOne();
            res.json({ message: 'Employee removed' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee };
