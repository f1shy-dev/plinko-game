"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CircleNotch } from 'phosphor-react';
import BinsRow from './BinsRow';
import LastWins from './LastWins';
import PlinkoEngine from './PlinkoEngine';
import { useGameStore } from '@/app/stores/game';
import type { RiskLevel, WinRecord } from '@/app/types/game';
import type { RowCount } from '@/app/constants/game';
import * as Matter from 'matter-js';
const Plinko: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { rowCount, riskLevel, betAmount, addWinRecord, updateBalance } = useGameStore();
  const [plinkoEngine, setPlinkoEngine] = useState<PlinkoEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new PlinkoEngine(canvasRef.current, rowCount as RowCount, riskLevel as RiskLevel, betAmount);
    engine.start();
    setPlinkoEngine(engine);

    return () => {
      engine.stop();
      setPlinkoEngine(null);
    };
  }, [rowCount, riskLevel, betAmount]);

  useEffect(() => {
    if (plinkoEngine) {
      plinkoEngine.updateRowCount(rowCount as RowCount);
    }
  }, [plinkoEngine, rowCount]);

  const handleBallEnterBin = useCallback((winRecord: WinRecord) => {
    addWinRecord(winRecord);
    updateBalance(winRecord.payout.value - winRecord.betAmount);
  }, [addWinRecord, updateBalance]);

  useEffect(() => {
    if (plinkoEngine) {
      Matter.Events.on(plinkoEngine.engine, 'collisionStart', ({ pairs }: Matter.IEventCollision<Matter.Engine>) => {
        for (const pair of pairs) {
          const { bodyA, bodyB } = pair;
          if (bodyA === plinkoEngine.sensor || bodyB === plinkoEngine.sensor) {
            const ball = bodyA === plinkoEngine.sensor ? bodyB : bodyA;
            const winRecord = plinkoEngine.handleBallEnterBin(ball);
            handleBallEnterBin(winRecord);
          }
        }
      });
    }
  }, [plinkoEngine, handleBallEnterBin]);

  const dropBall = () => {
    if (plinkoEngine) {
      plinkoEngine.dropBall();
      updateBalance(-betAmount);
    }
  };

  return (
    <div className="relative bg-gray-900">
      <div 
        className="flex flex-col h-full px-4 pb-4 mx-auto" 
        style={{ maxWidth: `${PlinkoEngine.WIDTH}px` }}
      >
        <div 
          className="relative w-full" 
          style={{ aspectRatio: `${PlinkoEngine.WIDTH} / ${PlinkoEngine.HEIGHT}` }}
        >
          {!plinkoEngine && (
            <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              <CircleNotch className="w-20 h-20 animate-spin text-slate-600" weight="bold" />
            </div>
          )}
          <canvas 
            ref={canvasRef} 
            width={PlinkoEngine.WIDTH} 
            height={PlinkoEngine.HEIGHT} 
            className="absolute inset-0 w-full h-full" 
          />
        </div>
        <BinsRow />
      </div>
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2">
        <LastWins />
      </div>
      <button 
        onClick={dropBall} 
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
        type="button"
      >
        Drop Ball
      </button>
    </div>
  );
};

export default Plinko;