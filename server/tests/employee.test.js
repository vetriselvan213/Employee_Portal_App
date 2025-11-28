const request = require('supertest');
const express = require('express');
const { createEmployee, getEmployees, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const User = require('../models/User');

// Mock User model
jest.mock('../models/User', () => {
    const mockFind = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([]),
    };
    return {
        create: jest.fn(),
        find: jest.fn(() => mockFind),
        findById: jest.fn(),
        countDocuments: jest.fn(),
        deleteOne: jest.fn(),
    };
});

jest.mock('../utils/auth', () => ({
    hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
}));

const app = express();
app.use(express.json());

// Mock Middleware
const mockAuth = (role, userId = 'user123') => (req, res, next) => {
    req.user = { id: userId, role };
    next();
};

// Routes
app.post('/api/employees', mockAuth('Admin'), createEmployee);
app.get('/api/employees', mockAuth('Admin'), getEmployees);
app.put('/api/employees/:id', mockAuth('Admin'), updateEmployee);
app.delete('/api/employees/:id', mockAuth('Admin'), deleteEmployee);

app.post('/api/supervisor/employees', mockAuth('Supervisor', 'sup123'), createEmployee);
app.delete('/api/supervisor/employees/:id', mockAuth('Supervisor', 'sup123'), deleteEmployee);

describe('Employee Controller (Mocked)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create an employee as Admin', async () => {
        const User = require('../models/User');
        User.create.mockResolvedValue({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'Employee'
        });

        const res = await request(app)
            .post('/api/employees')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                employeeId: 'EMP001',
                department: 'IT',
                role: 'Employee'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.firstName).toEqual('John');
    });

    it('should allow Supervisor to create Employee', async () => {
        const User = require('../models/User');
        User.create.mockResolvedValue({
            firstName: 'Jane',
            lastName: 'Doe',
            managerId: 'sup123'
        });

        const res = await request(app)
            .post('/api/supervisor/employees')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                password: 'password123',
                employeeId: 'EMP002',
                department: 'HR',
                role: 'Employee'
            });

        expect(res.statusCode).toEqual(201);
        expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
            managerId: 'sup123'
        }));
    });

    it('should prevent Supervisor from deleting employee', async () => {
        const User = require('../models/User');
        User.findById.mockResolvedValue({
            _id: 'emp1',
            managerId: 'sup123',
            deleteOne: jest.fn()
        });

        const res = await request(app).delete('/api/supervisor/employees/emp1');
        expect(res.statusCode).toEqual(403);
    });
});
