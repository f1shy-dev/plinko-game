"use client";

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/app/stores/game';
import useLayoutStore from '@/app/stores/layout';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ArrowClockwise, ChartLine } from 'phosphor-react';
import DraggableWindow from './ui/DraggableWindow';
import Profit from './Profit';
import ProfitHistoryChart from './ProfitHistoryChart';

const LiveStatsWindow: React.FC = () => {
  const { totalProfitHistory, winRecords, setWinRecords, setTotalProfitHistory } = useGameStore();
  const { isLiveStatsOpen, setIsLiveStatsOpen } = useLayoutStore();

  const resetLiveStats = () => {
    setWinRecords([]);
    setTotalProfitHistory([0]);
  };

  if (!isLiveStatsOpen) return null;

  return (
    <DraggableWindow onClose={() => setIsLiveStatsOpen(false)} className="fixed bottom-8 right-8 w-[20rem]">
      <div slot="title" className="flex items-center gap-2">
        <ChartLine weight="bold" className="text-xl text-slate-300" />
        <p className="text-sm font-medium text-white">Live Stats</p>
      </div>
      <div slot="title-bar-actions">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={resetLiveStats}
                className="px-5 py-3 transition bg-slate-800 text-slate-300 hover:bg-slate-700 active:bg-slate-600"
              >
                <ArrowClockwise weight="bold" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="z-30 max-w-lg p-3 text-sm font-medium bg-white rounded-md text-gray-950 drop-shadow-xl"
                sideOffset={4}
              >
                Reset Live Stats
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
      <div className="flex flex-col gap-4">
        <Profit />
        <ProfitHistoryChart />
      </div>
    </DraggableWindow>
  );
};

export default LiveStatsWindow;