const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Supervisor', 'Employee'], default: 'Employee' },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    dateOfJoining: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    profilePhotoURL: { type: String, default: '' },
    notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
