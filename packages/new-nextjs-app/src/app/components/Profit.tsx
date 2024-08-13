"use client";

import React from 'react';
import { useGameStore } from '../stores/game';
import { formatCurrency } from '../utils/numbers';

const Profit: React.FC = () => {
  const { winRecords } = useGameStore();

  const profit = winRecords.reduce((acc, { profit }) => acc + profit, 0);
  const wins = winRecords.filter(({ profit }) => profit >= 0).length;
  const losses = winRecords.filter(({ profit }) => profit < 0).length;

  return (
    <div className="flex p-4 text-sm rounded-md bg-slate-900">
      <div className="flex-1">
        <p className="font-medium text-slate-400">Profit</p>
        <p className={`font-semibold tabular-nums ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {formatCurrency(profit)}
        </p>
      </div>
      <div className="mx-4 w-0.5 bg-slate-600" aria-hidden />
      <div className="flex-1 space-y-2">
        <div>
          <p className="font-medium text-slate-400">Wins</p>
          <p className="font-semibold text-green-400 tabular-nums">{wins.toLocaleString('en-US')}</p>
        </div>
        <div>
          <p className="font-medium text-slate-400">Losses</p>
          <p className="font-semibold text-red-400 tabular-nums">{losses.toLocaleString('en-US')}</p>
        </div>
      </div>
    </div>
  );
};

export default Profit;