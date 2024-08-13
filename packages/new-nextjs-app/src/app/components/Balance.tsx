import React, { useState, useEffect } from 'react';

const Balance: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const addMoneyAmounts = [100, 500, 1000];

  useEffect(() => {
    // Load balance from local storage or set to default value
    const storedBalance = localStorage.getItem('balance');
    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    } else {
      setBalance(200); // Default balance
    }
  }, []);

  useEffect(() => {
    // Save balance to local storage
    localStorage.setItem('balance', balance.toFixed(2));
  }, [balance]);

  const formatBalance = (balance: number) => {
    return balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="flex overflow-hidden rounded-md">
      <div className="flex gap-2 bg-slate-900 px-3 py-2 text-sm font-semibold tabular-nums text-white sm:text-base">
        <span className="select-none text-gray-500">$</span>
        <span className="min-w-16 text-right">{formatBalance(balance)}</span>
      </div>
      <div className="relative">
        <button className="bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 active:bg-blue-700 sm:text-base">
          Add
        </button>
        <div className="absolute z-30 max-w-lg space-y-2 rounded-md bg-slate-600 p-3">
          <p className="text-sm font-medium text-gray-200">Add money</p>
          <div className="flex gap-2">
            {addMoneyAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setBalance(balance + amount)}
                className="touch-manipulation rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-green-400 active:bg-green-600 disabled:bg-neutral-600 disabled:text-neutral-400"
              >
                +${amount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
