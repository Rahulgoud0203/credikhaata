import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

export const DataProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => {
    const s = localStorage.getItem('ck_customers');
    return s ? JSON.parse(s) : [];
  });
  const [loans, setLoans] = useState(() => {
    const s = localStorage.getItem('ck_loans');
    return s ? JSON.parse(s) : [];
  });
  const [repayments, setRepayments] = useState(() => {
    const s = localStorage.getItem('ck_repayments');
    return s ? JSON.parse(s) : [];
  });

  useEffect(() => { localStorage.setItem('ck_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('ck_loans', JSON.stringify(loans)); }, [loans]);
  useEffect(() => { localStorage.setItem('ck_repayments', JSON.stringify(repayments)); }, [repayments]);

  const addCustomer = (c) => {
    setCustomers(prev => [...prev, { ...c, id: generateId(), createdAt: new Date().toISOString() }]);
  };

  const addLoan = (l) => {
    setLoans(prev => [...prev, { ...l, id: generateId(), remainingBalance: l.amount, createdAt: new Date().toISOString() }]);
  };

  const addRepayment = (r) => {
    const loan = loans.find(l => l.id === r.loanId);
    if (!loan) return { success: false, message: 'Loan not found' };
    if (r.amount > loan.remainingBalance) return { success: false, message: 'Amount exceeds remaining balance' };
    if (r.amount <= 0) return { success: false, message: 'Amount must be greater than 0' };

    setLoans(prev => prev.map(l => l.id === r.loanId ? { ...l, remainingBalance: l.remainingBalance - r.amount } : l));
    setRepayments(prev => [...prev, { ...r, id: generateId() }]);
    return { success: true, message: 'Repayment recorded' };
  };

  const getCustomerLoans = (customerId) => loans.filter(l => l.customerId === customerId);
  const getCustomerRepayments = (customerId) => repayments.filter(r => r.customerId === customerId);
  const getLoanRepayments = (loanId) => repayments.filter(r => r.loanId === loanId);

  const getCustomerOutstanding = (customerId) =>
    getCustomerLoans(customerId).reduce((sum, l) => sum + l.remainingBalance, 0);

  const isLoanOverdue = (loan) => loan.remainingBalance > 0 && new Date(loan.dueDate) < new Date();

  const getCustomerNextDueDate = (customerId) => {
    const unpaid = getCustomerLoans(customerId).filter(l => l.remainingBalance > 0);
    if (!unpaid.length) return null;
    unpaid.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return unpaid[0].dueDate;
  };

  const isCustomerOverdue = (customerId) =>
    getCustomerLoans(customerId).some(l => isLoanOverdue(l));

  return (
    <DataContext.Provider value={{
      customers, loans, repayments,
      addCustomer, addLoan, addRepayment,
      getCustomerLoans, getCustomerRepayments, getLoanRepayments,
      getCustomerOutstanding, getCustomerNextDueDate, isCustomerOverdue, isLoanOverdue,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
