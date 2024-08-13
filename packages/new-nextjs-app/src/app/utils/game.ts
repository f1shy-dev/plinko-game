import { LOCAL_STORAGE_KEY } from '../constants/game';
import { balance } from '../stores/game';

export function setBalanceFromLocalStorage() {
  const storedBalance = localStorage.getItem(LOCAL_STORAGE_KEY.BALANCE);
  if (storedBalance) {
    balance.set(parseFloat(storedBalance));
  }
}

export function writeBalanceToLocalStorage() {
  const balanceValue = balance.getState().toFixed(2);
  localStorage.setItem(LOCAL_STORAGE_KEY.BALANCE, balanceValue);
}
