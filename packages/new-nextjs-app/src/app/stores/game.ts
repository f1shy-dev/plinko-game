import { useState, useEffect } from 'react';
import { binColor, binPayouts, binProbabilitiesByRowCount, RowCount, RiskLevel } from '../constants/game';
import { countValueOccurrences, dotProduct } from '../utils/numbers';

export const useGameStore = () => {
  const [plinkoEngine, setPlinkoEngine] = useState(null);
  const [betAmount, setBetAmount] = useState(1);
  const [betAmountOfExistingBalls, setBetAmountOfExistingBalls] = useState({});
  const [rowCount, setRowCount] = useState<RowCount>(16);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.MEDIUM);
  const [winRecords, setWinRecords] = useState([]);
  const [totalProfitHistory, setTotalProfitHistory] = useState([0]);
  const [balance, setBalance] = useState(200);
  const [binColors, setBinColors] = useState({ background: [], shadow: [] });
  const [binProbabilities, setBinProbabilities] = useState({});

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
    const probabilities = {};
    for (let i = 0; i < rowCount + 1; ++i) {
      probabilities[i] = occurrences[i] / winRecords.length || 0;
    }
    setBinProbabilities(probabilities);
  }, [winRecords, rowCount]);

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
    totalProfitHistory,
    setTotalProfitHistory,
    balance,
    setBalance,
    binColors,
    binProbabilities,
  };
};
