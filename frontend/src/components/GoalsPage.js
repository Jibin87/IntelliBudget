import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './GoalsPage.css';

function GoalsPage() {
    const [goals, setGoals] = useState([]);
    const [name, setName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const fetchGoals = useCallback(async () => {
        setLoading(true);
        try {
            const config = { headers: { 'x-access-token': token } };
            const res = await axios.get('http://127.0.0.1:5000/api/goals', config);
            setGoals(res.data);
        } catch (error) {
            console.error("Failed to fetch goals", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchGoals();
        }
    }, [token, fetchGoals]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'x-access-token': token } };
            await axios.post('http://127.0.0.1:5000/api/goals', { name, goal_amount: goalAmount, target_date: targetDate }, config);
            fetchGoals(); // Re-fetch goals after adding a new one
            setName('');
            setGoalAmount('');
            setTargetDate('');
        } catch (error) {
            alert('Failed to add goal.');
        }
    };
    
    const handleDelete = async (goalId) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            try {
                const config = { headers: { 'x-access-token': token } };
                await axios.delete(`http://127.0.0.1:5000/api/goals/${goalId}`, config);
                fetchGoals(); // Re-fetch goals after deleting
            } catch (error) {
                alert('Failed to delete goal.');
            }
        }
    };

    const getLikelihoodClass = (level) => {
        if (level === 'High') return 'status-high';
        if (level === 'Medium') return 'status-medium';
        if (level === 'Low') return 'status-low';
        return '';
    };

    return (
        <div className="page-container">
            <header className="header">
                <h1>Savings Goals</h1>
                <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
            </header>
            <div className="goals-grid">
                <div className="card">
                    <h3>Add a New Goal</h3>
                    <form onSubmit={handleSubmit} className="transaction-form-grid" style={{marginTop: '1rem'}}>
                         <div className="form-group full-width"><label htmlFor="goalName">Goal Name</label><input id="goalName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., New Laptop" required className="form-input" /></div>
                        <div className="form-group"><label htmlFor="goalAmount">Goal Amount (₹)</label><input id="goalAmount" type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} placeholder="80000" required className="form-input" /></div>
                        <div className="form-group"><label htmlFor="targetDate">Target Date</label><input id="targetDate" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required className="form-input" /></div>
                        <div className="form-group full-width"><button type="submit" className="btn btn-primary">Set Goal</button></div>
                    </form>
                </div>

                {loading ? <div className="card"><p>Loading goals...</p></div> : goals.map(goal => {
                    const required = goal.required_monthly_savings || 0;
                    const current = goal.current_monthly_savings || 0;
                    const progressPercentage = required > 0 ? Math.min(100, (current / required) * 100) : 0;
                    const likelihoodClass = getLikelihoodClass(goal.likelihood?.level);

                    return (
                        <div key={goal._id} className={`card goal-card ${likelihoodClass}`}>
                            <div className="goal-card-header">
                                <h3>{goal.name}</h3>
                                <button onClick={() => handleDelete(goal._id)} className="btn btn-danger">Delete</button>
                            </div>
                            
                            <p className="progress-info">Monthly Savings Progress:</p>
                            <div className="progress-container">
                                <div className={`progress-bar ${likelihoodClass}`} style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                            
                            <div className="goal-card-details">
                                <p>Goal Amount: <strong>₹{goal.goal_amount?.toLocaleString() || 0}</strong></p>
                                <p>Target Date: <strong>{new Date(goal.target_date + 'T00:00:00').toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></p>
                                <p>Required Rate: <strong>₹{required.toFixed(2)} / mo</strong></p>
                                <p>Current Rate: <strong>₹{current.toFixed(2)} / mo</strong></p>
                            </div>
                            
                            <div className={`recommendation-text ${likelihoodClass}`} style={{borderColor: ''}}>
                               <p><strong>Likelihood of Success: {goal.likelihood?.level || 'Unknown'}</strong></p>
                               <p>💡 {goal.advice}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default GoalsPage;