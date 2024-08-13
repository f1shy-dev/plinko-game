"use client";

import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import { binPayouts, binProbabilitiesByRowCount, RowCount } from '@/app/constants/game';
import { RiskLevel } from '@/app/types/game';
import { dotProduct } from '@/app/utils/numbers';

const BinsDistribution: React.FC = () => {
  const [binProbabilities, setBinProbabilities] = useState<{ [binIndex: number]: number }>({});
  const [rowCount, setRowCount] = useState<RowCount>(16);

  useEffect(() => {
    // Fetch bin probabilities from the store or API
    // For now, we use a placeholder
    setBinProbabilities(binProbabilitiesByRowCount[rowCount]);
  }, [rowCount]);

  const binIndexes = Object.keys(binProbabilities);
  const binProbabilitiesInPercent = Object.values(binProbabilities).map((prob) => prob * 100);
  const expectedProbabilitiesInPercent = binProbabilitiesByRowCount[rowCount].map(
    (prob) => prob * 100
  );

  const getWeightedPayout = (
    rowCount: RowCount,
    riskLevel: RiskLevel,
    binProbabilities: number[]
  ) => dotProduct(binPayouts[rowCount][riskLevel], binProbabilities);

  useEffect(() => {
    const ctx = document.getElementById('binsChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: binIndexes,
          datasets: [
            {
              label: 'Bin Probability',
              data: binProbabilitiesInPercent,
            },
            {
              label: 'Expected Probability',
              data: expectedProbabilitiesInPercent,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: 'Bin Number' },
            },
            y: {
              title: { display: true, text: 'Probability (%)' },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(4)}%`,
              },
            },
          },
        },
      });
    }
  }, [binIndexes, binProbabilitiesInPercent, expectedProbabilitiesInPercent]);

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold">Bins Distribution</h2>
      <div className="h-[400px] w-[800px]">
        <canvas id="binsChart" />
      </div>
      <table className="my-4 text-xs">
        <thead>
          <tr>
            {binIndexes.map((binIndex) => (
              <th key={binIndex} className="px-2 py-1 text-left">
                {binIndex}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {binProbabilitiesInPercent.map((probPercent, index) => (
              <td key={index} className="w-20 px-2 py-1 tabular-nums">
                {probPercent.toFixed(4)}%
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <table className="my-4 text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left">Risk</th>
            <th className="px-2 py-1 text-left">Expected value</th>
            <th className="px-2 py-1 text-left">Actual value</th>
          </tr>
        </thead>
        <tbody>
          {[RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH].map((riskLevel) => (
            <tr key={riskLevel}>
              <td className="px-2 py-1">{riskLevel}</td>
              <td className="px-2 py-1 tabular-nums">
                {getWeightedPayout(rowCount, riskLevel, binProbabilitiesByRowCount[rowCount]).toFixed(
                  5
                )}
              </td>
              <td className="px-2 py-1 tabular-nums">
                {getWeightedPayout(rowCount, riskLevel, Object.values(binProbabilities)).toFixed(5)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BinsDistribution;