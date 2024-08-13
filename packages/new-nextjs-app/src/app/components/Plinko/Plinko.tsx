import React, { useEffect, useRef, useState } from 'react';
import CircleNotch from 'phosphor-react/lib/CircleNotch';
import BinsRow from './BinsRow';
import LastWins from './LastWins';
import PlinkoEngine from './PlinkoEngine';
import { useStore } from 'react-redux';
import { plinkoEngine } from '../../stores/game';

const Plinko = () => {
  const [plinkoEngineState, setPlinkoEngineState] = useState(null);
  const plinkoEngineStore = useStore(plinkoEngine);
  const canvasRef = useRef(null);

  useEffect(() => {
    const engine = new PlinkoEngine(canvasRef.current);
    engine.start();
    setPlinkoEngineState(engine);
    plinkoEngineStore.setState(engine);

    return () => {
      engine.stop();
      plinkoEngineStore.setState(null);
    };
  }, [plinkoEngineStore]);

  return (
    <div className="relative bg-gray-900">
      <div className="mx-auto flex h-full flex-col px-4 pb-4" style={{ maxWidth: `${PlinkoEngine.WIDTH}px` }}>
        <div className="relative w-full" style={{ aspectRatio: `${PlinkoEngine.WIDTH} / ${PlinkoEngine.HEIGHT}` }}>
          {!plinkoEngineState && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <CircleNotch className="size-20 animate-spin text-slate-600" weight="bold" />
            </div>
          )}
          <canvas ref={canvasRef} width={PlinkoEngine.WIDTH} height={PlinkoEngine.HEIGHT} className="absolute inset-0 h-full w-full" />
        </div>
        <BinsRow />
      </div>
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2">
        <LastWins />
      </div>
    </div>
  );
};

export default Plinko;
