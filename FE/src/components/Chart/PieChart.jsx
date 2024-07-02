import Chart from "react-apexcharts";

function PieChart(props) {
  const { names, values, type , height, isCurrency} = props;
  
  const options ={
    labels: names,
    chart: {
        foreColor: '#ffffff',
    },
    legend: {
      show: true,
      position: "right",
    },
    colors: ["#00AB55", "#2D99FF", "#FFE700", "#826AF9"],
    tooltip: {
      y: {
        formatter: function (val) {
          return isCurrency ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
          : val;
        }
      }
    }
  }

  return (
    <Chart
      series={values}
      options={options}
      type="pie"
      height={height}
    />
  );
}

export default PieChart;
