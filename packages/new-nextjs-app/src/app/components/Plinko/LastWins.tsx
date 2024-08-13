"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { binColorsByRowCount } from '../../constants/game';
import { winRecords } from '../../stores/game';

const LastWins = ({ winCount = 4 }) => {
  const [lastWins, setLastWins] = useState([]);
  const winRecordsState = useStore(winRecords);

  useEffect(() => {
    setLastWins(winRecordsState.slice(-winCount).reverse());
  }, [winRecordsState, winCount]);

  return (
    <div
      className="flex w-[clamp(1.5rem,0.893rem+2.857vw,2rem)] flex-col overflow-hidden rounded-sm text-[clamp(8px,5.568px+0.714vw,10px)] md:rounded-md lg:w-12 lg:text-sm"
      style={{ aspectRatio: `1 / ${winCount}` }}
    >
      {lastWins.map(({ binIndex, rowCount, payout: { multiplier } }, index) => (
        <div
          key={index}
          className="flex aspect-square items-center justify-center font-bold text-gray-950"
          style={{ backgroundColor: binColorsByRowCount[rowCount].background[binIndex] }}
        >
          {multiplier}{multiplier < 100 ? '×' : ''}
        </div>
      ))}
    </div>
  );
};

export default LastWins;
