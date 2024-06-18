import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/workerManager_db/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                setError('Failed to fetch users');
                console.error('Error fetching users:', error.response ? error.response.data : error.message);
            }
        };

        fetchUsers();
    }, []);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="user-list">
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Password (hashed):</strong> {user.password}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
