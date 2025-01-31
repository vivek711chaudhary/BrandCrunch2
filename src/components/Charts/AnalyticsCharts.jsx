import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Brand Analytics',
    },
  },
};

export const LineChart = ({ data }) => {
  return <Line options={chartOptions} data={data} />;
};

export const BarChart = ({ data }) => {
  return <Bar options={chartOptions} data={data} />;
};

export const PieChart = ({ data }) => {
  return <Pie options={chartOptions} data={data} />;
};
