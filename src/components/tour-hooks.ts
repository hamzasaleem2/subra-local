import { useContext } from "react"
import { TourContext } from "./TourContext"

export function useTour() {
  const context = useContext(TourContext)

  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider")
  }

  return context
} 