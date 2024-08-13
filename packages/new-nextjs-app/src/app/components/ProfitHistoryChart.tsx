"use client";

import React, { useState } from 'react';
import { useGameStore } from '../stores/game';
import { formatCurrency } from '../utils/numbers';
import { Line } from 'react-chartjs-2';
import { twMerge } from 'tailwind-merge';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WIN_COLOR = 'rgb(74, 222, 128)';
const WIN_COLOR_FILL = 'rgba(74, 222, 128, 0.3)';
const LOSS_COLOR = 'rgb(248, 113, 113)';
const LOSS_COLOR_FILL = 'rgba(248, 113, 113, 0.3)';
const X_AXIS_COLOR = '#1e293b';
const POINT_HOVER_COLOR = '#fff';

const ProfitHistoryChart: React.FC = () => {
  const { totalProfitHistory } = useGameStore();
  const [hoveredProfitValue, setHoveredProfitValue] = useState<number | null>(null);

  const data = {
    labels: Array(totalProfitHistory.length).fill(0),
    datasets: [
      {
        label: 'Profit',
        data: totalProfitHistory,
        fill: {
          target: 'origin',
          above: WIN_COLOR_FILL,
          below: LOSS_COLOR_FILL,
        },
        cubicInterpolationMode: 'monotone' as const,
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

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        border: { display: false },
        grid: {
          color: (ctx) => (ctx.tick.value === 0 ? X_AXIS_COLOR : undefined),
          lineWidth: 2,
        },
        ticks: { display: false },
        grace: '1%',
      },
    },
    onHover: (_, elements) => {
      if (elements.length) {
        const selectedPointIndex = elements[0].index;
        setHoveredProfitValue(totalProfitHistory[selectedPointIndex]);
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