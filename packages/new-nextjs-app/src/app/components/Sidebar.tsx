"use client";

import React, { useState, useEffect } from 'react';
import { Select } from './ui/Select';
import { autoBetIntervalMs, RowCount, rowCountOptions } from '../constants/game';
import { useGameStore } from '../stores/game';
import { BetMode, RiskLevel } from '../types/game';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Popover from '@radix-ui/react-popover';
import { ChartLine, GearSix, Infinity as InfinityIcon, Question } from 'phosphor-react';
import { twMerge } from 'tailwind-merge';
import SettingsWindow from './SettingsWindow';
import LiveStatsWindow from './LiveStatsWindow';
import useLayoutStore from '../stores/layout';

const Sidebar: React.FC = () => {
  const {
    balance,
    betAmount,
    setBetAmount,
    betAmountOfExistingBalls,
    plinkoEngine,
    riskLevel,
    setRiskLevel,
    rowCount,
    setRowCount,
  } = useGameStore();
  const { isGameSettingsOpen, setIsGameSettingsOpen, isLiveStatsOpen, setIsLiveStatsOpen } = useLayoutStore();

  const [betMode, setBetMode] = useState<BetMode>(BetMode.MANUAL);
  const [autoBetInput, setAutoBetInput] = useState<number>(0);
  const [autoBetsLeft, setAutoBetsLeft] = useState<number | null>(null);
  const [autoBetInterval, setAutoBetInterval] = useState<ReturnType<typeof setInterval> | null>(
    null,
  );

  const isBetAmountNegative = betAmount < 0;
  const isBetExceedBalance = betAmount > balance;
  const isAutoBetInputNegative = autoBetInput < 0;

  const isDropBallDisabled =
    plinkoEngine === null || isBetAmountNegative || isBetExceedBalance || isAutoBetInputNegative;

  const hasOutstandingBalls = Object.keys(betAmountOfExistingBalls).length > 0;

  const handleBetAmountFocusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    const parsedValue = Number.parseFloat(e.currentTarget.value.trim());
    if (Number.isNaN(parsedValue)) {
      setBetAmount(-1);
      setBetAmount(0);
    } else {
      setBetAmount(parsedValue);
    }
  };

  const resetAutoBetInterval = () => {
    if (autoBetInterval !== null) {
      clearInterval(autoBetInterval);
      setAutoBetInterval(null);
    }
  };

  const autoBetDropBall = () => {
    if (isBetExceedBalance) {
      resetAutoBetInterval();
      return;
    }

    if (autoBetsLeft === null) {
      plinkoEngine?.dropBall();
      return;
    }

    if (autoBetsLeft > 0) {
      plinkoEngine?.dropBall();
      setAutoBetsLeft((prev) => (prev !== null ? prev - 1 : null));
    }
    if (autoBetsLeft === 0 && autoBetInterval !== null) {
      resetAutoBetInterval();
      return;
    }
  };

  const handleAutoBetInputFocusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    const parsedValue = Number.parseInt(e.currentTarget.value.trim(), 10);
    if (Number.isNaN(parsedValue)) {
      setAutoBetInput(-1);
      setAutoBetInput(0);
    } else {
      setAutoBetInput(parsedValue);
    }
  };

  const handleBetClick = () => {
    if (betMode === BetMode.MANUAL) {
      plinkoEngine?.dropBall();
    } else if (autoBetInterval === null) {
      setAutoBetsLeft(autoBetInput === 0 ? null : autoBetInput);
      setAutoBetInterval(setInterval(autoBetDropBall, autoBetIntervalMs));
    } else if (autoBetInterval !== null) {
      resetAutoBetInterval();
    }
  };

  const betModes = [
    { value: BetMode.MANUAL, label: 'Manual' },
    { value: BetMode.AUTO, label: 'Auto' },
  ];
  const riskLevels = [
    { value: RiskLevel.LOW, label: 'Low' },
    { value: RiskLevel.MEDIUM, label: 'Medium' },
    { value: RiskLevel.HIGH, label: 'High' },
  ];
  const rowCounts = rowCountOptions.map((value) => ({ value, label: value.toString() }));

  return (
    <div className="flex flex-col gap-5 p-3 bg-slate-700 lg:max-w-80">
      <div className="flex gap-1 p-1 rounded-full bg-slate-900">
        {betModes.map(({ value, label }) => (
          <button
            key={value}
            disabled={autoBetInterval !== null}
            onClick={() => setBetMode(value)}
            className={twMerge(
              'flex-1 rounded-full py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-slate-600 active:[&:not(:disabled)]:bg-slate-500',
              betMode === value && 'bg-slate-600',
            )}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative">
        <label htmlFor="betAmount" className="text-sm font-medium text-slate-300">
          Bet Amount
        </label>
        <div className="flex">
          <div className="relative flex-1">
            <input
              id="betAmount"
              value={betAmount}
              onBlur={handleBetAmountFocusOut}
              disabled={autoBetInterval !== null}
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              className={twMerge(
                'w-full rounded-l-md border-2 border-slate-600 bg-slate-900 py-2 pl-7 pr-2 text-sm text-white transition-colors hover:cursor-pointer focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed  disabled:opacity-50 hover:[&:not(:disabled)]:border-slate-500',
                (isBetAmountNegative || isBetExceedBalance) &&
                  'border-red-500 focus:border-red-400 hover:[&:not(:disabled)]:border-red-400',
              )}
            />
            <div className="absolute select-none left-3 top-2 text-slate-500" aria-hidden>
              $
            </div>
          </div>
          <button
            disabled={autoBetInterval !== null}
            onClick={() => {
              setBetAmount(Number.parseFloat((betAmount / 2).toFixed(2)));
            }}
            className="touch-manipulation bg-slate-600 px-4 font-bold diagonal-fractions text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-slate-500 active:[&:not(:disabled)]:bg-slate-400"
            type="button"
          >
            1/2
          </button>
          <button
            disabled={autoBetInterval !== null}
            onClick={() => {
              setBetAmount(Number.parseFloat((betAmount * 2).toFixed(2)));
            }}
            className="relative touch-manipulation rounded-r-md bg-slate-600 px-4 text-sm font-bold text-white transition-colors after:absolute after:left-0 after:inline-block after:h-1/2 after:w-[2px] after:bg-slate-800 after:content-[''] disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-slate-500 active:[&:not(:disabled)]:bg-slate-400"
            type="button"
          >
            2×
          </button>
        </div>
        {isBetAmountNegative ? (
          <p className="absolute text-xs leading-5 text-red-400">This must be greater than or equal to 0.</p>
        ) : isBetExceedBalance ? (
          <p className="absolute text-xs leading-5 text-red-400">Can&apos;t bet more than your balance!</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="riskLevel" className="text-sm font-medium text-slate-300">
          Risk
        </label>
        <Select
          id="riskLevel"
          value={riskLevel}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRiskLevel(e.target.value as RiskLevel)}
          items={riskLevels}
          disabled={hasOutstandingBalls || autoBetInterval !== null}
        />
      </div>

      <div>
        <label htmlFor="rowCount" className="text-sm font-medium text-slate-300">
          Rows
        </label>
        <Select
          id="rowCount"
          value={rowCount}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRowCount(Number(e.target.value) as RowCount)}
          items={rowCounts}
          disabled={hasOutstandingBalls || autoBetInterval !== null}
        />
      </div>

      {betMode === BetMode.AUTO && (
        <div>
          <div className="flex items-center gap-1">
            <label htmlFor="autoBetInput" className="text-sm font-medium text-slate-300">
              Number of Bets
            </label>
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="p-1" type="button">
                  <Question className="text-slate-300" weight="bold" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-30 max-w-lg p-3 text-sm font-medium bg-white rounded-md text-gray-950 drop-shadow-xl"
                  sideOffset={5}
                >
                  <p>Enter &apos;0&apos; for unlimited bets.</p>
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
          <div className="relative">
            <input
              id="autoBetInput"
              value={autoBetInterval === null ? autoBetInput : autoBetsLeft ?? 0}
              disabled={autoBetInterval !== null}
              onBlur={handleAutoBetInputFocusOut}
              type="number"
              min="0"
              inputMode="numeric"
              className={twMerge(
                'w-full rounded-md border-2 border-slate-600 bg-slate-900 py-2 pl-3 pr-8 text-sm text-white transition-colors hover:cursor-pointer focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:border-slate-500',
                isAutoBetInputNegative && 'border-red-500 hover:border-red-400 focus:border-red-400',
              )}
            />
            {autoBetInput === 0 && (
              <InfinityIcon className="absolute right-3 top-3 size-4 text-slate-400" weight="bold" />
            )}
          </div>
          {isAutoBetInputNegative && (
            <p className="text-xs leading-5 text-red-400">This must be greater than or equal to 0.</p>
          )}
        </div>
      )}

      <button
        onClick={handleBetClick}
        disabled={isDropBallDisabled}
        className={twMerge(
          'touch-manipulation rounded-md bg-green-500 py-3 font-semibold text-slate-900 transition-colors hover:bg-green-400 active:bg-green-600 disabled:bg-neutral-600 disabled:text-neutral-400',
          autoBetInterval !== null && 'bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600',
        )}
        type="button"
      >
        {betMode === BetMode.MANUAL ? 'Drop Ball' : autoBetInterval === null ? 'Start Autobet' : 'Stop Autobet'}
      </button>

      <div className="pt-5 mt-auto">
        <div className="flex items-center gap-4 pt-3 border-t border-slate-600">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => setIsGameSettingsOpen(!isGameSettingsOpen)}
                  className={twMerge(
                    'rounded-full p-2 text-slate-300 transition hover:bg-slate-600 active:bg-slate-500',
                    isGameSettingsOpen && 'text-slate-100',
                  )}
                  type="button"
                >
                  <GearSix className="size-6" weight="fill" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="z-30 max-w-lg p-3 text-sm font-medium bg-white rounded-md text-gray-950 drop-shadow-xl"
                  sideOffset={5}
                >
                  <p>{isGameSettingsOpen ? 'Close' : 'Open'} Game Settings</p>
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>

          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => setIsLiveStatsOpen(!isLiveStatsOpen)}
                  className={twMerge(
                    'rounded-full p-2 text-slate-300 transition hover:bg-slate-600 active:bg-slate-500',
                    isLiveStatsOpen && 'text-slate-100',
                  )}
                  type="button"
                >
                  <ChartLine className="size-6" weight="bold" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="z-30 max-w-lg p-3 text-sm font-medium bg-white rounded-md text-gray-950 drop-shadow-xl"
                  sideOffset={5}
                >
                  <p>{isLiveStatsOpen ? 'Close' : 'Open'} Live Stats</p>
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>

      <SettingsWindow />
      <LiveStatsWindow />
    </div>
  );
};

export default Sidebar;