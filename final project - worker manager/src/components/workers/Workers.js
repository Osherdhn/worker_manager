import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Workers.css';

function Workers({ token }) {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('V.jpg');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editData, setEditData] = useState({ name: '', position: '', phone: '', email: '', image: '' });

  useEffect(() => {
    axios.get('http://localhost:3001/api/workerManager_db/employees', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      });
  }, [token]);

  const addEmployee = () => {
    axios.post('http://localhost:3001/api/workerManager_db/employees', { name, position, phone, image, email }, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setEmployees([...employees, { id: response.data.insertId, name, position, phone, image, email }]);
        setName('');
        setPosition('');
        setPhone('');
        setEmail('');
        setImage('V.jpg');
        setSuccess('Employee added successfully');
        setError('');
      })
      .catch(error => {
        setError('Adding employee failed');
        console.error('Adding employee failed:', error);
        setSuccess('');
      });
  };

  const deleteEmployee = (id) => {
    axios.delete(`http://localhost:3001/api/workerManager_db/employees/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setEmployees(employees.filter(employee => employee.id !== id));
        setSuccess('Employee deleted successfully');
        setError('');
      })
      .catch(error => {
        setError('Error deleting employee');
        console.error('Error deleting employee:', error);
        setSuccess('');
      });
  };

  const startEdit = (employee) => {
    setEditingEmployee(employee.id);
    setEditData({ name: employee.name, position: employee.position, phone: employee.phone, email: employee.email, image: employee.image });
  };

  const cancelEdit = () => {
    setEditingEmployee(null);
    setEditData({ name: '', position: '', phone: '', email: '', image: '' });
  };

  const updateEmployee = (id) => {
    axios.put(`http://localhost:3001/api/workerManager_db/employees/${id}`, editData, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setEmployees(employees.map(employee => employee.id === id ? { ...employee, ...editData } : employee));
        setEditingEmployee(null);
        setEditData({ name: '', position: '', phone: '', email: '', image: '' });
        setSuccess('Employee updated successfully');
        setError('');
      })
      .catch(error => {
        setError('Updating employee failed');
        console.error('Updating employee failed:', error);
        setSuccess('');
      });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  return (
    <div className="container center m-3">
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {success && <div className="alert alert-success" role="alert">{success}</div>}
      <div className="d-flex text-center m-5 p-3 bg-light row">
        <input className="col-md col-sm-12 p-2"
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        
        <input className="col-md col-sm-12 p-2"
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <input className="col-md col-sm-12 p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input className="col-12 p-2"
          type="text"
          placeholder="details"
          value={position}
          onChange={e => setPosition(e.target.value)}
        />
        <button className="col-12 p-2 btn btn-outline-success" onClick={addEmployee}>Add Employee</button>
      </div>
      <div className="container list-group m-5">
        {employees.map(employee => (
          <div key={employee.id} className="list-group-item">
            <div className="d-flex row justify-content-between">
              <div className='col-12'>
                <h5>{employee.name}</h5>
                <p>{employee.position}</p>
                <p>{employee.phone}</p>
                <p>{employee.email}</p>
              </div>
              <div className='col-12'>
                <button onClick={() => startEdit(employee)} className="btn btn-outline-primary m-1">Update</button>
                <button onClick={() => deleteEmployee(employee.id)} className="btn btn-outline-danger m-1">Delete</button>
              </div>
            </div>
            {editingEmployee === employee.id && (
              <form onSubmit={(e) => { e.preventDefault(); updateEmployee(employee.id); }}>
                <div>
                  <div className="form-group m-1">
                    <label htmlFor="editName">Name</label>
                    <input type="text" className="form-control" id="editName" name="name" value={editData.name} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group m-1">
                    <label htmlFor="editPosition">Position</label>
                    <input type="text" className="form-control" id="editPosition" name="position" value={editData.position} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group m-1">
                    <label htmlFor="editPhone">Phone</label>
                    <input type="text" className="form-control" id="editPhone" name="phone" value={editData.phone} onChange={handleEditChange} />
                  </div>
                  <div className="form-group m-1">
                    <label htmlFor="editEmail">Email</label>
                    <input type="email" className="form-control" id="editEmail" name="email" value={editData.email} onChange={handleEditChange} required />
                  </div>
                </div>
                <div className='col-4'>
                  <button type="submit" className="btn btn-success m-1">Save</button>
                  <button type="button" className="btn btn-secondary m-1" onClick={cancelEdit}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workers;