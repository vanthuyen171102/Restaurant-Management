import React from "react";
import ReactApexChart from "react-apexcharts";
import { formatCurrency } from "../../helper/format";

function RevenueSplineAreaChart({ categories, series }) {
  let chartData = {
    options: {
      chart: {
        id: "basic-bar",
        foreColor: "blue",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: "blue", // Change this to your desired text color
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "blue", // Change this to your desired text color
          },
        },
      },
      tooltip: {
        theme: "light", // Apply a light theme for the tooltip
        style: {
          fontSize: "14px",
          fontFamily: "Helvetica, Arial, sans-serif",
        },
        x: {
          formatter: function (val) {
            return categories[val - 1];
          },
        },
        y: {
          formatter: function (val) {
            return ": " + formatCurrency(val) + " đ";
          },
          title: {
            formatter: function (seriesName) {
              return seriesName;
            },
          },
        },
      },
    },
    series: [...series],
  };

  return (
    <ReactApexChart
      options={chartData.options}
      series={chartData.series}
      type="line"
      width="100%"
    />
  );
}

export default RevenueSplineAreaChart;
