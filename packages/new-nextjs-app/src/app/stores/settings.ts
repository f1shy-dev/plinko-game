import { useState, useEffect } from 'react';

const useSettingsStore = () => {
  const [isAnimationOn, setIsAnimationOn] = useState(true);

  useEffect(() => {
    const storedIsAnimationOn = localStorage.getItem('isAnimationOn');
    if (storedIsAnimationOn) {
      setIsAnimationOn(JSON.parse(storedIsAnimationOn));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isAnimationOn', JSON.stringify(isAnimationOn));
  }, [isAnimationOn]);

  return {
    isAnimationOn,
    setIsAnimationOn,
  };
};

export default useSettingsStore;
