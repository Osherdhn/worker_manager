import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile({ username }) {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/api/users/${username}`, {
                    headers: {
                        Authorization: token
                    }
                });
                setUserData(response.data);
            } catch (error) {
                setError('Failed to fetch user data');
                console.error('Error fetching user data:', error.response ? error.response.data : error.message);
            }
        };

        fetchUserData();
    }, [username]);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Password (hashed):</strong> {userData.password}</p>
        </div>
    );
}

export default UserProfile;
