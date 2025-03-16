import { TourStep } from './TourContext';

export const subscriptionTourSteps: TourStep[] = [
  {
    title: 'Welcome to Subra!',
    content: 'Your personal subscription manager is ready to help you track and optimize your recurring expenses. Let\'s take a quick tour of the main features.',
    position: 'center',
    isWelcomeStep: true
  },
  {
    targetId: 'add-subscription-button',
    title: 'Add Your Subscriptions',
    content: 'Click this button to add a new subscription. You can enter details like the service name, cost, billing cycle, and set up reminders for upcoming payments.',
    position: 'bottom'
  },
  {
    targetId: 'subscription-list',
    title: 'Your Active Subscriptions',
    content: 'This is your main subscription dashboard. Each card shows key information like cost, next billing date, and total spent. Click any subscription to view more details or make changes.',
    position: 'center'
  },
  {
    targetId: 'settings-button',
    title: 'Customize Your Experience',
    content: 'Access your account settings here. You can set your preferred currency, configure notifications, and manage your payment tracking preferences.',
    position: 'bottom'
  },
  {
    targetId: 'expense-summary',
    title: 'Track Your Spending',
    content: 'This summary shows your total subscription costs. Click to view the currency breakdown, or click the period label to switch between weekly, monthly, and yearly views.',
    position: 'top'
  }
]; 