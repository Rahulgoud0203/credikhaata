import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './index.css';

const AddRepayment = () => {
  const { customers, getCustomerLoans, addRepayment } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCustomer = searchParams.get('customer') || '';

  const [customerId, setCustomerId] = useState(preselectedCustomer);
  const [loanId, setLoanId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  const customerLoans = customerId ? getCustomerLoans(customerId).filter(l => l.remainingBalance > 0) : [];
  const selectedLoan = customerLoans.find(l => l.id === loanId);

  const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`;

  const validate = () => {
    const errs = {};
    if (!customerId) errs.customerId = 'Select a customer';
    if (!loanId) errs.loanId = 'Select a loan';
    if (!amount || parseFloat(amount) <= 0) errs.amount = 'Enter a valid amount';
    if (selectedLoan && parseFloat(amount) > selectedLoan.remainingBalance) errs.amount = 'Amount exceeds remaining balance';
    if (!date) errs.date = 'Date is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const result = addRepayment({ loanId, customerId, amount: parseFloat(amount), date });
    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setTimeout(() => navigate(`/customer/${customerId}`), 1000);
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Record Repayment</h1>
      <div className="form-card royal-card">
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label>Customer *</label>
            <select className="form-input-royal" value={customerId} onChange={e => { setCustomerId(e.target.value); setLoanId(''); }}>
              <option value="">— Select customer —</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.customerId && <span className="field-error">{errors.customerId}</span>}
          </div>

          <div className="form-group">
            <label>Loan *</label>
            <select className="form-input-royal" value={loanId} onChange={e => setLoanId(e.target.value)} disabled={!customerId}>
              <option value="">— Select loan —</option>
              {customerLoans.map(l => (
                <option key={l.id} value={l.id}>
                  {l.item} — Balance: {formatCurrency(l.remainingBalance)}
                </option>
              ))}
            </select>
            {customerLoans.length === 0 && customerId && <span className="field-hint">No unpaid loans for this customer</span>}
            {errors.loanId && <span className="field-error">{errors.loanId}</span>}
          </div>

          {selectedLoan && (
            <div className="loan-info-banner">
              <span>Remaining balance: <strong>{formatCurrency(selectedLoan.remainingBalance)}</strong></span>
            </div>
          )}

          <div className="form-group">
            <label>Repayment Amount (₹) *</label>
            <input className="form-input-royal" type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
            {errors.amount && <span className="field-error">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input className="form-input-royal" type="date" value={date} onChange={e => setDate(e.target.value)} />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>

          {feedback && (
            <div className={feedback.type === 'success' ? 'login-success' : 'login-error'}>
              {feedback.message}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn-primary-royal">Record Payment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRepayment;
