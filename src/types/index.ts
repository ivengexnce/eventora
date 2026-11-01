export type EventType = 'Wedding' | 'Birthday' | 'Community';
export type ThemeType = 'Traditional' | 'Modern' | 'Minimal' | 'Custom';

export type ExpenseCategory =
  | 'Venue'
  | 'Catering'
  | 'Decoration'
  | 'Photography'
  | 'Entertainment'
  | 'Logistics'
  | 'Miscellaneous'
  | 'Makeup and styling'
  | 'Transportation';

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export type VendorCategory =
  | 'Venue'
  | 'Catering'
  | 'Photography'
  | 'Decoration'
  | 'Makeup and styling'
  | 'Entertainment'
  | 'Transportation'
  | 'Other';

export type VendorStatus =
  | 'Not contacted'
  | 'Contacted'
  | 'Negotiating'
  | 'Confirmed'
  | 'Cancelled';

export interface ExpenseItem {
  id: string;
  eventId: string;
  category: ExpenseCategory | string;
  description: string;
  plannedAmount: number;
  actualAmount: number;
  paidAmount: number;
  status: 'Planned' | 'Partially Paid' | 'Paid';
  date: string;
}

export interface TaskItem {
  id: string;
  eventId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  daysBeforeEvent?: number;
}

export interface VendorItem {
  id: string;
  eventId: string;
  name: string;
  category: VendorCategory | string;
  contact: {
    phone?: string;
    email?: string;
    contactPerson?: string;
    website?: string;
  };
  estimatedCost: number;
  actualCost?: number;
  bookingStatus: VendorStatus;
  notes: string;
  deliverables?: string[];
}

export interface RecommendationItem {
  id: string;
  category: 'Theme' | 'Decor' | 'Food' | 'Entertainment' | 'Guest Activities' | 'Cost Saving' | 'Location Tip';
  title: string;
  description: string;
  budgetImpact?: 'Low' | 'Medium' | 'High Savings' | 'Cost Neutral';
  tags: string[];
}

export interface BudgetDistributionItem {
  category: string;
  suggestedAmount: number;
  percentage: number;
  rationale: string;
}

export interface AIEventPlan {
  id: string;
  eventId: string;
  concept: string;
  tagline?: string;
  theme: {
    name: string;
    description: string;
    colorPalette: string[];
    styleNotes: string[];
  };
  decorationIdeas: Array<{
    title: string;
    description: string;
    placement: string;
  }>;
  cateringSuggestions: {
    cuisineStyle: string;
    menuHighlights: string[];
    dietaryConsiderations: string[];
    beveragePairings: string[];
  };
  budgetDistribution: BudgetDistributionItem[];
  planningTimeline: Array<{
    stage: string;
    timeframe: string;
    tasks: string[];
  }>;
  vendorChecklist: Array<{
    category: string;
    priority: 'Essential' | 'Recommended' | 'Optional';
    questionsToAsk: string[];
  }>;
  entertainmentAndActivities: Array<{
    name: string;
    description: string;
    suitableFor: string;
  }>;
  personalizedRecommendations: Array<{
    title: string;
    category: string;
    advice: string;
  }>;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  eventType: EventType;
  eventDate: string; // ISO date YYYY-MM-DD
  location: string;
  guestCount: number;
  totalBudget: number; // in INR ₹
  theme: ThemeType | string;
  preferences: string;
  createdAt: string;
  updatedAt: string;
  aiPlan?: AIEventPlan;
  expenses: ExpenseItem[];
  tasks: TaskItem[];
  vendors: VendorItem[];
  recommendations: RecommendationItem[];
}

export interface BudgetSummary {
  totalBudget: number;
  plannedExpenses: number;
  actualExpenses: number;
  remainingAmount: number;
  overBudgetAmount: number;
  utilizationPercentage: number;
  categoryTotals: Record<string, { planned: number; actual: number }>;
}

