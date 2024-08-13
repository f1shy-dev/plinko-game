import React, { useState, useEffect } from 'react';
import { totalProfitHistory, winRecords } from '../stores/game';
import { isLiveStatsOpen } from '../stores/layout';
import { flyAndScale } from '../utils/transitions';
import { Tooltip } from 'bits-ui';
import { ArrowClockwise, ChartLine } from 'phosphor-react';
import DraggableWindow from './ui/DraggableWindow';
import Profit from './Profit';
import ProfitHistoryChart from './ProfitHistoryChart';

const LiveStatsWindow: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profitHistory, setProfitHistory] = useState<number[]>([]);
  const [winRecordsState, setWinRecordsState] = useState([]);

  useEffect(() => {
    const unsubscribeLiveStats = isLiveStatsOpen.subscribe(setIsOpen);
    const unsubscribeProfitHistory = totalProfitHistory.subscribe(setProfitHistory);
    const unsubscribeWinRecords = winRecords.subscribe(setWinRecordsState);

    return () => {
      unsubscribeLiveStats();
      unsubscribeProfitHistory();
      unsubscribeWinRecords();
    };
  }, []);

  const resetLiveStats = () => {
    setWinRecordsState([]);
    setProfitHistory([0]);
  };

  if (!isOpen) return null;

  return (
    <DraggableWindow onClose={() => setIsOpen(false)} className="fixed bottom-8 right-8 w-[20rem]">
      <div slot="title" className="flex items-center gap-2">
        <ChartLine weight="bold" className="text-xl text-slate-300" />
        <p className="text-sm font-medium text-white">Live Stats</p>
      </div>
      <div slot="title-bar-actions">
        <Tooltip.Root openDelay={0} closeOnPointerDown={false}>
          <Tooltip.Trigger asChild>
            <button
              onClick={resetLiveStats}
              className="bg-slate-800 px-5 py-3 text-slate-300 transition hover:bg-slate-700 active:bg-slate-600"
            >
              <ArrowClockwise weight="bold" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content
            transition={flyAndScale}
            sideOffset={4}
            className="z-30 max-w-lg rounded-md bg-white p-3 text-sm font-medium text-gray-950 drop-shadow-xl"
          >
            <Tooltip.Arrow />
            <p>Reset Live Stats</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
      <div className="flex flex-col gap-4">
        <Profit />
        <ProfitHistoryChart />
      </div>
    </DraggableWindow>
  );
};

export default LiveStatsWindow;
