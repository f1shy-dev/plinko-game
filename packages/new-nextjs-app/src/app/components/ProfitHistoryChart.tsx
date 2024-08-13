import React, { useState, useEffect } from 'react';
import { totalProfitHistory } from '../stores/game';
import { formatCurrency } from '../utils/numbers';
import { Chart, Line } from 'react-chartjs-2';
import { twMerge } from 'tailwind-merge';

const WIN_COLOR = 'rgb(74, 222, 128)'; // green-400
const WIN_COLOR_FILL = 'rgba(74, 222, 128, 0.3)';
const LOSS_COLOR = 'rgb(248, 113, 113)'; // red-400
const LOSS_COLOR_FILL = 'rgba(248, 113, 113, 0.3)'; // red-400
const X_AXIS_COLOR = '#1e293b'; // slate-800
const POINT_HOVER_COLOR = '#fff';

const ProfitHistoryChart: React.FC = () => {
  const [profitHistory, setProfitHistory] = useState<number[]>([]);
  const [hoveredProfitValue, setHoveredProfitValue] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribeProfitHistory = totalProfitHistory.subscribe(setProfitHistory);

    return () => {
      unsubscribeProfitHistory();
    };
  }, []);

  const data = {
    labels: Array(profitHistory.length).fill(0), // Label does not matter
    datasets: [
      {
        label: 'Profit',
        data: profitHistory,
        fill: {
          target: 'origin',
          above: WIN_COLOR_FILL,
          below: LOSS_COLOR_FILL,
        },
        cubicInterpolationMode: 'monotone',
        segment: {
          borderColor: (ctx: any) => {
            const y0 = ctx.p0.parsed.y;
            const y1 = ctx.p1.parsed.y;
            if (y1 === 0) {
              return y0 < 0 ? LOSS_COLOR : WIN_COLOR;
            }
            return y1 < 0 ? LOSS_COLOR : WIN_COLOR;
          },
        },
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: POINT_HOVER_COLOR,
        pointHoverBorderColor: POINT_HOVER_COLOR,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      y: {
        duration: 0, // Disable weird y-value jumping animation
      },
    },
    interaction: {
      intersect: false,
      mode: 'index', // Easily "hover" points when move mouse across x-axis
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { display: false },
      },
      y: {
        border: { display: false },
        grid: {
          color: (ctx: any) => (ctx.tick.value === 0 ? X_AXIS_COLOR : undefined),
          lineWidth: 2,
        },
        ticks: { display: false },
        grace: '1%',
      },
    },
    onHover: (_: any, elements: any) => {
      if (elements.length) {
        const selectedPointIndex = elements[0].index;
        setHoveredProfitValue(profitHistory[selectedPointIndex]);
      }
    },
  };

  return (
    <div className="relative rounded-md bg-slate-900 p-4 text-sm">
      <p className="font-medium text-slate-400">Profit History</p>
      <p
        className={twMerge(
          'absolute font-semibold tabular-nums',
          hoveredProfitValue !== null && (hoveredProfitValue >= 0 ? 'text-green-400' : 'text-red-400'),
        )}
      >
        {hoveredProfitValue !== null ? formatCurrency(hoveredProfitValue) : ''}
      </p>
      <div className="mt-6 h-[11rem] w-[16rem]">
        <Line data={data} options={options} onMouseLeave={() => setHoveredProfitValue(null)} />
      </div>
    </div>
  );
};

export default ProfitHistoryChart;
