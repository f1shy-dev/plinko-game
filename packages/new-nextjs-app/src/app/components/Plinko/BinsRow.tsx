"use client";

import React, { useEffect, useRef } from 'react';
import { binColorsByRowCount, binPayouts } from '@/app/constants/game';
import { useGameStore } from '@/app/stores/game';
import useSettingsStore from '@/app/stores/settings';

const BinsRow: React.FC = () => {
  const { winRecords, rowCount, riskLevel } = useGameStore();
  const { isAnimationOn } = useSettingsStore();
  const binRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (winRecords.length && isAnimationOn) {
      const lastWinBinIndex = winRecords[winRecords.length - 1].binIndex;
      playAnimation(lastWinBinIndex);
    }
  }, [winRecords, isAnimationOn]);

  const playAnimation = (binIndex: number) => {
    const bin = binRefs.current[binIndex];
    if (!bin) return;

    const animation = bin.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(30%)' },
        { transform: 'translateY(0)' },
      ],
      {
        duration: 300,
        easing: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
      }
    );

    animation.play();
  };

  return (
    <div className="flex h-[clamp(10px,0.352px+2.609vw,16px)] w-full justify-center lg:h-7">
      <div className="flex gap-[1%]" style={{ width: '100%' }}>
        {binPayouts[rowCount][riskLevel].map((payout, binIndex) => (
          <div
            key={`bin-${binIndex}`}
            ref={(el) => {
              binRefs.current[binIndex] = el;
            }}
            className="flex min-w-0 flex-1 items-center justify-center rounded-sm text-[clamp(6px,2.784px+0.87vw,8px)] font-bold text-gray-950 shadow-[0_2px_var(--shadow-color)] lg:rounded-md lg:text-[clamp(10px,-16.944px+2.632vw,12px)] lg:shadow-[0_3px_var(--shadow-color)]"
            style={{
              backgroundColor: binColorsByRowCount[rowCount].background[binIndex],
              '--shadow-color': binColorsByRowCount[rowCount].shadow[binIndex],
            } as React.CSSProperties}
          >
            {payout}{payout < 100 ? '×' : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BinsRow;