import { Button } from "@/components/ui/button"
import { SEO } from "@/components/shared/seo"
import { Settings, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { AddSubscriptionDialog } from "@/components/subscriptions/AddSubscriptionDialog"
import { SubscriptionDashboard } from "@/components/subscriptions/SubscriptionDashboard"
import { TourProvider } from "@/components/tour/TourContext"
import { TourManager } from "@/components/tour/TourManager"
import { subscriptionTourSteps } from "@/components/tour/subscriptionTourConfig"
import { useTour } from "@/components/tour/TourContext"
import { WelcomeDialog } from "@/components/WelcomeDialog"
import { UpgradePromoBanner } from "@/components/shared/UpgradePromoBanner"
import { UpgradePill } from "@/components/shared/UpgradePill"

function DashboardContent() {
  const { startTour } = useTour();

  return (
    <>
      <SEO 
        title="Subra Local"
        description="Escape the Subscription Trap"
      />
      <UpgradePromoBanner />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-6">
          <div id="subscription-header" className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium">Subscriptions</h2>
              <Button
                variant="outline"
                onClick={() => startTour(subscriptionTourSteps)}
                className="h-8 px-3 gap-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:border-primary hover:from-primary/20 hover:to-primary/10 text-primary/80 hover:text-primary transition-all duration-300 shadow-sm"
              >
                <span className="text-sm font-medium">Take a Tour</span>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <UpgradePill />
              <Link to="/settings">
                <Button id="settings-button" variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <AddSubscriptionDialog>
                <Button id="add-subscription-button" size="sm" className="h-8">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add
                </Button>
              </AddSubscriptionDialog>
            </div>
          </div>
          
          <SubscriptionDashboard />
        </div>
      </div>
      <WelcomeDialog />
      <TourManager />
    </>
  )
}

export function DashboardPage() {
  return (
    <TourProvider>
      <DashboardContent />
    </TourProvider>
  )
}

