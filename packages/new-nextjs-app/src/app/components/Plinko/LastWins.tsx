"use client";

import React, { useMemo } from 'react';
import { binColorsByRowCount } from '@/app/constants/game';
import { useGameStore } from '@/app/stores/game';
import { WinRecord } from '@/app/types/game';

interface LastWinsProps {
  winCount?: number;
}

const LastWins: React.FC<LastWinsProps> = ({ winCount = 4 }) => {
  const { winRecords } = useGameStore();

  const lastWins = useMemo(() => {
    return winRecords.slice(-winCount).reverse();
  }, [winRecords, winCount]);

  return (
    <div
      className="flex w-[clamp(1.5rem,0.893rem+2.857vw,2rem)] flex-col overflow-hidden rounded-sm text-[clamp(8px,5.568px+0.714vw,10px)] md:rounded-md lg:w-12 lg:text-sm"
      style={{ aspectRatio: `1 / ${winCount}` }}
    >
      {lastWins.map((win: WinRecord, index: number) => (
        <div
          key={win.id || index}
          className="flex items-center justify-center font-bold aspect-square text-gray-950"
          style={{ backgroundColor: binColorsByRowCount[win.rowCount].background[win.binIndex] }}
        >
          {win.payout.multiplier}
          {win.payout.multiplier < 100 ? '×' : ''}
        </div>
      ))}
    </div>
  );
};

export default LastWins;