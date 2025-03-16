import React from 'react';
import { useTour } from './TourContext';
import { TourStep } from './TourStep';

export const TourManager: React.FC = () => {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTour } = useTour();

  if (!isActive || steps.length === 0) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <TourStep
      {...step}
      onNext={nextStep}
      onPrev={prevStep}
      onSkip={skipTour}
      isFirst={currentStep === 0}
      isLast={currentStep === steps.length - 1}
    />
  );
}; 