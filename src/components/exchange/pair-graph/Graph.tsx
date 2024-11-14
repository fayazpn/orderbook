import { useExchangeStore } from '@app/hooks/useExchangeStore';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  animation: false as false | object,
  tooltips: {
    mode: 'index', // Display one tooltip per data point
    intersect: false, // Display tooltip even when not intersecting a point
    callbacks: {
      label: (context: any) => {
        const { label, formattedValue } = context.dataset[context.dataIndex];
        return `${label}: ${formattedValue}`;
      },
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Time',
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 10,
      },
      grid: {
        display: true,
        drawOnChartArea: true,
        drawTicks: true,
        color: '#334155',
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Price',
      },
      grid: {
        display: true,
        drawOnChartArea: true,
        drawTicks: true,
        color: '#334155',
      },
    },
  },
  // interaction: {
  //   intersect: false,
  //   axis: 'x',
  // },
  // plugins: {
  //   title: {
  //     display: true,
  //     text: (ctx) =>
  //       'Step ' + ctx.chart.data.datasets[0].stepped + ' Interpolation',
  //   },
  // },
};

function Graph() {
  const { ticker } = useExchangeStore();
  const labels = useMemo(() => {
    return ticker.map((data) => {
      const timestamp = new Date(data.time);
      return timestamp.toLocaleTimeString([], {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    });
  }, [ticker]);

  // console.log(ticker);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Bids',
        data: ticker.map((data) => parseFloat(data.best_bid)),
        borderColor: 'rgb(61, 191, 38)',
        backgroundColor: 'rgba(80, 225, 58, 0.133)',
        fill: false,
        stepped: true,
      },
      {
        label: 'Asks',
        data: ticker.map((data) => parseFloat(data.best_ask)),
        borderColor: 'rgb(255, 99, 71)',
        backgroundColor: 'rgba(255, 99, 71, 0.1)',
        fill: false,
        stepped: true,
      },
    ],
  };

  return <Line data={chartData} options={options} />;
}

export default Graph;
