"use client";

import React, { useState, useEffect } from 'react';
import useLayoutStore from '@/app/stores/layout';
import  useSettingsStore  from '@/app/stores/settings';
import { hasPreferReducedMotion } from '../utils/accessibility';

import * as Label from '@radix-ui/react-label';
import { GearSix } from 'phosphor-react';
import DraggableWindow from './ui/DraggableWindow';
import Switch from './ui/Switch';

const SettingsWindow: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [animationOn, setAnimationOn] = useState(true);

  const { isGameSettingsOpen,setIsGameSettingsOpen } = useLayoutStore();
  const { isAnimationOn, setIsAnimationOn } = useSettingsStore();

  useEffect(() => {
    if (hasPreferReducedMotion()) {
      setIsAnimationOn(false);
    }
  }, []);
  
  const handleClose = () => {
    setIsGameSettingsOpen(false);
  };

  const handleAnimationToggle = () => {
    setIsAnimationOn(!isAnimationOn);
  };

  if (!isOpen) return null;

  return (
    <DraggableWindow onClose={handleClose} className="fixed bottom-8 left-8 w-[18rem]">
      <div slot="title" className="flex items-center gap-2">
        <GearSix weight="fill" className="text-xl text-slate-300" />
        <p className="text-sm font-medium text-white">Game Settings</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Switch id="isAnimationOn" checked={isAnimationOn} onChange={handleAnimationToggle} />
          <Label.Root htmlFor="isAnimationOn" className="text-sm text-white">
            Animations
          </Label.Root>
        </div>
      </div>
    </DraggableWindow>
  );
};

export default SettingsWindow;