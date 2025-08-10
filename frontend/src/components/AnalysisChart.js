import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './AnalysisChart.css'; // Import the new CSS file

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AnalysisChart({ title, incomeData, expenseData }) {
    const data = {
        labels: incomeData.labels, 
        datasets: [
            {
                label: 'Income',
                data: incomeData.data,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
            },
            {
                label: 'Expense',
                data: expenseData.data,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allows the chart to fill the container's height
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: title },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="chart-container">
            <Bar options={options} data={data} />
        </div>
    );
}

export default AnalysisChart;