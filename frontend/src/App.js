import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import DashboardPage from './components/DashboardPage';
import AnalysisPage from './components/AnalysisPage';
import GoalsPage from './components/GoalsPage';
import GroupsPage from './components/GroupsPage';
import GroupDetailPage from './components/GroupDetailPage';

function App() {
    const token = localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                <Route path="/" element={token ? <Navigate to="/dashboard" /> : <HomePage />} />
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/" />} />
                <Route path="/analysis" element={token ? <AnalysisPage /> : <Navigate to="/" />} />
                <Route path="/goals" element={token ? <GoalsPage /> : <Navigate to="/" />} />
                <Route path="/groups" element={token ? <GroupsPage /> : <Navigate to="/" />} />
                <Route path="/groups/:groupId" element={token ? <GroupDetailPage /> : <Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;