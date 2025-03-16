import { Subscription } from "./db/types";

export function downloadAsCSV(subscriptions: Subscription[], filename?: string) {
  const headers = [
    "Name",
    "Amount",
    "Currency",
    "Billing Frequency",
    "Next Payment",
    "Categories",
    "Description"
  ];

  const rows = subscriptions.map(sub => [
    sub.name,
    sub.amount.toString(),
    sub.currency,
    sub.billingCycle.frequency,
    new Date(sub.billingCycle.startDate).toLocaleDateString(),
    sub.categories?.join(", ") || "",
    sub.description || ""
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename || `subscriptions-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 