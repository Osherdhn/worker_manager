import React, { useState, useEffect } from "react";
import Title from "../general/Title";
import FilterBar from "./FilterBar";
import Card from "./Card/Card";
import axios from 'axios';
import "./MainPage.css";

function MainPage({ token }) {
  const [data, setData] = useState([]);
  const [origData, setOrigData] = useState([]);
  const [mainPage, setMain] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/workerManager_db/employees', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setData(response.data);
        setOrigData(response.data);
        setMain(response.data);
      })
      .catch(error => {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      });
  }, [token]);

  function searchMain(value) {
    let result = [...origData];
    if (value.length > 0) {
      result = origData.filter((data) =>
        data.name.toLowerCase().includes(value.toLowerCase()) ||
        data.position.toLowerCase().includes(value.toLowerCase())
      );
    }
    setMain(result);
  }

  return (
    <>
      <Title mainTxt="Worker Manager">
        <p className="fs-2">
          Improve Your Management
        </p>
      </Title>

      <div className="search-bar-container">
        <FilterBar search={searchMain} />
      </div>
      
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      
      <div className="list-group">
        {mainPage.map((card) => (
          <div className="list-group-item" key={card.id}>
            <Card
              name={card.name}
              position={card.position}
              phone={card.phone}
              email={card.email}
              vacations={card.vacations}
            />
          </div>
        ))}
      </div>
      
    </>
  );
}

export default MainPage;
