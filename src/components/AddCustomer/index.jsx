import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useNavigate } from 'react-router-dom';
import './index.css';

const AddCustomer = () => {
  const { addCustomer } = useData();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(phone.trim())) errs.phone = 'Enter a valid 10-digit phone number';
    if (!address.trim()) errs.address = 'Address is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    addCustomer({ name: name.trim(), phone: phone.trim(), address: address.trim() });
    setSuccess('Customer added successfully!');
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Add New Customer</h1>
      <div className="form-card royal-card">
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label>Customer Name *</label>
            <input className="form-input-royal" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <input className="form-input-royal" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number" />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label>Address *</label>
            <input className="form-input-royal" value={address} onChange={e => setAddress(e.target.value)} placeholder="Shop/House address" />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
          {success && <div className="login-success">{success}</div>}
          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn-primary-royal">Add Customer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
