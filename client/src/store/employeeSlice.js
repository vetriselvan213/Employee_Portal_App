import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/employees';

const initialState = {
    employees: [],
    supervisors: [],
    currentEmployee: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    totalPages: 1,
    currentPage: 1,
};

// Get Employees
export const getEmployees = createAsyncThunk('employees/getAll', async (params, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params,
        };
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get Supervisors and Admins (for manager dropdown)
export const getSupervisors = createAsyncThunk('employees/getSupervisors', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;

        // Fetch both Supervisors and Admins
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.get(API_URL, {
            ...config,
            params: { limit: 100 }
        });

        // Filter to get only Supervisors and Admins
        const managersAndAdmins = response.data.employees.filter(
            emp => emp.role === 'Supervisor' || emp.role === 'Admin'
        );

        return managersAndAdmins;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get Single Employee Details
export const getEmployeeDetails = createAsyncThunk('employees/getDetails', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(API_URL + '/' + id, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create Employee
export const createEmployee = createAsyncThunk('employees/create', async (employeeData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL, employeeData, config);
        toast.success('Employee created successfully');
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
});

// Update Employee
export const updateEmployee = createAsyncThunk('employees/update', async ({ id, employeeData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(API_URL + '/' + id, employeeData, config);
        toast.success('Employee updated successfully');
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete Employee
export const deleteEmployee = createAsyncThunk('employees/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        await axios.delete(API_URL + '/' + id, config);
        toast.success('Employee deleted successfully');
        return id;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
});

export const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.currentEmployee = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEmployees.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getEmployees.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.employees = action.payload.employees;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(getEmployees.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getSupervisors.fulfilled, (state, action) => {
                state.supervisors = action.payload;
            })
            .addCase(getEmployeeDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getEmployeeDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentEmployee = action.payload;
            })
            .addCase(getEmployeeDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.employees.push(action.payload);
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.employees.findIndex((employee) => employee._id === action.payload._id);
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.employees = state.employees.filter((employee) => employee._id !== action.payload);
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = employeeSlice.actions;
export default employeeSlice.reducer;
