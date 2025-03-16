import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { RootLayout } from "./layouts/RootLayout"
import { DashboardPage } from "./pages/DashboardPage"
import { SettingsPage } from "./pages/SettingsPage"
import { Toaster } from "sonner"

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard/*" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </HelmetProvider>
  )
}
