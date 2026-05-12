import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './index.css';

const AddLoan = () => {
  const { customers, addLoan } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCustomer = searchParams.get('customer') || '';

  const [customerId, setCustomerId] = useState(preselectedCustomer);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const validate = () => {
    const errs = {};
    if (!customerId) errs.customerId = 'Select a customer';
    if (!item.trim()) errs.item = 'Item is required';
    if (!amount || parseFloat(amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!dueDate) errs.dueDate = 'Due date is required';
    else if (new Date(dueDate) < new Date(new Date().toDateString())) errs.dueDate = 'Due date cannot be in the past';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    addLoan({ customerId, item: item.trim(), amount: parseFloat(amount), dueDate });
    setSuccess('Loan recorded successfully!');
    setTimeout(() => navigate(preselectedCustomer ? `/customer/${customerId}` : '/'), 1000);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Add Credit Sale</h1>
      <div className="form-card royal-card">
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label>Customer *</label>
            <select className="form-input-royal" value={customerId} onChange={e => setCustomerId(e.target.value)}>
              <option value="">— Select customer —</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.customerId && <span className="field-error">{errors.customerId}</span>}
          </div>
          <div className="form-group">
            <label>Item Sold *</label>
            <input className="form-input-royal" value={item} onChange={e => setItem(e.target.value)} placeholder="e.g. 5kg Rice" />
            {errors.item && <span className="field-error">{errors.item}</span>}
          </div>
          <div className="form-group">
            <label>Loan Amount (₹) *</label>
            <input className="form-input-royal" type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
            {errors.amount && <span className="field-error">{errors.amount}</span>}
          </div>
          <div className="form-group">
            <label>Due Date *</label>
            <input className="form-input-royal" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
          </div>
          {success && <div className="login-success">{success}</div>}
          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn-primary-royal">Record Loan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLoan;
