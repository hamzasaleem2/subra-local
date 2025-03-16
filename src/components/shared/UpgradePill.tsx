import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function UpgradePill() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://subra.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20 hover:border-primary hover:from-primary/20 hover:to-primary/10 text-primary/80 hover:text-primary transition-all duration-300"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              <span className="font-medium">Pro</span>
            </Button>
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upgrade to Subra Cloud for email reminders, multi-device sync, and more!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 