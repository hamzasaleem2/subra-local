import React, { useState, useCallback } from 'react';
import { TourStep, TourContext, TourContextType } from './tour-context';
export { useTour } from './tour-hooks';

export type { TourStep };

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [hasTourBeenShown, setHasTourBeenShown] = useState(() => {
    const stored = localStorage.getItem('hasTourBeenShown');
    return stored ? JSON.parse(stored) : false;
  });

  const startTour = useCallback((newSteps: TourStep[]) => {
    setSteps(newSteps);
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsActive(false);
      setHasTourBeenShown(true);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setHasTourBeenShown(true);
  }, []);

  React.useEffect(() => {
    if (hasTourBeenShown) {
      localStorage.setItem('hasTourBeenShown', JSON.stringify(true));
    }
  }, [hasTourBeenShown]);

  const value: TourContextType = {
    isActive,
    currentStep,
    steps,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    hasTourBeenShown,
    setHasTourBeenShown,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}; 