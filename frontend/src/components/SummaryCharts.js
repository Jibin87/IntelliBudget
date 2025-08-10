import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// We need to register the components we are using from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function SummaryCharts({ data }) {
    // Format the data from our API to what Chart.js expects
    const chartData = {
        labels: data.map(item => item._id), // e.g., ['Food', 'Transport', 'Shopping']
        datasets: [
            {
                label: 'Expenses by Category',
                data: data.map(item => item.total), // e.g., [300, 150, 500]
                backgroundColor: [ // Add more colors if you have more categories
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ marginTop: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h3></h3>
            <Pie data={chartData} />
        </div>
    );
}

export default SummaryCharts;