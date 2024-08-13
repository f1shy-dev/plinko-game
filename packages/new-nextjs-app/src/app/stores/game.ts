import { useState, useEffect, useCallback } from 'react';
import { binColor, binPayouts, binProbabilitiesByRowCount, type RowCount } from '@/app/constants/game';
import { RiskLevel, type BetAmountOfExistingBalls, type WinRecord } from '@/app/types/game';
import { countValueOccurrences } from '@/app/utils/numbers';
import { interpolateRgbColors } from '../constants/colors';
import type PlinkoEngine from '../components/Plinko/PlinkoEngine';

export const useGameStore = () => {
  const [plinkoEngine, setPlinkoEngine] = useState<PlinkoEngine | null>(null);
  const [betAmount, setBetAmount] = useState<number>(1);
  const [betAmountOfExistingBalls, setBetAmountOfExistingBalls] = useState<BetAmountOfExistingBalls>({});
  const [rowCount, setRowCount] = useState<RowCount>(16);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.MEDIUM);
  const [winRecords, setWinRecords] = useState<WinRecord[]>([]);
  const [totalProfitHistory, setTotalProfitHistory] = useState<number[]>([0]);
  const [balance, setBalance] = useState<number>(200);
  const [binColors, setBinColors] = useState<{ background: string[], shadow: string[] }>({ background: [], shadow: [] });
  const [binProbabilities, setBinProbabilities] = useState<Record<number, number>>({});

  useEffect(() => {
    const binCount = rowCount + 1;
    const isBinsEven = binCount % 2 === 0;
    const redToYellowLength = Math.ceil(binCount / 2);

    const redToYellowBg = interpolateRgbColors(
      binColor.background.red,
      binColor.background.yellow,
      redToYellowLength,
    ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

    const redToYellowShadow = interpolateRgbColors(
      binColor.shadow.red,
      binColor.shadow.yellow,
      redToYellowLength,
    ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

    setBinColors({
      background: [...redToYellowBg, ...redToYellowBg.reverse().slice(isBinsEven ? 0 : 1)],
      shadow: [...redToYellowShadow, ...redToYellowShadow.reverse().slice(isBinsEven ? 0 : 1)],
    });
  }, [rowCount]);

  useEffect(() => {
    const occurrences = countValueOccurrences(winRecords.map(({ binIndex }) => binIndex));
    const probabilities: Record<number, number> = {};
    for (let i = 0; i < rowCount + 1; ++i) {
      probabilities[i] = occurrences[i] / winRecords.length || 0;
    }
    setBinProbabilities(probabilities);
  }, [winRecords, rowCount]);

  const addWinRecord = useCallback((winRecord: WinRecord) => {
    setWinRecords((prevRecords) => [...prevRecords, winRecord]);
    setTotalProfitHistory((prevHistory) => {
      const lastTotalProfit = prevHistory[prevHistory.length - 1];
      return [...prevHistory, lastTotalProfit + winRecord.profit];
    });
  }, []);

  const updateBalance = useCallback((amount: number) => {
    setBalance((prevBalance) => prevBalance + amount);
  }, []);

  return {
    plinkoEngine,
    setPlinkoEngine,
    betAmount,
    setBetAmount,
    betAmountOfExistingBalls,
    setBetAmountOfExistingBalls,
    rowCount,
    setRowCount,
    riskLevel,
    setRiskLevel,
    winRecords,
    setWinRecords,
    addWinRecord,
    totalProfitHistory,
    setTotalProfitHistory,
    balance,
    setBalance,
    updateBalance,
    binColors,
    binProbabilities,
  };
};