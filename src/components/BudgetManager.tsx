'use client';

import React, { useState } from 'react';
import { EventItem, ExpenseCategory, ExpenseItem } from '@/types';
import {
  Wallet,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Percent,
  X,
  IndianRupee,
} from 'lucide-react';
import {
  calculateBudgetSummary,
  addExpenseToEvent,
  updateExpenseInEvent,
  deleteExpenseFromEvent,
} from '@/lib/storage';

interface BudgetManagerProps {
  activeEvent: EventItem | null;
  onOpenCreateModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  activeEvent,
  onOpenCreateModal,
  onNavigateTab,
}) => {
  // Modal states for adding/editing expense
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  // Form field states
  const [category, setCategory] = useState<ExpenseCategory>('Catering');
  const [description, setDescription] = useState('');
  const [plannedAmount, setPlannedAmount] = useState<number | ''>(5000);
  const [actualAmount, setActualAmount] = useState<number | ''>(0);
  const [paidAmount, setPaidAmount] = useState<number | ''>(0);
  const [status, setStatus] = useState<'Planned' | 'Partially Paid' | 'Paid'>('Planned');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Category filter
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  if (!activeEvent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Wallet className="w-12 h-12 text-champagne-600 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">
          No celebration selected
        </h2>
        <p className="text-sm text-charcoal-600 max-w-md mx-auto">
          Please select an active event or create a new celebration to manage your budget.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="px-6 py-2.5 rounded-full bg-terracotta-600 text-white font-medium text-xs sm:text-sm"
        >
          Create New Event
        </button>
      </div>
    );
  }

  const summary = calculateBudgetSummary(activeEvent);
  const isOverBudget = summary.overBudgetAmount > 0;
  const isNearLimit = !isOverBudget && summary.utilizationPercentage > 85;

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setCategory('Catering');
    setDescription('');
    setPlannedAmount(5000);
    setActualAmount(0);
    setPaidAmount(0);
    setStatus('Planned');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exp: ExpenseItem) => {
    setEditingExpense(exp);
    setCategory(exp.category as ExpenseCategory);
    setDescription(exp.description);
    setPlannedAmount(exp.plannedAmount);
    setActualAmount(exp.actualAmount);
    setPaidAmount(exp.paidAmount);
    setStatus(exp.status);
    setDate(exp.date);
    setIsModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    if (editingExpense) {
      updateExpenseInEvent(activeEvent.id, {
        ...editingExpense,
        category,
        description: description.trim(),
        plannedAmount: Number(plannedAmount) || 0,
        actualAmount: Number(actualAmount) || 0,
        paidAmount: Number(paidAmount) || 0,
        status,
        date,
      });
    } else {
      addExpenseToEvent(activeEvent.id, {
        category,
        description: description.trim(),
        plannedAmount: Number(plannedAmount) || 0,
        actualAmount: Number(actualAmount) || 0,
        paidAmount: Number(paidAmount) || 0,
        status,
        date,
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Are you sure you want to remove this expense entry?')) {
      deleteExpenseFromEvent(activeEvent.id, expenseId);
    }
  };

  const categoriesList: ExpenseCategory[] = [
    'Venue',
    'Catering',
    'Decoration',
    'Photography',
    'Entertainment',
    'Logistics',
    'Miscellaneous',
    'Makeup and styling',
    'Transportation',
  ];

  const filteredExpenses = (activeEvent.expenses || []).filter((exp) =>
    selectedCategoryFilter === 'All' ? true : exp.category === selectedCategoryFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
              Financial Control & Precision
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900 mt-1">
            Every rupee, thoughtfully planned.
          </h1>
          <p className="text-sm text-charcoal-600 mt-1">
            Active Event: <span className="font-semibold text-charcoal-900">{activeEvent.title}</span> ({activeEvent.eventType} · {activeEvent.location})
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-xs sm:text-sm shadow-subtle hover:shadow-card transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* AI Cost-Saving Alert Box (Matching PRD requirement) */}
      {isOverBudget ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Budget Overrun Detected: ₹{summary.overBudgetAmount.toLocaleString('en-IN')}
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Your estimated expenses exceed your budget by ₹{summary.overBudgetAmount.toLocaleString('en-IN')}. Would you like AI to suggest adjustments?
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('recommendations')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Review Cost-Saving Suggestions
          </button>
        </div>
      ) : isNearLimit ? (
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Budget Reaching Capacity ({summary.utilizationPercentage}%)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                ₹{summary.remainingAmount.toLocaleString('en-IN')} remaining of total ₹{summary.totalBudget.toLocaleString('en-IN')}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('recommendations')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Explore Budget Optimizations
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900">
                Budget is on track with a healthy ₹{summary.remainingAmount.toLocaleString('en-IN')} buffer
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Committed expenses represent {summary.utilizationPercentage}% of total allocated celebration fund.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('studio')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold border border-emerald-300 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            View AI Allocation Rationale
          </button>
        </div>
      )}

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Total Budget
          </span>
          <p className="font-serif text-3xl font-bold text-charcoal-900">
            ₹{summary.totalBudget.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-charcoal-400">Fixed target cap</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Planned Expenses
          </span>
          <p className="font-serif text-3xl font-bold text-charcoal-900">
            ₹{summary.plannedExpenses.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-charcoal-400">Sum of estimated items</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Actual Expenses
          </span>
          <p className="font-serif text-3xl font-bold text-terracotta-700">
            ₹{summary.actualExpenses.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-terracotta-600 font-medium">Committed or invoiced</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Remaining Balance
          </span>
          <p className={`font-serif text-3xl font-bold ${isOverBudget ? 'text-rose-600' : 'text-emerald-700'}`}>
            ₹{summary.remainingAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-charcoal-400">
            {isOverBudget ? 'Overspent' : 'Available for contingency'}
          </p>
        </div>
      </div>

      {/* Utilization Progress Bar */}
      <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-charcoal-700">Budget Utilization Status</span>
          <span className="font-bold text-charcoal-900">
            {summary.utilizationPercentage}% Spent ({isOverBudget ? 'Over Budget' : 'Within Budget'})
          </span>
        </div>
        <div className="w-full bg-ivory-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isOverBudget ? 'bg-rose-500' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${Math.min(100, summary.utilizationPercentage)}%` }}
          />
        </div>
      </div>

      {/* Category-Wise Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-charcoal-900">
            Category-Wise Breakdown
          </h3>
          <span className="text-xs text-charcoal-400">
            Calculated from line items
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(summary.categoryTotals).map(([cat, val]) => (
            <div key={cat} className="p-4 rounded-xl bg-white border border-ivory-200 shadow-subtle space-y-1">
              <p className="text-xs font-medium text-charcoal-500 truncate">{cat}</p>
              <p className="font-serif text-base font-bold text-charcoal-900">
                ₹{val.actual.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-charcoal-400">
                Plan: ₹{val.planned.toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Table Section */}
      <div className="bg-white rounded-3xl border border-ivory-200 shadow-card overflow-hidden space-y-4">
        <div className="p-6 border-b border-ivory-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Detailed Expense Items
            </h3>
            <p className="text-xs text-charcoal-500">
              {filteredExpenses.length} expense records for this celebration
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedCategoryFilter('All')}
              className={`px-3 py-1 rounded-full transition-colors ${
                selectedCategoryFilter === 'All'
                  ? 'bg-terracotta-600 text-white font-semibold'
                  : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              All
            </button>
            {categoriesList.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full transition-colors ${
                  selectedCategoryFilter === cat
                    ? 'bg-terracotta-600 text-white font-semibold'
                    : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-50/70 border-b border-ivory-200 text-charcoal-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Planned (₹)</th>
                <th className="py-3 px-6 text-right">Actual (₹)</th>
                <th className="py-3 px-6 text-right">Paid (₹)</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-charcoal-400">
                    No expense items found. Click &quot;Add Expense&quot; above to log spending.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-charcoal-900">
                      {exp.category}
                    </td>
                    <td className="py-3.5 px-6 text-charcoal-800">
                      {exp.description}
                    </td>
                    <td className="py-3.5 px-6 text-charcoal-500">
                      {exp.date}
                    </td>
                    <td className="py-3.5 px-6 text-right font-medium text-charcoal-600">
                      ₹{exp.plannedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-charcoal-900">
                      ₹{exp.actualAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6 text-right font-medium text-emerald-700">
                      ₹{exp.paidAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          exp.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : exp.status === 'Partially Paid'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-ivory-200 text-charcoal-700'
                        }`}
                      >
                        {exp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(exp)}
                        className="p-1 rounded text-charcoal-500 hover:text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                        title="Edit Expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1 rounded text-charcoal-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-floating border border-ivory-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                {editingExpense ? 'Edit Expense Item' : 'Add New Expense'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Traditional Dhol Players or Floral Stage Mandap"
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Planned (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={plannedAmount}
                    onChange={(e) => setPlannedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Actual (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={actualAmount}
                    onChange={(e) => setActualAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Paid So Far (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Paid">Paid in Full</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                />
              </div>

              <div className="pt-4 border-t border-ivory-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-charcoal-600 hover:bg-ivory-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-xs shadow-subtle"
                >
                  {editingExpense ? 'Save Changes' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

