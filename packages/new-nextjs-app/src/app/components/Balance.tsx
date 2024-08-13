"use client";

import React, { useEffect } from 'react';
import { useGameStore } from '../stores/game';
import { getBalanceFromLocalStorage, writeBalanceToLocalStorage } from '../utils/game';
import * as Popover from '@radix-ui/react-popover';

const Balance: React.FC = () => {
  const { balance, setBalance } = useGameStore();
  const addMoneyAmounts = [100, 500, 1000];

  useEffect(() => {
    setBalance(getBalanceFromLocalStorage());
  }, [setBalance]);

  useEffect(() => {
    writeBalanceToLocalStorage(balance);
  }, [balance]);

  const formatBalance = (balance: number) => {
    return balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="flex overflow-hidden rounded-md">
      <div className="flex gap-2 px-3 py-2 text-sm font-semibold text-white bg-slate-900 tabular-nums sm:text-base">
        <span className="text-gray-500 select-none">$</span>
        <span className="text-right min-w-16">{formatBalance(balance)}</span>
      </div>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-500 active:bg-blue-700 sm:text-base">
            Add
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="z-30 max-w-lg p-3 space-y-2 rounded-md bg-slate-600">
            <p className="text-sm font-medium text-gray-200">Add money</p>
            <div className="flex gap-2">
              {addMoneyAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBalance(balance + amount)}
                  className="px-3 py-2 text-sm font-semibold text-gray-900 transition-colors bg-green-500 rounded-md touch-manipulation hover:bg-green-400 active:bg-green-600 disabled:bg-neutral-600 disabled:text-neutral-400"
                >
                  +${amount}
                </button>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

export default Balance;