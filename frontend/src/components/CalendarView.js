import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css'; // Import the new CSS file

function CalendarView({ transactions }) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // A more robust way to compare dates, ignoring timezone issues
    const isSameDay = (dateA, dateB) => {
        return dateA.getFullYear() === dateB.getFullYear() &&
               dateA.getMonth() === dateB.getMonth() &&
               dateA.getDate() === dateB.getDate();
    };

    const dailyTransactions = useMemo(() => {
        return transactions.filter(t => {
            // Add 'T00:00:00' to ensure date is parsed in local time, not UTC
            const transactionDate = new Date(t.date + 'T00:00:00');
            return isSameDay(transactionDate, selectedDate);
        });
    }, [transactions, selectedDate]);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const hasTransactions = transactions.some(t => {
                const transactionDate = new Date(t.date + 'T00:00:00');
                return isSameDay(transactionDate, date);
            });
            return hasTransactions ? <div className="transaction-dot"></div> : null;
        }
    };

    return (
        <div className="calendar-view-container">
            <div className="calendar-wrapper">
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                />
            </div>
            <div className="daily-transactions-wrapper">
                <h3>Transactions for {selectedDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                {dailyTransactions.length > 0 ? (
                    <ul className="daily-transactions-list">
                        {dailyTransactions.map(t => (
                            <li key={t._id}>
                                <strong className={t.type === 'expense' ? 'text-expense' : 'text-income'}>
                                    {t.category}
                                </strong>
                                <span>₹{t.amount.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No transactions on this day.</p>
                )}
            </div>
        </div>
    );
}

export default CalendarView;