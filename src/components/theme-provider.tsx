import { useState, useEffect } from "react"
import { Theme, ThemeProviderContext } from "./theme-context"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey)
    return (stored as Theme) || defaultTheme
  })

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

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme: (newTheme: Theme) => {
          localStorage.setItem(storageKey, newTheme)
          setTheme(newTheme)
        },
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}
