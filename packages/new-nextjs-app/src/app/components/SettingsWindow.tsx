"use client";

import React, { useState, useEffect } from 'react';
import { isGameSettingsOpen } from '../stores/layout';
import { isAnimationOn } from '../stores/settings';
import { hasPreferReducedMotion } from '../utils/settings';
import { Label } from 'bits-ui';
import GearSix from 'phosphor-react/lib/GearSix';
import DraggableWindow from './ui/DraggableWindow';
import Switch from './ui/Switch';

const SettingsWindow: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animationOn, setAnimationOn] = useState(true);

  useEffect(() => {
    if (hasPreferReducedMotion()) {
      setAnimationOn(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = isGameSettingsOpen.subscribe(setIsOpen);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = isAnimationOn.subscribe(setAnimationOn);
    return () => unsubscribe();
  }, []);

  const handleClose = () => {
    isGameSettingsOpen.set(false);
  };

  const handleAnimationToggle = () => {
    isAnimationOn.set(!animationOn);
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
          <Switch id="isAnimationOn" checked={animationOn} onChange={handleAnimationToggle} />
          <Label.Root htmlFor="isAnimationOn" className="text-sm text-white">
            Animations
          </Label.Root>
        </div>
      </div>
    </DraggableWindow>
  );
};

export default SettingsWindow;
