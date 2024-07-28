import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import PropTypes from "prop-types";
import { Card } from "primereact/card";
import { useTranslation } from "react-i18next";

export default function AppWebsiteVisits({
  title,
  subheader,
  chart,
  ...other
}: any) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: [
        t('charts.mon.January'),
        t('charts.mon.February'),
        t('charts.mon.March'),
        t('charts.mon.April'),
        t('charts.mon.May'),
        t('charts.mon.June'),
        t('charts.mon.July'),
        t('charts.mon.August'),
        t('charts.mon.September'),
        t('charts.mon.October'),
        t('charts.mon.November'),
        t('charts.mon.December'),
      ],
      datasets: [
        {
          label: t('charts.datasets.labels.First Dataset'),
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          tension: 0.4,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
        },
        {
          label: t('charts.datasets.labels.Second Dataset'),
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderDash: [5, 5],
          tension: 0.4,
          borderColor: documentStyle.getPropertyValue("--teal-500"),
        },
        {
          label: t('charts.datasets.labels.Third Dataset'),
          data: [12, 51, 62, 33, 21, 62, 45],
          fill: true,
          borderColor: documentStyle.getPropertyValue("--orange-500"),
          tension: 0.4,
          backgroundColor: "rgba(255,167,38,0.2)",
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="card p-5">
      <Card className="w-full" title={title} subTitle={subheader}>
        <div className="p-3 pb-1" style={{ height: "15rem" }}>
          <Chart
            type="line"
            data={chartData}
            options={chartOptions}
            style={{ height: "15rem" }}
          />
        </div>
      </Card>
    </div>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
