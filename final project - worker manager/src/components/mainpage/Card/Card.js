import React, { useState, useEffect } from 'react';
import axios from 'axios';
import V from "./V.jpg"
import './Card.css';


function Card({ id, name, position, phone, email, token }) {
  const [details, setDetails] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/api/workerManager_db/employee_details/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      if (response.data.length > 0) {
        setDetails(response.data[0].details);
      }
    })
    .catch(error => {
      console.error('Error fetching employee details:', error);
    });
  }, [id, token]);

  return (
      <div className="tag row bg-secondary">
        <div className="img-bg col-md-5 col-sm-12 bg-warning">
          <img src={V} className="img" alt={ name} />
        </div>
        <div className="col-md-6 col-sm-12 text-white">
          <div className="card-body">
            <h5 className="card-title bi bi-person-fill m-2 p-2"> {name}</h5>
            
            <p className="card-text bi bi-telephone-fill m-2 p-2"> {phone}</p>
            <p className="card-text bi bi-check m-2 p-1"> {email}</p>
            <p className="card-text bi bi-tablet-landscape-fill m-2 p-2"> {position}</p>
            
          </div>
        </div>
    </div>
  );
}

export default Card;
