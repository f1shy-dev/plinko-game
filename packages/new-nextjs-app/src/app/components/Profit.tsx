import React, { useState, useEffect } from 'react';
import { winRecords } from '../stores/game';
import { formatCurrency } from '../utils/numbers';

const Profit: React.FC = () => {
  const [profit, setProfit] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  useEffect(() => {
    const unsubscribeWinRecords = winRecords.subscribe((records) => {
      const totalProfit = records.reduce((acc, { profit }) => acc + profit, 0);
      const totalWins = records.filter(({ profit }) => profit >= 0).length;
      const totalLosses = records.filter(({ profit }) => profit < 0).length;

      setProfit(totalProfit);
      setWins(totalWins);
      setLosses(totalLosses);
    });

    return () => {
      unsubscribeWinRecords();
    };
  }, []);

  return (
    <div className="flex rounded-md bg-slate-900 p-4 text-sm">
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
          <p className="font-semibold tabular-nums text-green-400">{wins.toLocaleString('en-US')}</p>
        </div>
        <div>
          <p className="font-medium text-slate-400">Losses</p>
          <p className="font-semibold tabular-nums text-red-400">{losses.toLocaleString('en-US')}</p>
        </div>
      </div>
    </div>
  );
};

export default Profit;
