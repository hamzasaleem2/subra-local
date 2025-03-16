import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { exchangeRates, currencies } from "@/lib/db"
import type { ExchangeRates } from "@/lib/db/types"

export function ExchangeRatesSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [rates, setRates] = useState<ExchangeRates | null>(() => {
    const currentRates = exchangeRates.query()[0]
    return currentRates || null
  })

  const enabledCurrencies = currencies.query().filter(c => c.isEnabled && c.code !== "USD")

  const handleRateChange = (currencyCode: string, value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    setRates(prev => {
      if (!prev) return null
      return {
        ...prev,
        rates: {
          ...prev.rates,
          [currencyCode]: numValue
        }
      }
    })
  }

  const handleSave = async () => {
    if (!rates) return

    setIsLoading(true)
    try {
      const updatedRates = {
        ...rates,
        timestamp: Date.now()
      }
      await exchangeRates.update(rates._id, updatedRates)
      toast.success("Exchange rates updated successfully")
    } catch (error) {
      console.error("Failed to update exchange rates:", error)
      toast.error("Failed to update exchange rates")
    } finally {
      setIsLoading(false)
    }
  }

  if (!rates) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exchange Rates</CardTitle>
        <CardDescription>
          Set exchange rates relative to USD. These rates are used to convert amounts between different currencies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {enabledCurrencies.map((currency) => (
              <div key={currency.code} className="space-y-2">
                <label className="text-sm font-medium">
                  1 USD = <span className="text-muted-foreground">{currency.symbol}</span>
                </label>
                <Input
                  type="number"
                  value={rates.rates[currency.code]}
                  onChange={(e) => handleRateChange(currency.code, e.target.value)}
                  step="0.0001"
                  min="0"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 