import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createEmployee, updateEmployee, getSupervisors, getEmployeeDetails, reset } from '../store/employeeSlice';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ArrowLeft, Save, User, Mail, Lock, Briefcase, IdCard, Building, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Validation Schema
const getValidationSchema = (isEditMode) => {
    return yup.object().shape({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password: isEditMode
            ? yup.string().notRequired()
            : yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        employeeId: yup.string().required('Employee ID is required'),
        department: yup.string().required('Department is required'),
        role: yup.string().required('Role is required'),
        managerId: yup.string().nullable(),
        dateOfJoining: yup.string().required('Date of Joining is required'),
        status: yup.string().required('Status is required'),
    });
};

const EmployeeForm = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isEditMode = location.pathname.includes('/edit');
    const isViewMode = location.pathname.includes('/view');
    // const isAddMode = !isEditMode && !isViewMode;

    const { supervisors, currentEmployee, isLoading } = useSelector((state) => state.employee);
    const { user } = useSelector((state) => state.auth);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(getValidationSchema(isEditMode)),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            employeeId: '',
            department: '',
            role: 'Employee',
            managerId: '',
            dateOfJoining: '',
            status: 'Active',
        }
    });

    useEffect(() => {
        if (user?.role === 'Admin' || user?.role === 'Supervisor') {
            dispatch(getSupervisors());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (id) {
            dispatch(getEmployeeDetails(id));
        }
        return () => {
            dispatch(reset());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if ((isEditMode || isViewMode) && currentEmployee) {
            setValue('firstName', currentEmployee.firstName);
            setValue('lastName', currentEmployee.lastName);
            setValue('email', currentEmployee.email);
            setValue('employeeId', currentEmployee.employeeId);
            setValue('department', currentEmployee.department);
            setValue('role', currentEmployee.role);
            setValue('managerId', currentEmployee.managerId || '');
            setValue('dateOfJoining', currentEmployee.dateOfJoining ? currentEmployee.dateOfJoining.split('T')[0] : '');
            setValue('status', currentEmployee.status || 'Active');
        }
    }, [currentEmployee, isEditMode, isViewMode, setValue]);

    const onSubmit = (data) => {
        if (isViewMode) return;

        if (isEditMode) {
            const dataToUpdate = { ...data };
            if (!dataToUpdate.password) {
                delete dataToUpdate.password;
            }
            dispatch(updateEmployee({ id, employeeData: dataToUpdate })).then((res) => {
                if (!res.error) {
                    toast.success('Employee updated successfully');
                    navigate('/employees');
                } else {
                    toast.error(res.payload || 'Failed to update employee');
                }
            });
        } else {
            dispatch(createEmployee(data)).then((res) => {
                if (!res.error) {
                    toast.success('Employee created successfully');
                    navigate('/employees');
                } else {
                    toast.error(res.payload || 'Failed to create employee');
                }
            });
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <button
                                onClick={() => navigate('/employees')}
                                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-2 group-hover:border-gray-400 transition-colors">
                                    <ArrowLeft size={16} />
                                </div>
                                <span className="font-medium">Back to Employees</span>
                            </button>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {isViewMode ? 'View Employee' : isEditMode ? 'Edit Employee' : 'Add New Employee'}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                {isViewMode ? 'Employee details' : isEditMode ? 'Update employee details' : 'Create a new account for your team member'}
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <User className="mr-2 text-blue-600" size={20} />
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                {...register('firstName')}
                                                disabled={isViewMode}
                                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                                                placeholder="John"
                                            />
                                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                {...register('lastName')}
                                                disabled={isViewMode}
                                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`}
                                                placeholder="Doe"
                                            />
                                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Lock className="mr-2 text-blue-600" size={20} />
                                        Account Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    {...register('email')}
                                                    disabled={isViewMode}
                                                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                                    placeholder="john.doe@company.com"
                                                />
                                            </div>
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                        </div>
                                        {!isViewMode && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Password {isEditMode && <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>}</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                                    <input
                                                        type="password"
                                                        {...register('password')}
                                                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Briefcase className="mr-2 text-blue-600" size={20} />
                                        Job Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                                            <div className="relative">
                                                <IdCard className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    {...register('employeeId')}
                                                    disabled={isViewMode}
                                                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white ${errors.employeeId ? 'border-red-500' : 'border-gray-200'}`}
                                                    placeholder="EMP-001"
                                                />
                                            </div>
                                            {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                            <div className="relative">
                                                <Building className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    {...register('department')}
                                                    disabled={isViewMode}
                                                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white ${errors.department ? 'border-red-500' : 'border-gray-200'}`}
                                                    placeholder="Engineering"
                                                />
                                            </div>
                                            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                            <div className="relative">
                                                <select
                                                    {...register('role')}
                                                    disabled={isViewMode}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white appearance-none"
                                                >
                                                    <option value="Employee">Employee</option>
                                                    <option value="Supervisor">Supervisor</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Users className="mr-2 text-blue-600" size={20} />
                                        Employment Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                                            {isViewMode ? (
                                                <input
                                                    type="text"
                                                    value={
                                                        currentEmployee?.managerId
                                                            ? supervisors.find(s => s._id === currentEmployee.managerId)
                                                                ? `${supervisors.find(s => s._id === currentEmployee.managerId).firstName} ${supervisors.find(s => s._id === currentEmployee.managerId).lastName}`
                                                                : 'No Manager Assigned'
                                                            : 'No Manager Assigned'
                                                    }
                                                    disabled
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700"
                                                />
                                            ) : (
                                                <div className="relative">
                                                    <select
                                                        {...register('managerId')}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white appearance-none"
                                                    >
                                                        <option value="">Select Manager</option>
                                                        {supervisors.map((sup) => (
                                                            <option key={sup._id} value={sup._id}>
                                                                {sup.firstName} {sup.lastName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                </div>
                                            )}
                                            {errors.managerId && <p className="text-red-500 text-xs mt-1">{errors.managerId.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining</label>
                                            <input
                                                type="date"
                                                {...register('dateOfJoining')}
                                                disabled={isViewMode}
                                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white ${errors.dateOfJoining ? 'border-red-500' : 'border-gray-200'}`}
                                            />
                                            {errors.dateOfJoining && <p className="text-red-500 text-xs mt-1">{errors.dateOfJoining.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                            <div className="relative">
                                                <select
                                                    {...register('status')}
                                                    disabled={isViewMode}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 focus:bg-white appearance-none"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                {!isViewMode && (
                                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 flex items-center justify-center"
                                            disabled={isLoading}
                                        >
                                            <Save className="mr-2" size={20} />
                                            {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Employee' : 'Create Employee')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/employees')}
                                            className="px-8 py-3.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EmployeeForm;
