'use client';

import React, { useState } from 'react';
import { EventItem, ExpenseCategory, ExpenseItem } from '@/types';
import {
  IconPlus,
  IconTrash,
  IconEdit,
  IconClose,
  IconAlert,
  IconCheck,
  IconArrowRight,
} from './Icons';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  const [category, setCategory] = useState<ExpenseCategory>('Catering');
  const [description, setDescription] = useState('');
  const [plannedAmount, setPlannedAmount] = useState<number | ''>(5000);
  const [actualAmount, setActualAmount] = useState<number | ''>(0);
  const [paidAmount, setPaidAmount] = useState<number | ''>(0);
  const [status, setStatus] = useState<'Planned' | 'Partially Paid' | 'Paid'>('Planned');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  if (!activeEvent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink-900">
          No celebration selected
        </h2>
        <p className="text-sm text-ink-600 max-w-md mx-auto">
          Please select an active event or create a new celebration to manage your budget.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="px-6 py-2.5 rounded-lg bg-ink-900 text-white font-medium text-xs sm:text-sm"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-300 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
            Precision Financial Framework
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink-900 mt-1">
            Every rupee, thoughtfully planned.
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 font-mono mt-1">
            {activeEvent.title} · Budget: ₹{Number(activeEvent.totalBudget).toLocaleString('en-IN')}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-ink-900 hover:bg-ink-950 text-white font-medium text-xs sm:text-sm shadow-subtle transition-all active:scale-[0.98]"
        >
          <IconPlus className="w-3.5 h-3.5 text-gold-400" />
          <span>Add Expense Item</span>
        </button>
      </div>

      {/* AI Cost-Saving Alert Box */}
      {isOverBudget ? (
        <div className="p-6 rounded-2xl bg-ruby-50 border border-ruby-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <IconAlert className="w-5 h-5 text-ruby-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-ruby-900">
                Budget Overrun Detected: ₹{summary.overBudgetAmount.toLocaleString('en-IN')}
              </h4>
              <p className="text-xs text-ruby-800 mt-0.5 font-normal">
                Your estimated expenses exceed your budget by ₹{summary.overBudgetAmount.toLocaleString('en-IN')}. Would you like AI to suggest adjustments?
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('recommendations')}
            className="px-4 py-2 rounded-lg bg-ruby-600 hover:bg-ruby-700 text-white text-xs font-medium shadow-subtle transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Review Cost-Saving Adjustments
          </button>
        </div>
      ) : isNearLimit ? (
        <div className="p-6 rounded-2xl bg-paper-100 border border-gold-300 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <IconAlert className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-ink-900">
                Budget Utilization at {summary.utilizationPercentage}%
              </h4>
              <p className="text-xs text-ink-600 mt-0.5 font-normal">
                ₹{summary.remainingAmount.toLocaleString('en-IN')} remaining of total ₹{summary.totalBudget.toLocaleString('en-IN')}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('recommendations')}
            className="px-4 py-2 rounded-lg bg-gold-600 hover:bg-gold-700 text-white text-xs font-medium shadow-subtle transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Explore Budget Optimizations
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <IconCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900 uppercase font-mono tracking-wider">
                Budget on track with ₹{summary.remainingAmount.toLocaleString('en-IN')} buffer
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Committed expenses represent {summary.utilizationPercentage}% of total celebration fund.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('studio')}
            className="px-4 py-2 rounded-lg bg-white hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold border border-emerald-300 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Review AI Allocations
          </button>
        </div>
      )}

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
            Total Budget
          </span>
          <p className="font-serif text-3xl font-bold text-ink-900">
            ₹{summary.totalBudget.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-ink-400">Target cap</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
            Planned Expenses
          </span>
          <p className="font-serif text-3xl font-bold text-ink-900">
            ₹{summary.plannedExpenses.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-ink-400">Total estimated items</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
            Actual Expenses
          </span>
          <p className="font-serif text-3xl font-bold text-gold-700">
            ₹{summary.actualExpenses.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-gold-600 font-medium">Invoiced or committed</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
            Remaining Balance
          </span>
          <p className={`font-serif text-3xl font-bold ${isOverBudget ? 'text-ruby-600' : 'text-emerald-700'}`}>
            ₹{summary.remainingAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-ink-400">
            {isOverBudget ? 'Exceeded' : 'Contingency reserve'}
          </p>
        </div>
      </div>

      {/* Utilization Progress Bar */}
      <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-mono text-ink-600">Budget Utilization Status</span>
          <span className="font-mono font-bold text-ink-900">
            {summary.utilizationPercentage}% Spent ({isOverBudget ? 'Over Budget' : 'Within Budget'})
          </span>
        </div>
        <div className="w-full bg-paper-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-ruby-500' : isNearLimit ? 'bg-gold-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${Math.min(100, summary.utilizationPercentage)}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-ink-900">
            Category Breakdown
          </h3>
          <span className="text-xs font-mono text-ink-400">
            Live Math Sync
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(summary.categoryTotals).map(([cat, val]) => (
            <div key={cat} className="p-4 rounded-xl bg-white border border-paper-300 shadow-subtle space-y-1">
              <p className="text-xs font-medium text-ink-500 truncate">{cat}</p>
              <p className="font-serif text-base font-bold text-ink-900">
                ₹{val.actual.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] font-mono text-ink-400">
                Plan: ₹{val.planned.toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-paper-300 shadow-card overflow-hidden space-y-4">
        <div className="p-6 border-b border-paper-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-ink-900">
              Detailed Expense Items
            </h3>
            <p className="text-xs text-ink-500 font-mono">
              {filteredExpenses.length} expense line items recorded
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => setSelectedCategoryFilter('All')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedCategoryFilter === 'All'
                  ? 'bg-ink-900 text-white font-semibold'
                  : 'bg-paper-200 text-ink-700 hover:bg-paper-300'
              }`}
            >
              All
            </button>
            {categoriesList.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedCategoryFilter === cat
                    ? 'bg-ink-900 text-white font-semibold'
                    : 'bg-paper-200 text-ink-700 hover:bg-paper-300'
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
            <thead className="bg-paper-100 border-b border-paper-300 text-ink-500 uppercase tracking-wider font-mono text-[10px]">
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
            <tbody className="divide-y divide-paper-200">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-ink-400">
                    No expense records found. Click &quot;Add Expense Item&quot; to log costs.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-paper-50 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-ink-900">
                      {exp.category}
                    </td>
                    <td className="py-3.5 px-6 text-ink-800">
                      {exp.description}
                    </td>
                    <td className="py-3.5 px-6 text-ink-500 font-mono">
                      {exp.date}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono text-ink-600">
                      ₹{exp.plannedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono font-bold text-ink-900">
                      ₹{exp.actualAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono font-medium text-emerald-700">
                      ₹{exp.paidAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                          exp.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : exp.status === 'Partially Paid'
                            ? 'bg-gold-100 text-gold-800'
                            : 'bg-paper-200 text-ink-700'
                        }`}
                      >
                        {exp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(exp)}
                        className="p-1 rounded text-ink-500 hover:text-ink-900 hover:bg-paper-200 transition-colors"
                        title="Edit Expense"
                      >
                        <IconEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1 rounded text-ink-500 hover:text-ruby-600 hover:bg-ruby-50 transition-colors"
                        title="Delete Expense"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-elevation border border-paper-300 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-paper-200 pb-4">
              <h3 className="font-serif text-xl font-bold text-ink-900">
                {editingExpense ? 'Edit Expense Item' : 'Add New Expense Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-ink-400 hover:text-ink-700"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Royal Shehnai Ensemble or Mandap Florals"
                  className="w-full px-3 py-2 rounded-lg border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Planned (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={plannedAmount}
                    onChange={(e) => setPlannedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Actual (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={actualAmount}
                    onChange={(e) => setActualAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Paid So Far (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Paid">Paid in Full</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                />
              </div>

              <div className="pt-4 border-t border-paper-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-ink-600 hover:bg-paper-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-ink-900 hover:bg-ink-950 text-white font-semibold text-xs shadow-subtle"
                >
                  {editingExpense ? 'Save Changes' : 'Add Line Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
