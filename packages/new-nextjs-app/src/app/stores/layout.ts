import { useState, useEffect } from 'react';

const useLayoutStore = () => {
  const [isGameSettingsOpen, setIsGameSettingsOpen] = useState(false);
  const [isLiveStatsOpen, setIsLiveStatsOpen] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('isGameSettingsOpen', JSON.stringify(isGameSettingsOpen));
      localStorage.setItem('isLiveStatsOpen', JSON.stringify(isLiveStatsOpen));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isGameSettingsOpen, isLiveStatsOpen]);

  useEffect(() => {
    const storedIsGameSettingsOpen = localStorage.getItem('isGameSettingsOpen');
    const storedIsLiveStatsOpen = localStorage.getItem('isLiveStatsOpen');

    if (storedIsGameSettingsOpen) {
      setIsGameSettingsOpen(JSON.parse(storedIsGameSettingsOpen));
    }

    if (storedIsLiveStatsOpen) {
      setIsLiveStatsOpen(JSON.parse(storedIsLiveStatsOpen));
    }
  }, []);

  return {
    isGameSettingsOpen,
    setIsGameSettingsOpen,
    isLiveStatsOpen,
    setIsLiveStatsOpen,
  };
};

export default useLayoutStore;
