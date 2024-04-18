import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import PropTypes from 'prop-types';
import { Card } from 'primereact/card';

export default function AppUsersVisits({ title, subheader, chart, ...other }: any) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
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
        const options = {
            cutout: '60%'
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        
        <div className="card p-5 ">
              <Card className='w-full'  title={title} subTitle={subheader}>

      <div className='p-3 pb-1' style={{height:"15rem"}}>
      <Chart type="bar" data={chartData} options={chartOptions} style={{height:"15rem"}} />      </div>
    </Card>
        </div>
    )
}
AppUsersVisits.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    title: PropTypes.string,
  };