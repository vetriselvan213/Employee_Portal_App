import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployees, deleteEmployee, reset } from '../store/employeeSlice';
import useDebounce from '../hooks/useDebounce';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';
import { Trash2, Edit, Plus, Search, Mail, Briefcase, Users, MoreVertical, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
    const dispatch = useDispatch();
    const { employees, isLoading, isError, message, totalPages, currentPage } = useSelector((state) => state.employee);
    const { user } = useSelector((state) => state.auth);

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [roleFilter, setRoleFilter] = useState('');
    const [showMyTeam, setShowMyTeam] = useState(false);
    const [page, setPage] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    useEffect(() => {
        if (isError) {
            console.error(message);
        }
        const params = { search: debouncedSearch, page, role: roleFilter };
        if (showMyTeam && user?.role === 'Supervisor') {
            params.managerId = user._id;
        }
        dispatch(getEmployees(params));
        return () => {
            dispatch(reset());
        };
    }, [isError, message, dispatch, debouncedSearch, page, roleFilter, showMyTeam, user]);

    const handleDeleteClick = (id) => {
        setEmployeeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (employeeToDelete) {
            dispatch(deleteEmployee(employeeToDelete));
            setEmployeeToDelete(null);
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Supervisor': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                <Navbar />
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden">{/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Employees</h2>
                            <p className="text-gray-500 mt-1">Manage your team members and their roles</p>
                        </div>
                        {(user?.role === 'Admin' || user?.role === 'Supervisor') && (
                            <Link
                                to="/employees/add"
                                className="inline-flex items-center bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
                            >
                                <Plus className="mr-2" size={20} />
                                Add Employee
                            </Link>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            {user?.role === 'Supervisor' && (
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="myTeam"
                                        checked={showMyTeam}
                                        onChange={(e) => setShowMyTeam(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="myTeam" className="ml-2 text-sm font-medium text-gray-900">My Team Only</label>
                                </div>
                            )}
                            <div className="relative min-w-[200px]">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="">All Roles</option>
                                    <option value="Employee">Employee</option>
                                    <option value="Supervisor">Supervisor</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-auto">
                                <div className="overflow-auto ">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {employees.map((employee) => (
                                                <tr key={employee._id} className="hover:bg-gray-50/80 transition-colors group">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-4 shadow-md ring-2 ring-white">
                                                                {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {employee.firstName} {employee.lastName}
                                                                </div>
                                                                <div className="text-xs text-gray-500">ID: {employee.employeeId}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Mail size={16} className="mr-2 text-gray-400" />
                                                            {employee.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleColor(employee.role)}`}>
                                                            {employee.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Briefcase size={16} className="mr-2 text-gray-400" />
                                                            {employee.department}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {employee.status || 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Link
                                                                to={`/employees/view/${employee._id}`}
                                                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                            >
                                                                <Eye size={18} />
                                                            </Link>
                                                            {user?.role !== 'Employee' && (
                                                                <Link
                                                                    to={`/employees/edit/${employee._id}`}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                >
                                                                    <Edit size={18} />
                                                                </Link>
                                                            )}
                                                            {user?.role === 'Admin' && (
                                                                <button
                                                                    onClick={() => handleDeleteClick(employee._id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {employees.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="h-10 w-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No employees found</h3>
                                        <p className="text-gray-500 mt-1">Try adjusting your search or add a new employee.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-6">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {employees.map((employee) => (
                                    <div key={employee._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-3 shadow-md">
                                                    {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{employee.firstName} {employee.lastName}</div>
                                                    <div className="text-xs text-gray-500">ID: {employee.employeeId}</div>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail size={16} className="mr-3 text-gray-400" />
                                                {employee.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Briefcase size={16} className="mr-3 text-gray-400" />
                                                {employee.department}
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getRoleColor(employee.role)}`}>
                                                    {employee.role}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                            <Link
                                                to={`/employees/view/${employee._id}`}
                                                className="flex-1 flex items-center justify-center text-gray-700 bg-gray-50 hover:bg-gray-100 py-2.5 rounded-xl transition-colors font-medium text-sm"
                                            >
                                                <Eye size={16} className="mr-2" />
                                                View
                                            </Link>
                                            {user?.role !== 'Employee' && (
                                                <Link
                                                    to={`/employees/edit/${employee._id}`}
                                                    className="flex-1 flex items-center justify-center text-blue-700 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl transition-colors font-medium text-sm"
                                                >
                                                    <Edit size={16} className="mr-2" />
                                                    Edit
                                                </Link>
                                            )}
                                            {user?.role === 'Admin' && (
                                                <button
                                                    onClick={() => handleDeleteClick(employee._id)}
                                                    className="flex-1 flex items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 py-2.5 rounded-xl transition-colors font-medium text-sm"
                                                >
                                                    <Trash2 size={16} className="mr-2" />
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={confirmDelete}
                        title="Delete Employee"
                        message="Are you sure you want to delete this employee? This action cannot be undone."
                        confirmText="Delete"
                        isDanger={true}
                    />
                </main>
            </div>
        </div>
    );
};

export default EmployeeList;
