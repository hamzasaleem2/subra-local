import { createContext } from 'react';

export interface TourStep {
  targetId?: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  isWelcomeStep?: boolean;
}

export interface TourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: (steps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  setHasTourBeenShown: (value: boolean) => void;
  hasTourBeenShown: boolean;
}

export const TourContext = createContext<TourContextType | undefined>(undefined); 