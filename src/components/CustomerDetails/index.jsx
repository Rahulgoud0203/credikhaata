import { useParams, Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import './index.css';

const CustomerDetails = () => {
  const { id } = useParams();
  const { customers, getCustomerLoans, getLoanRepayments, isLoanOverdue, getCustomerOutstanding } = useData();

  const customer = customers.find(c => c.id === id);
  if (!customer) return <div className="page-container"><p>Customer not found.</p><Link to="/" className="action-link">← Back</Link></div>;

  const loans = getCustomerLoans(customer.id);
  const outstanding = getCustomerOutstanding(customer.id);

  const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`;
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>

      <div className="customer-header-card royal-card">
        <div className="customer-info">
          <h1 className="page-title">{customer.name}</h1>
          <p className="customer-meta">📞 {customer.phone} &nbsp;|&nbsp; 📍 {customer.address}</p>
        </div>
        <div className="customer-summary">
          <div className="summary-item">
            <span className="stat-label">Outstanding</span>
            <span className="stat-value gold-accent">{formatCurrency(outstanding)}</span>
          </div>
          <div className="summary-item">
            <span className="stat-label">Total Loans</span>
            <span className="stat-value">{loans.length}</span>
          </div>
        </div>
      </div>

      <div className="detail-actions">
        <Link to={`/add-loan?customer=${customer.id}`} className="btn-primary-royal">+ New Loan</Link>
        <Link to={`/add-repayment?customer=${customer.id}`} className="btn-secondary-royal">Record Repayment</Link>
      </div>

      <h2 className="section-title">Credit Ledger</h2>

      {loans.length === 0 ? (
        <div className="empty-state">
          <p>No loans recorded yet.</p>
        </div>
      ) : (
        <div className="loans-list">
          {loans.map(loan => {
            const reps = getLoanRepayments(loan.id);
            const overdue = isLoanOverdue(loan);

            return (
              <div key={loan.id} className={`loan-card royal-card ${overdue ? 'loan-overdue' : ''}`}>
                <div className="loan-header">
                  <div>
                    <h3 className="loan-item">{loan.item}</h3>
                    <span className="loan-date">Issued: {formatDate(loan.createdAt)}</span>
                  </div>
                  <div className="loan-amounts">
                    <span className="loan-total">Amount: {formatCurrency(loan.amount)}</span>
                    <span className={`loan-remaining ${loan.remainingBalance > 0 ? 'has-balance' : 'cleared'}`}>
                      Balance: {formatCurrency(loan.remainingBalance)}
                    </span>
                  </div>
                </div>

                <div className="loan-meta">
                  <span>Due: {formatDate(loan.dueDate)}</span>
                  {overdue && <span className="badge-overdue">⚠ Overdue</span>}
                  {loan.remainingBalance === 0 && <span className="badge-uptodate">✓ Paid</span>}
                </div>

                {reps.length > 0 && (
                  <div className="repayments-section">
                    <h4 className="repayments-title">Repayments</h4>
                    <div className="repayments-list">
                      {reps.map(r => (
                        <div key={r.id} className="repayment-row">
                          <span>{formatDate(r.date)}</span>
                          <span className="repayment-amount">{formatCurrency(r.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
