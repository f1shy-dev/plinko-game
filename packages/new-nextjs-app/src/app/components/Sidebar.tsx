"use client";

import React, { useState, useEffect } from 'react';
import { Select } from './ui/Select';
import { autoBetIntervalMs, rowCountOptions } from '../constants/game';
import {
  balance,
  betAmount,
  betAmountOfExistingBalls,
  plinkoEngine,
  riskLevel,
  rowCount,
} from '../stores/game';
import { isGameSettingsOpen, isLiveStatsOpen } from '../stores/layout';
import { BetMode, RiskLevel } from '../types/game';
import { flyAndScale } from '../utils/transitions';
import { Popover, Tooltip } from 'bits-ui';
import { ChartLine, GearSix, Infinity, Question } from 'phosphor-react';
import { twMerge } from 'tailwind-merge';
import SettingsWindow from './SettingsWindow';
import LiveStatsWindow from './LiveStatsWindow';

const Sidebar: React.FC = () => {
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
    const parsedValue = parseFloat(e.currentTarget.value.trim());
    if (isNaN(parsedValue)) {
      betAmount = -1;
      betAmount = 0;
    } else {
      betAmount = parsedValue;
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
    const parsedValue = parseInt(e.currentTarget.value.trim());
    if (isNaN(parsedValue)) {
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
    <div className="flex flex-col gap-5 bg-slate-700 p-3 lg:max-w-80">
      <div className="flex gap-1 rounded-full bg-slate-900 p-1">
        {betModes.map(({ value, label }) => (
          <button
            key={value}
            disabled={autoBetInterval !== null}
            onClick={() => setBetMode(value)}
            className={twMerge(
              'flex-1 rounded-full py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-slate-600 active:[&:not(:disabled)]:bg-slate-500',
              betMode === value && 'bg-slate-600',
            )}
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
              onFocusOut={handleBetAmountFocusOut}
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
            <div className="absolute left-3 top-2 select-none text-slate-500" aria-hidden>
              $
            </div>
          </div>
          <button
            disabled={autoBetInterval !== null}
            onClick={() => {
              betAmount = parseFloat((betAmount / 2).toFixed(2));
            }}
            className="touch-manipulation bg-slate-600 px-4 font-bold diagonal-fractions text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-slate-500 active:[&:not(:disabled)]:bg-slate-400"
          >
            1/2
          </button>
          <button
            disabled={autoBetInterval !== null}
            onClick={() => {
              betAmount = parseFloat((betAmount * 2).toFixed(2));
            }}
            className="relative touch-manipulation rounded-r-md bg-slate-600 px-4 text-sm font-bold text-white transition-colors after:absolute after:left-0 after:inline-block after:h-1/2 after:w-[2px] after:bg-slate-800 after:content-[''] disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-slate-500 active:[&:not(:disabled)]:bg-slate-400"
          >
            2×
          </button>
        </div>
        {isBetAmountNegative ? (
          <p className="absolute text-xs leading-5 text-red-400">This must be greater than or equal to 0.</p>
        ) : isBetExceedBalance ? (
          <p className="absolute text-xs leading-5 text-red-400">Can't bet more than your balance!</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="riskLevel" className="text-sm font-medium text-slate-300">
          Risk
        </label>
        <Select
          id="riskLevel"
          value={riskLevel}
          onChange={(e) => riskLevel = e.target.value}
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
          onChange={(e) => rowCount = e.target.value}
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
              <Popover.Trigger className="p-1">
                <Question className="text-slate-300" weight="bold" />
              </Popover.Trigger>
              <Popover.Content
                transition={flyAndScale}
                className="z-30 max-w-lg rounded-md bg-white p-3 text-sm font-medium text-gray-950 drop-shadow-xl"
              >
                <p>Enter '0' for unlimited bets.</p>
                <Popover.Arrow />
              </Popover.Content>
            </Popover.Root>
          </div>
          <div className="relative">
            <input
              id="autoBetInput"
              value={autoBetInterval === null ? autoBetInput : autoBetsLeft ?? 0}
              disabled={autoBetInterval !== null}
              onFocusOut={handleAutoBetInputFocusOut}
              type="number"
              min="0"
              inputMode="numeric"
              className={twMerge(
                'w-full rounded-md border-2 border-slate-600 bg-slate-900 py-2 pl-3 pr-8 text-sm text-white transition-colors hover:cursor-pointer focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:border-slate-500',
                isAutoBetInputNegative && 'border-red-500 hover:border-red-400 focus:border-red-400',
              )}
            />
            {autoBetInput === 0 && (
              <Infinity className="absolute right-3 top-3 size-4 text-slate-400" weight="bold" />
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
      >
        {betMode === BetMode.MANUAL ? 'Drop Ball' : autoBetInterval === null ? 'Start Autobet' : 'Stop Autobet'}
      </button>

      <div className="mt-auto pt-5">
        <div className="flex items-center gap-4 border-t border-slate-600 pt-3">
          <Tooltip.Root openDelay={0} closeOnPointerDown={false}>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => isGameSettingsOpen.set(!isGameSettingsOpen)}
                className={twMerge(
                  'rounded-full p-2 text-slate-300 transition hover:bg-slate-600 active:bg-slate-500',
                  isGameSettingsOpen && 'text-slate-100',
                )}
              >
                <GearSix className="size-6" weight="fill" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              transition={flyAndScale}
              sideOffset={4}
              className="z-30 max-w-lg rounded-md bg-white p-3 text-sm font-medium text-gray-950 drop-shadow-xl"
            >
              <Tooltip.Arrow />
              <p>{isGameSettingsOpen ? 'Close' : 'Open'} Game Settings</p>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root openDelay={0} closeOnPointerDown={false}>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => isLiveStatsOpen.set(!isLiveStatsOpen)}
                className={twMerge(
                  'rounded-full p-2 text-slate-300 transition hover:bg-slate-600 active:bg-slate-500',
                  isLiveStatsOpen && 'text-slate-100',
                )}
              >
                <ChartLine className="size-6" weight="bold" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              transition={flyAndScale}
              sideOffset={4}
              className="z-30 max-w-lg rounded-md bg-white p-3 text-sm font-medium text-gray-950 drop-shadow-xl"
            >
              <Tooltip.Arrow />
              <p>{isLiveStatsOpen ? 'Close' : 'Open'} Live Stats</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </div>
      </div>

      <SettingsWindow />
      <LiveStatsWindow />
    </div>
  );
};

export default Sidebar;
