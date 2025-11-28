// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import EmployeeList from '../pages/EmployeeList';
import employeeReducer from '../store/employeeSlice';
import authReducer from '../store/authSlice';
import { vi, describe, it, expect } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock Redux Store
const createMockStore = (initialState) => {
    return configureStore({
        reducer: {
            employee: employeeReducer,
            auth: authReducer,
        },
        preloadedState: initialState,
    });
};

describe('EmployeeList Component', () => {
    it('should render employee list', async () => {
        const initialState = {
            auth: { user: { role: 'Admin', token: 'token' } },
            employee: {
                employees: [
                    { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Employee', department: 'IT' }
                ],
                isLoading: false,
                isError: false,
                message: '',
                totalPages: 1,
                currentPage: 1
            }
        };

        const store = createMockStore(initialState);

        axios.get.mockResolvedValue({ data: { employees: initialState.employee.employees, totalPages: 1, currentPage: 1 } });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <EmployeeList />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should hide delete button for Supervisor', () => {
        const initialState = {
            auth: { user: { role: 'Supervisor', token: 'token' } },
            employee: {
                employees: [
                    { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Employee', department: 'IT' }
                ],
                isLoading: false,
                isError: false,
                message: '',
                totalPages: 1,
                currentPage: 1
            }
        };

        const store = createMockStore(initialState);

        axios.get.mockResolvedValue({ data: { employees: initialState.employee.employees, totalPages: 1, currentPage: 1 } });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <EmployeeList />
                </BrowserRouter>
            </Provider>
        );

        // Edit button should be visible (Supervisor can edit)
        // Delete button should NOT be visible
        // Note: In my implementation, I used Trash2 icon. I should check for the button or icon.
        // The delete button has onClick handler.

        // Let's check if the delete button exists.
        // I can look for the Trash2 icon or the button with specific class or aria-label if I added one.
        // I didn't add aria-label. I'll check if I can find by role 'button' that contains the icon?
        // Or just check that there is only 1 link (Edit) and 0 buttons (Delete) in the actions cell?

        // Actually, I can check for the text "Delete" if I added it in mobile view?
        // Mobile view has "Delete" text. Desktop view has only icon.
        // Let's check for mobile view text if it renders?
        // Or better, add aria-label to buttons in the component for better testing (and accessibility).

        // For now, I will assume the test might be tricky without aria-labels.
        // I will check queryByRole('button') count?
        // There is a "Filters" button.
        // There is "Add Employee" link (which looks like button).

        // Let's just check that "Delete" text is NOT present (if mobile view is rendered or if I can rely on that).
        // Wait, "Delete" text IS present in mobile view code.
        // But `screen.queryByText('Delete')` might find it if mobile view is rendered.
        // Does JSDOM render both? Yes, it renders the HTML. CSS `hidden` might not stop it from being in the DOM unless I check visibility.
        // But `hidden md:block` means it's in the DOM.

        // However, the condition `{user?.role === 'Admin' && ...}` removes it from DOM.
        // So if I am Supervisor, it should NOT be in the DOM at all.

        expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });
});
