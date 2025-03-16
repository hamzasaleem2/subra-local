import { createContext, useState } from "react"

type TourContextType = {
  currentStep: number
  setCurrentStep: (step: number) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const initialState: TourContextType = {
  currentStep: 0,
  setCurrentStep: () => null,
  isOpen: false,
  setIsOpen: () => null,
}

export const TourContext = createContext<TourContextType>(initialState)

export type TourProviderProps = {
  children: React.ReactNode
}

export function TourProvider({ children }: TourProviderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TourContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </TourContext.Provider>
  )
} 