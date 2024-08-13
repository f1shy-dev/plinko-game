import type { RowCount } from '../constants/game';
export type { RowCount } from '../constants/game';

export enum BetMode {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export type BetAmountOfExistingBalls = {
  [ballId: number]: number;
};

export type WinRecord = {
  id: string;
  betAmount: number;
  rowCount: RowCount;
  binIndex: number;
  payout: {
    multiplier: number;
    value: number;
  };
  profit: number;
};
