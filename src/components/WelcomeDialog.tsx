import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Database, Lock, Laptop, ArrowRight } from "lucide-react";
import { useTour } from "@/components/tour/TourContext";
import { subscriptionTourSteps } from "@/components/tour/subscriptionTourConfig";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { startTour, hasTourBeenShown } = useTour();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsOpen(true);
    } else if (!hasTourBeenShown) {
      startTour(subscriptionTourSteps);
    }
  }, [hasTourBeenShown, startTour]);

  const handleClose = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setIsOpen(false);
    
    if (!hasTourBeenShown) {
      startTour(subscriptionTourSteps);
    }
  };

  const features = [
    {
      icon: Laptop,
      title: "Local-First Experience",
      description: "Your data stays on your device. No cloud sync, no servers - just pure local storage for maximum privacy and control.",
    },
    {
      icon: Lock,
      title: "Enhanced Privacy",
      description: "Your subscription data never leaves your device, ensuring complete privacy and security of your financial information.",
    },
    {
      icon: Database,
      title: "Data Ownership",
      description: "You have full control over your data. It's stored locally on your device, and you can export or delete it anytime.",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <div className="relative">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          
          <div className="relative p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                Welcome to Subra Local
              </DialogTitle>
              <DialogDescription className="pt-6">
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <MotionDiv
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <div className="mt-1">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Footer with gradient border */}
          <div className="p-6 sm:p-8 border-t bg-gradient-to-b from-background to-background/80">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button 
                onClick={handleClose} 
                className="w-full sm:w-auto group relative overflow-hidden px-8"
                size="lg"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-100" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 