import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ data }) => {
  const chartData = {
    labels: data.map((_, index) => `Reading ${index + 1}`), // X-axis labels
    datasets: [
      {
        label: 'Hall Effect Sensor Values', // Dataset label
        data: data.map((value) => parseFloat(value)), // Y-axis data
        borderColor: '#007bff', // Line color
        backgroundColor: 'rgba(0, 123, 255, 0.1)', // Fill color
        fill: true, // Fill under the line
        tension: 0.4, // Smooth line
      },
    ],
  };

  const options = {
    responsive: true, // Make the chart responsive
    plugins: {
      legend: {
        position: 'top', // Position of the legend
      },
      title: {
        display: true,
        text: 'Sensor Readings Over Time', // Chart title
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Readings', // X-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value', // Y-axis title
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;