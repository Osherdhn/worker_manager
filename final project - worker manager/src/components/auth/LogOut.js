import React from 'react';

function LogOut({ removeToken }) {
  const handleLogout = () => {
    removeToken();
  };

  return (
      <button onClick={handleLogout} className="btn btn-outline-danger">Log Out</button>
  );
}

export default LogOut;
