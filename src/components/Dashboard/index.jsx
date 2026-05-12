import { useData } from '@/context/DataContext';
import { Link } from 'react-router-dom';
import './index.css';

const Dashboard = () => {
  const { customers, getCustomerOutstanding, getCustomerNextDueDate, isCustomerOverdue } = useData();

  const totalOutstanding = customers.reduce((sum, c) => sum + getCustomerOutstanding(c.id), 0);
  const overdueCount = customers.filter(c => isCustomerOverdue(c.id)).length;

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;
  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <Link to="/add-customer" className="btn-secondary-royal">+ New Customer</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Customers</span>
          <span className="stat-value">{customers.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Outstanding</span>
          <span className="stat-value gold-accent">{formatCurrency(totalOutstanding)}</span>
        </div>
        <div className="stat-card stat-card-danger">
          <span className="stat-label">Overdue Accounts</span>
          <span className="stat-value">{overdueCount}</span>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="empty-state">
          <h3>No customers yet</h3>
          <p>Add your first customer to start tracking credit sales.</p>
          <Link to="/add-customer" className="btn-primary-royal">Add Customer</Link>
        </div>
      ) : (
        <div className="royal-card mt-6 overflow-x-auto">
          <table className="table-royal">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Outstanding</th>
                <th>Next Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => {
                const outstanding = getCustomerOutstanding(customer.id);
                const nextDue = getCustomerNextDueDate(customer.id);
                const overdue = isCustomerOverdue(customer.id);

                return (
                  <tr key={customer.id} className={overdue ? 'row-overdue' : ''}>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{customer.name}</span>
                        <span className="customer-phone">{customer.phone}</span>
                      </div>
                    </td>
                    <td className={outstanding > 0 ? 'font-semibold' : ''}>
                      {formatCurrency(outstanding)}
                    </td>
                    <td>{formatDate(nextDue)}</td>
                    <td>
                      {outstanding === 0 ? (
                        <span className="badge-uptodate">✓ Clear</span>
                      ) : overdue ? (
                        <span className="badge-overdue">⚠ Overdue</span>
                      ) : (
                        <span className="badge-uptodate">✓ Up-to-date</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/customer/${customer.id}`} className="action-link">View</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
