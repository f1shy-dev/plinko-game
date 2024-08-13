import React, { useEffect, useRef, useState } from 'react';
import { useStore } from 'react-redux';
import { binColorsByRowCount, binPayouts } from '../../constants/game';
import { plinkoEngine, riskLevel, rowCount, winRecords } from '../../stores/game';
import { isAnimationOn } from '../../stores/settings';

const BinsRow = () => {
  const [binAnimations, setBinAnimations] = useState([]);
  const winRecordsState = useStore(winRecords);
  const rowCountState = useStore(rowCount);
  const riskLevelState = useStore(riskLevel);
  const plinkoEngineState = useStore(plinkoEngine);
  const isAnimationOnState = useStore(isAnimationOn);

  useEffect(() => {
    if (winRecordsState.length) {
      const lastWinBinIndex = winRecordsState[winRecordsState.length - 1].binIndex;
      playAnimation(lastWinBinIndex);
    }
  }, [winRecordsState]);

  const initAnimation = (node, binIndex) => {
    const bounceAnimation = node.animate(
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
    bounceAnimation.pause();
    setBinAnimations((prev) => {
      const newAnimations = [...prev];
      newAnimations[binIndex] = bounceAnimation;
      return newAnimations;
    });
  };

  const playAnimation = (binIndex) => {
    if (!isAnimationOnState) {
      return;
    }

    const animation = binAnimations[binIndex];
    animation.cancel();
    animation.play();
  };

  return (
    <div className="flex h-[clamp(10px,0.352px+2.609vw,16px)] w-full justify-center lg:h-7">
      {plinkoEngineState && (
        <div className="flex gap-[1%]" style={{ width: `${(plinkoEngineState.binsWidthPercentage ?? 0) * 100}%` }}>
          {binPayouts[rowCountState][riskLevelState].map((payout, binIndex) => (
            <div
              key={binIndex}
              ref={(node) => node && initAnimation(node, binIndex)}
              className="flex min-w-0 flex-1 items-center justify-center rounded-sm text-[clamp(6px,2.784px+0.87vw,8px)] font-bold text-gray-950 shadow-[0_2px_var(--shadow-color)] lg:rounded-md lg:text-[clamp(10px,-16.944px+2.632vw,12px)] lg:shadow-[0_3px_var(--shadow-color)]"
              style={{
                backgroundColor: binColorsByRowCount[rowCountState].background[binIndex],
                '--shadow-color': binColorsByRowCount[rowCountState].shadow[binIndex],
              }}
            >
              {payout}{payout < 100 ? '×' : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BinsRow;
