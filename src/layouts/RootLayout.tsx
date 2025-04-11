import { Outlet, Link } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function RootLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background cursor-default pt-12 h-[calc(100vh-48px)] overflow-y-auto">
        <header className="fixed top-0 left-0 right-0 h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
          <div className="container flex h-full items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="text-muted-foreground font-bold select-none hover:text-foreground transition-colors cursor-default">
                Subra
              </Link>
              <div className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground/70 border border-border/40">
                Local
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://github.com/hamzasaleem2/subra-local" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm" className="p-0 h-8">
                        <img 
                          src="/github-mark/github-mark.svg"
                          className="h-5 w-5 dark:hidden"
                          alt="GitHub"
                        />
                        <img 
                          src="/github-mark/github-mark-white.svg"
                          className="hidden h-5 w-5 dark:block"
                          alt="GitHub"
                        />
                        <span className="sr-only">View on GitHub</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View on GitHub</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <ModeToggle />
            </div>
          </div>
        </header>
        <Outlet />
      </div>
    </ThemeProvider>
  )
} 