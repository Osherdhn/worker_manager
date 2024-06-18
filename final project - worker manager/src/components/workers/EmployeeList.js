import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeList({}) {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/employees', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEmployees(response.data);
            } catch (error) {
                setError('Failed to fetch employees');
                console.error('Error fetching employees:', error.response ? error.response.data : error.message);
            }
        };

        fetchEmployees();
    }, []);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="employee-list">
            <h2>Employee List</h2>
            <ul>
                {employees.map(employee => (
                    <li key={employee.id}>
                        <p><strong>Name:</strong> {employee.name}</p>
                        <p><strong>Position:</strong> {employee.position}</p>
                        <p><strong>Phone:</strong> {employee.phone}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EmployeeList;
