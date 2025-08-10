import React from 'react';
import './TransactionList.css';

// Receive handleDelete and handleEdit as props
function TransactionList({ transactions, handleEdit, handleDelete }) {
    if (!transactions || transactions.length === 0) {
        return <p style={{marginTop: '1rem'}}>No transactions yet.</p>;
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-IN', options);
    };

    return (
        <div>
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th className="cell-amount">Amount</th>
                        <th className="cell-actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(t => (
                        <tr key={t._id}>
                            <td>{formatDate(t.date)}</td>
                            <td>{t.category}</td>
                            <td>
                                <span className={t.type === 'expense' ? 'text-expense' : 'text-income'} style={{textTransform: 'capitalize'}}>
                                    {t.type}
                                </span>
                            </td>
                            <td className={`cell-amount ${t.type === 'expense' ? 'text-expense' : 'text-income'}`}>
                                {t.type === 'expense' ? '-' : '+'}₹{t.amount.toFixed(2)}
                            </td>
                            <td className="cell-actions">
                                {/* --- UPDATED BUTTONS --- */}
                                <button
                                    title="Edit"
                                    onClick={() => handleEdit(t)}
                                    className="action-btn edit-btn"
                                ></button>
                                <button
                                    title="Delete"
                                    onClick={() => handleDelete(t._id)}
                                    className="action-btn delete-btn"
                                ></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionList;