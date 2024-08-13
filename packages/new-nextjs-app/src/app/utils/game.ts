import { LOCAL_STORAGE_KEY } from '../constants/game';

export function getBalanceFromLocalStorage(): number {
  const storedBalance = localStorage.getItem(LOCAL_STORAGE_KEY.BALANCE);
  return storedBalance ? Number.parseFloat(storedBalance) : 200; // Default balance if not found
}

export function writeBalanceToLocalStorage(balance: number): void {
  const balanceValue = balance.toFixed(2);
  localStorage.setItem(LOCAL_STORAGE_KEY.BALANCE, balanceValue);
}