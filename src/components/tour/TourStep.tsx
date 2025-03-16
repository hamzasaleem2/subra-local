import React from 'react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface TourStepProps {
  targetId?: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  className?: string;
  onNext?: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isWelcomeStep?: boolean;
}

export const TourStep: React.FC<TourStepProps> = ({
  targetId,
  title,
  content,
  position = 'bottom',
  className,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
  isWelcomeStep,
}) => {
  const [coords, setCoords] = React.useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const stepRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  React.useEffect(() => {
    if (isWelcomeStep) {
      setCoords({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        width: 0,
        height: 0,
      });
      return;
    }

    const updatePosition = () => {
      const element = targetId ? document.getElementById(targetId) : null;
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [targetId, isWelcomeStep]);

  if (!coords) return null;

  const isMobile = windowWidth < 768;
  const stepWidth = isMobile ? Math.min(windowWidth - 32, 350) : 350;

  const getStepPosition = () => {
    if (isWelcomeStep) {
      return {
        top: window.innerHeight / 2 - (stepRef.current?.offsetHeight || 160) / 2,
        left: window.innerWidth / 2 - stepWidth / 2,
      };
    }

    const padding = isMobile ? 12 : 20;
    const stepHeight = stepRef.current?.offsetHeight || 160;
    
    if (isMobile) {
      const spaceBelow = window.innerHeight - (coords.top + coords.height);
      const spaceAbove = coords.top;
      
      if (spaceBelow >= stepHeight + padding) {
        return {
          top: coords.top + coords.height + padding,
          left: Math.max(16, Math.min(windowWidth - stepWidth - 16, coords.left + (coords.width / 2) - (stepWidth / 2))),
        };
      } else if (spaceAbove >= stepHeight + padding) {
        return {
          top: coords.top - stepHeight - padding,
          left: Math.max(16, Math.min(windowWidth - stepWidth - 16, coords.left + (coords.width / 2) - (stepWidth / 2))),
        };
      }
      return {
        top: window.innerHeight / 2 - stepHeight / 2,
        left: Math.max(16, Math.min(windowWidth - stepWidth - 16, coords.left + (coords.width / 2) - (stepWidth / 2))),
      };
    }

    switch (position) {
      case 'top':
        return {
          top: coords.top - padding - stepHeight,
          left: Math.max(16, Math.min(windowWidth - stepWidth - 16, coords.left + (coords.width / 2) - (stepWidth / 2))),
        };
      case 'bottom':
        return {
          top: coords.top + coords.height + padding,
          left: Math.max(16, Math.min(windowWidth - stepWidth - 16, coords.left + (coords.width / 2) - (stepWidth / 2))),
        };
      case 'left':
        return {
          top: coords.top + (coords.height / 2) - (stepHeight / 2),
          left: Math.max(16, coords.left - padding - stepWidth),
        };
      case 'right':
        return {
          top: coords.top + (coords.height / 2) - (stepHeight / 2),
          left: Math.min(windowWidth - stepWidth - 16, coords.left + coords.width + padding),
        };
      case 'center':
        return {
          top: coords.top + (coords.height / 2) + padding,
          left: Math.max(16, Math.min(windowWidth - stepWidth - 16, coords.left + (coords.width / 2) - (stepWidth / 2))),
        };
      default:
        return {
          top: coords.top + coords.height + padding,
          left: Math.max(16, Math.min(windowWidth - stepWidth - 16, coords.left + (coords.width / 2) - (stepWidth / 2))),
        };
    }
  };

  const stepPosition = getStepPosition();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {!isWelcomeStep && (
          <div
            className="fixed inset-0 bg-black/30 z-[99999] transition-opacity duration-300"
            style={{
              clipPath: `path('M 0 0 L 0 100% L 100% 100% L 100% 0 L 0 0 Z M ${coords.left - 8} ${coords.top - 8} L ${coords.left + coords.width + 8} ${coords.top - 8} L ${coords.left + coords.width + 8} ${coords.top + coords.height + 8} L ${coords.left - 8} ${coords.top + coords.height + 8} Z')`
            }}
          />
        )}

        {isWelcomeStep && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99999] transition-opacity duration-300" />
        )}
        
        {!isWelcomeStep && (
          <motion.div
            className="absolute border-2 border-muted-foreground rounded-lg z-[99999]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              top: coords.top - 4,
              left: coords.left - 4,
              width: coords.width + 8,
              height: coords.height + 8,
            }}
          />
        )}
        
        <motion.div
          ref={stepRef}
          className={cn(
            "fixed z-[999999] bg-background border rounded-xl shadow-lg p-4 sm:p-6",
            isWelcomeStep && "shadow-2xl border-primary",
            "border-border",
            className
          )}
          style={{
            top: stepPosition.top,
            left: stepPosition.left,
            width: stepWidth,
            maxWidth: `calc(100vw - 32px)`,
          }}
          initial={{ opacity: 0, y: position === 'top' ? -20 : 20, scale: isWelcomeStep ? 0.9 : 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">{content}</p>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">
            <div className="flex flex-row flex-wrap items-center gap-2">
              {!isFirst && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onPrev}
                  className="flex-1 sm:flex-initial px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors min-w-[100px]"
                >
                  Previous
                </motion.button>
              )}
              {!isLast && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNext}
                  className="flex-1 sm:flex-initial px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors min-w-[100px]"
                >
                  {isWelcomeStep ? "Start Tour" : "Next"}
                </motion.button>
              )}
              {isLast && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSkip}
                  className="flex-1 sm:flex-initial px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors min-w-[100px]"
                >
                  Finish
                </motion.button>
              )}
            </div>
            {isWelcomeStep && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSkip}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto text-center sm:text-right"
              >
                Skip tour
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 