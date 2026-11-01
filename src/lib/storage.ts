import { EventItem, BudgetSummary, ExpenseItem, TaskItem, VendorItem, AIEventPlan } from '@/types';
import { initialEvents } from '@/data/initialEvents';

const STORAGE_KEY = 'eventora_events_data_v1';
const ACTIVE_EVENT_KEY = 'eventora_active_event_id';

export function getStoredEvents(): EventItem[] {
  if (typeof window === 'undefined') {
    return initialEvents;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
      return initialEvents;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
    return initialEvents;
  } catch (err) {
    console.error('Error reading events from localStorage:', err);
    return initialEvents;
  }
}

export function saveStoredEvents(events: EventItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    window.dispatchEvent(new CustomEvent('eventora-events-updated', { detail: events }));
  } catch (err) {
    console.error('Error saving events to localStorage:', err);
  }
}

export function getActiveEventId(): string {
  if (typeof window === 'undefined') {
    return initialEvents[0].id;
  }
  const saved = localStorage.getItem(ACTIVE_EVENT_KEY);
  if (saved) return saved;
  const first = getStoredEvents()[0];
  return first ? first.id : 'evt-mumbai-birthday';
}

export function setActiveEventId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_EVENT_KEY, id);
  window.dispatchEvent(new CustomEvent('eventora-active-event-changed', { detail: id }));
}

export function calculateBudgetSummary(event: EventItem): BudgetSummary {
  const totalBudget = Number(event.totalBudget) || 0;
  let plannedExpenses = 0;
  let actualExpenses = 0;
  const categoryTotals: Record<string, { planned: number; actual: number }> = {};

  (event.expenses || []).forEach((exp) => {
    const planned = Number(exp.plannedAmount) || 0;
    const actual = Number(exp.actualAmount) || 0;
    plannedExpenses += planned;
    actualExpenses += actual;

    const cat = exp.category || 'Miscellaneous';
    if (!categoryTotals[cat]) {
      categoryTotals[cat] = { planned: 0, actual: 0 };
    }
    categoryTotals[cat].planned += planned;
    categoryTotals[cat].actual += actual;
  });

  const remainingAmount = Math.max(0, totalBudget - actualExpenses);
  const overBudgetAmount = actualExpenses > totalBudget ? actualExpenses - totalBudget : 0;
  const utilizationPercentage = totalBudget > 0 ? Math.min(100, Math.round((actualExpenses / totalBudget) * 100)) : 0;

  return {
    totalBudget,
    plannedExpenses,
    actualExpenses,
    remainingAmount,
    overBudgetAmount,
    utilizationPercentage,
    categoryTotals,
  };
}

export function calculateDashboardMetrics(events: EventItem[]) {
  let combinedBudget = 0;
  let combinedExpenses = 0;
  let totalTasks = 0;
  let completedTasks = 0;

  events.forEach((evt) => {
    combinedBudget += Number(evt.totalBudget) || 0;
    (evt.expenses || []).forEach((e) => {
      combinedExpenses += Number(e.actualAmount) || 0;
    });
    (evt.tasks || []).forEach((t) => {
      totalTasks++;
      if (t.status === 'Completed') {
        completedTasks++;
      }
    });
  });

  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    activeEventsCount: events.length,
    combinedBudget,
    combinedExpenses,
    totalTasks,
    completedTasks,
    taskCompletionRate,
  };
}

export function addOrUpdateEvent(updatedEvent: EventItem): void {
  const events = getStoredEvents();
  const index = events.findIndex((e) => e.id === updatedEvent.id);
  if (index >= 0) {
    events[index] = { ...updatedEvent, updatedAt: new Date().toISOString() };
  } else {
    events.unshift(updatedEvent);
  }
  saveStoredEvents(events);
}

export function deleteEvent(eventId: string): void {
  const events = getStoredEvents().filter((e) => e.id !== eventId);
  saveStoredEvents(events);
}

export function addExpenseToEvent(eventId: string, expense: Omit<ExpenseItem, 'id' | 'eventId'>): void {
  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  const newExpense: ExpenseItem = {
    ...expense,
    id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    eventId,
  };

  event.expenses = [newExpense, ...(event.expenses || [])];
  event.updatedAt = new Date().toISOString();
  saveStoredEvents(events);
}

export function updateExpenseInEvent(eventId: string, updatedExpense: ExpenseItem): void {
  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  event.expenses = (event.expenses || []).map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp));
  event.updatedAt = new Date().toISOString();
  saveStoredEvents(events);
}

export function deleteExpenseFromEvent(eventId: string, expenseId: string): void {
  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  event.expenses = (event.expenses || []).filter((exp) => exp.id !== expenseId);
  event.updatedAt = new Date().toISOString();
  saveStoredEvents(events);
}

export function addTaskToEvent(eventId: string, task: Omit<TaskItem, 'id' | 'eventId'>): void {
  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  const newTask: TaskItem = {
    ...task,
    id: `tsk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    eventId,
  };

  event.tasks = [newTask, ...(event.tasks || [])];
  event.updatedAt = new Date().toISOString();
  saveStoredEvents(events);
}

export function updateTaskInEvent(eventId: string, updatedTask: TaskItem): void {
  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  event.tasks = (event.tasks || []).map((t) => (t.id === updatedTask.id ? updatedTask : t));
  event.updatedAt = new Date().toISOString();
  saveStoredEvents(events);
}

export function deleteTaskFromEvent(eventId: string, taskId: string): void {
  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  event.tasks = (event.tasks || []).filter((t) => t.id !== taskId);
  event.updatedAt = new Date().toISOString();
  saveStoredEvents(events);
}

export function toggleTaskStatus(eventId: string, taskId: string): void {
  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  event.tasks = (event.tasks || []).map((t) => {
    if (t.id === taskId) {
      return {
        ...t,
        status: t.status === 'Completed' ? 'Pending' : 'Completed',
      };
    }
    return t;
  });
  event.updatedAt = new Date().toISOString();
  saveStoredEvents(events);
}

export function addVendorToEvent(eventId: string, vendor: Omit<VendorItem, 'id' | 'eventId'>): void {
  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  const newVendor: VendorItem = {
    ...vendor,
    id: `ven-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    eventId,
  };

  event.vendors = [newVendor, ...(event.vendors || [])];
  event.updatedAt = new Date().toISOString();
  saveStoredEvents(events);
}

export function updateVendorInEvent(eventId: string, updatedVendor: VendorItem): void {
  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  event.vendors = (event.vendors || []).map((v) => (v.id === updatedVendor.id ? updatedVendor : v));
  event.updatedAt = new Date().toISOString();
  saveStoredEvents(events);
}

export function deleteVendorFromEvent(eventId: string, vendorId: string): void {
  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  event.vendors = (event.vendors || []).filter((v) => v.id !== vendorId);
  event.updatedAt = new Date().toISOString();
  saveStoredEvents(events);
}

export function attachAIPlanToEvent(eventId: string, aiPlan: AIEventPlan): void {
  const events = getStoredEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  event.aiPlan = aiPlan;
  event.updatedAt = new Date().toISOString();
  saveStoredEvents(events);
}

