import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { downloadAsCSV } from "@/lib/export";
import { useState } from "react";
import { SEO } from "@/components/shared/seo";
import { toast } from "sonner";
import { useSubscriptions, usePreferences, useCurrencies } from "@/lib/hooks";
import { ExchangeRatesSettings } from "@/components/settings/ExchangeRatesSettings";

export function SettingsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const { subscriptions } = useSubscriptions();
  const { preferences, updatePreferences } = usePreferences();
  const { currencies } = useCurrencies();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      if (!subscriptions || subscriptions.length === 0) {
        throw new Error("No subscriptions to export");
      }
      downloadAsCSV(subscriptions);
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: string) => {
    if (!preferences) return;
    
    const updatedPreferences = {
      ...preferences,
      [key]: value
    };
    updatePreferences(updatedPreferences);
    toast.success("Preferences updated successfully");
  };

  return (
    <>
      <SEO 
        title="Settings - Subra"
        description="Manage your preferences"
      />

      <div className="container max-w-7xl py-6 md:py-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Settings
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Manage your preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Export Data</h2>
                <div className="bg-card border rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium">Export Subscriptions</h3>
                      <p className="text-sm text-muted-foreground">
                        Download your subscription data as CSV
                      </p>
                    </div>
                    <Button 
                      onClick={handleExport}
                      disabled={isExporting || !subscriptions || subscriptions.length === 0}
                    >
                      {isExporting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Export
                    </Button>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <ExchangeRatesSettings />
              </section>
            </div>

            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Subscription Preferences</h2>
                <div className="bg-card border rounded-lg p-4 sm:p-6">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Sort Subscriptions By
                      </label>
                      <Select 
                        value={preferences?.sortSubscriptionsBy ?? "name"}
                        onValueChange={(value) => handlePreferenceChange("sortSubscriptionsBy", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="amount">Amount</SelectItem>
                          <SelectItem value="dueDate">Due Date</SelectItem>
                          <SelectItem value="nextPayment">Next Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Default Currency
                      </label>
                      <Select 
                        value={preferences?.defaultCurrency ?? "USD"}
                        onValueChange={(value) => handlePreferenceChange("defaultCurrency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies
                            .filter(currency => currency.isEnabled)
                            .sort((a, b) => a.code.localeCompare(b.code))
                            .map(currency => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.name} ({currency.symbol})
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        View Total As
                      </label>
                      <Select 
                        value={preferences?.totalViewType ?? "average"}
                        onValueChange={(value) => handlePreferenceChange("totalViewType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="average">Average Expenses</SelectItem>
                          <SelectItem value="remaining">Remaining Expenses</SelectItem>
                          <SelectItem value="total">Total Expenses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 