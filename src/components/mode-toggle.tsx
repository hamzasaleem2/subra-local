import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-hooks"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-8 w-8 rounded-md bg-transparent transition-colors duration-200 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 cursor-default"
        >
          <Sun className="absolute h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="mt-2 w-36 rounded-md border bg-popover p-1"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-default rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
        >
          <Sun className="h-[1.2rem] w-[1.2rem]" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-default rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
        >
          <Moon className="h-[1.2rem] w-[1.2rem]" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-default rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
        >
          <span className="h-[1.2rem] w-[1.2rem] flex items-center justify-center">💻</span>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
