import React, { useState, useEffect } from 'react';
import {Routes, Route, Navigate } from 'react-router-dom';
import Header from "./components/general/Header";
import BottomLine from "./components/general/BottomLine";
import MainPage from "./components/mainpage/MainPage";
import About from "./components/about/About";
import Workers from './components/workers/Workers';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/user/UserProfile';
import UserList from './components/user/UserList';
import AdminDashboard from './components/admin/AdminDashboard';
import { parseJwt } from './components/general/utils';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  const removeToken = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  const checkToken = () => {
    if (token) {
      const decodedToken = parseJwt(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken && decodedToken.exp < currentTime) {
        removeToken();
      }
    }
  };

  useEffect(() => {
    checkToken();
  }, [token]);

  return (

      <>
        <Header />
        <Routes>
          <Route path="/" element={token ? <MainPage token={token} removeToken={removeToken} /> : <Navigate to="/login" />} />
          <Route path="/workers" element={token ? <Workers token={token} /> : <Navigate to="/login" />} />
          <Route path="/about" element={token ? <About /> : <Navigate to="/login" />} />
          <Route path="/profile/:username" element={token ? <UserProfile /> : <Navigate to="/login" />} />
          <Route path="/users" element={token ? <UserList /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setToken={saveToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={token ? <AdminDashboard token={token} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <BottomLine removeToken={removeToken} />
      </>

  );
}

export default App;
