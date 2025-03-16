import { useContext, useEffect } from "react"
import { ThemeProviderContext, type Theme } from "./theme-context"

export function useTheme() {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  const { theme, setTheme } = context

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem("vite-ui-theme", theme)
      setTheme(theme)
    },
  }
} 