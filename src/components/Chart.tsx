
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function DashboardChart() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [chartDataDoughnut, setChartDataDoughnut] = useState({});
    const [chartOptionsDoughnut, setChartOptionsDoughnut] = useState({});
    useEffect(() => {
        const data = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'New Users',
                    data: [540, 325, 702, 620],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                      ],
                      borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                      ],
                      borderWidth: 1
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
        setChartData(data);
        setChartOptions(options);
        const documentStyle = getComputedStyle(document.documentElement);
        const datadoughnut = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'), 
                        documentStyle.getPropertyValue('--yellow-500'), 
                        documentStyle.getPropertyValue('--green-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'), 
                        documentStyle.getPropertyValue('--yellow-400'), 
                        documentStyle.getPropertyValue('--green-400')
                    ]
                }
            ]
        };
        const optionsDoughnut = {
            cutout: '60%'
        };

        setChartDataDoughnut(datadoughnut);
        setChartOptionsDoughnut(optionsDoughnut);
    }, []);

    return (
        <div className="card grid mr-0">
            <Chart type="bar" data={chartData} options={chartOptions} className="w-full md:w-8 p-4"   />
            <Chart type="doughnut" data={chartDataDoughnut} options={chartOptionsDoughnut} className="w-full md:w-3 p-4 mt-6" />

        </div>
    )
}
        