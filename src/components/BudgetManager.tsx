'use client';

import React, { useState, useEffect } from 'react';
import { EventItem, ExpenseCategory, ExpenseItem } from '@/types';
import {
  IconPlus,
  IconTrash,
  IconEdit,
  IconClose,
  IconAlert,
  IconCheck,
  IconArrowRight,
  IconPieChart,
  IconChartBar,
  IconSlider,
} from './Icons';
import {
  calculateBudgetSummary,
  addExpenseToEvent,
  updateExpenseInEvent,
  deleteExpenseFromEvent,
} from '@/lib/storage';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import confetti from 'canvas-confetti';

interface BudgetManagerProps {
  activeEvent: EventItem | null;
  onOpenCreateModal: () => void;
  onNavigateTab: (tab: string) => void;
}

const PALETTE_COLORS = [
  '#A38035', // Aged Brass
  '#1A4331', // Forest Pine
  '#6366F1', // Indigo
  '#A83839', // Terra-Cotta
  '#8A6B27', // Dark Gold
  '#06B6D4', // Cyan Slate
  '#235840', // Deep Moss
  '#71551A', // Bronze
  '#8E2A2B', // Wine
];

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  activeEvent,
  onOpenCreateModal,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'ledger' | 'simulator'>('analytics');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  // Form states
  const [category, setCategory] = useState<ExpenseCategory>('Catering');
  const [description, setDescription] = useState('');
  const [plannedAmount, setPlannedAmount] = useState<number | ''>(5000);
  const [actualAmount, setActualAmount] = useState<number | ''>(0);
  const [paidAmount, setPaidAmount] = useState<number | ''>(0);
  const [status, setStatus] = useState<'Planned' | 'Partially Paid' | 'Paid'>('Planned');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Interactive AI Budget Simulator State
  const initialBudget = activeEvent ? Number(activeEvent.totalBudget) : 100000;
  const [simulatedBudget, setSimulatedBudget] = useState<number>(initialBudget);

  useEffect(() => {
    if (activeEvent) {
      setSimulatedBudget(Number(activeEvent.totalBudget));
    }
  }, [activeEvent?.totalBudget]);

  if (!activeEvent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink-900">
          No celebration selected
        </h2>
        <p className="text-sm text-ink-600 max-w-md mx-auto">
          Please select an active celebration or create a new one to manage your precision budget.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="px-6 py-2.5 rounded-sm bg-ink-900 text-white font-medium text-xs sm:text-sm hover:bg-ink-950 transition-colors"
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

      // Confetti burst on adding new expense
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#A38035', '#1A4331', '#8E2A2B'],
        });
      } catch (err) {}
    }

    setIsModalOpen(false);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Are you sure you want to remove this expense record?')) {
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

  // Prepare Recharts Data
  const pieData = Object.entries(summary.categoryTotals)
    .filter(([_, val]) => (val.actual > 0 || val.planned > 0))
    .map(([cat, val]) => ({
      name: cat,
      value: val.actual > 0 ? val.actual : val.planned,
      planned: val.planned,
      actual: val.actual,
    }));

  const barData = Object.entries(summary.categoryTotals).map(([cat, val]) => ({
    name: cat.length > 10 ? `${cat.slice(0, 9)}.` : cat,
    fullName: cat,
    Planned: val.planned,
    Actual: val.actual,
  }));

  // Simulator Math
  const simRatio = simulatedBudget / (Number(activeEvent.totalBudget) || 1);
  const simVariance = simulatedBudget - Number(activeEvent.totalBudget);

  const customTooltipFormatter = (value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, ''];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
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
            {activeEvent.title} · Target Fund: ₹{Number(activeEvent.totalBudget).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-950 text-white font-medium text-xs sm:text-sm transition-colors active:scale-[0.99]"
          >
            <IconPlus className="w-4 h-4 text-gold-400" />
            <span>Add Expense Item</span>
          </button>
        </div>
      </div>

      {/* AI Cost-Saving Alert Box */}
      {isOverBudget ? (
        <div className="p-6 rounded-sm bg-ruby-50 border border-ruby-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            className="px-4 py-2 rounded-sm bg-ruby-600 hover:bg-ruby-700 text-white text-xs font-semibold transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Review AI Cost-Saving Adjustments
          </button>
        </div>
      ) : isNearLimit ? (
        <div className="p-6 rounded-sm bg-paper-100 border border-gold-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <IconAlert className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-ink-900">
                Budget Utilization Reaching {summary.utilizationPercentage}%
              </h4>
              <p className="text-xs text-ink-600 mt-0.5 font-normal">
                ₹{summary.remainingAmount.toLocaleString('en-IN')} remaining of total fund ₹{summary.totalBudget.toLocaleString('en-IN')}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('recommendations')}
            className="px-4 py-2 rounded-sm bg-gold-600 hover:bg-gold-700 text-white text-xs font-semibold transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Explore Budget Optimizations
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-sm bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <IconCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900 uppercase font-mono tracking-wider">
                Budget Healthy: ₹{summary.remainingAmount.toLocaleString('en-IN')} contingency buffer
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5 font-sans">
                Committed expenses represent {summary.utilizationPercentage}% of total celebration fund.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('studio')}
            className="px-4 py-2 rounded-sm bg-card hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold border border-emerald-300 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Review AI Allocations
          </button>
        </div>
      )}

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-sm bg-card border border-paper-300 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
            Total Budget
          </span>
          <p className="font-serif text-3xl font-bold text-ink-900">
            ₹{summary.totalBudget.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-ink-400">Target allocation cap</p>
        </div>

        <div className="p-6 rounded-sm bg-card border border-paper-300 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
            Planned Expenses
          </span>
          <p className="font-serif text-3xl font-bold text-ink-900">
            ₹{summary.plannedExpenses.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-ink-400">Estimated commitments</p>
        </div>

        <div className="p-6 rounded-sm bg-card border border-paper-300 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
            Actual Expenses
          </span>
          <p className="font-serif text-3xl font-bold text-gold-700">
            ₹{summary.actualExpenses.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-gold-600 font-medium">Invoiced or locked</p>
        </div>

        <div className="p-6 rounded-sm bg-card border border-paper-300 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
            Remaining Buffer
          </span>
          <p className={`font-serif text-3xl font-bold ${isOverBudget ? 'text-ruby-600' : 'text-emerald-700'}`}>
            ₹{summary.remainingAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-ink-400">
            {isOverBudget ? 'Over Budget' : 'Safe contingency'}
          </p>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-paper-300 gap-2 font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-semibold transition-colors ${
            activeSubTab === 'analytics'
              ? 'border-ink-900 text-ink-900'
              : 'border-transparent text-ink-500 hover:text-ink-800'
          }`}
        >
          <IconPieChart className="w-4 h-4 text-gold-600" />
          <span>Visual Distribution & Comparison</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-semibold transition-colors ${
            activeSubTab === 'ledger'
              ? 'border-ink-900 text-ink-900'
              : 'border-transparent text-ink-500 hover:text-ink-800'
          }`}
        >
          <IconChartBar className="w-4 h-4 text-emerald-600" />
          <span>Expense Ledger ({filteredExpenses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-semibold transition-colors ${
            activeSubTab === 'simulator'
              ? 'border-ink-900 text-ink-900'
              : 'border-transparent text-ink-500 hover:text-ink-800'
          }`}
        >
          <IconSlider className="w-4 h-4 text-gold-600" />
          <span>AI What-If Budget Simulator</span>
        </button>
      </div>

      {/* TAB 1: Visual Analytics */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donut Chart: Category Share */}
            <div className="bg-card rounded-sm border border-paper-300 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink-900">
                    Category Allocation Share
                  </h3>
                  <p className="text-xs text-ink-500 font-mono">
                    Real-time distribution across active categories
                  </p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-paper-200 text-ink-700">
                  ₹ INR
                </span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PALETTE_COLORS[index % PALETTE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={customTooltipFormatter} />
                    <Legend verticalAlign="bottom" height={36} iconType="square" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Planned vs Actual Expenses */}
            <div className="bg-card rounded-sm border border-paper-300 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink-900">
                    Planned vs. Actual Spend
                  </h3>
                  <p className="text-xs text-ink-500 font-mono">
                    Side-by-side expense tracking per department
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 bg-paper-400" />
                    <span>Planned</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 bg-gold-600" />
                    <span>Actual</span>
                  </span>
                </div>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDD7C8" />
                    <XAxis dataKey="name" stroke="#575B66" fontSize={11} />
                    <YAxis stroke="#575B66" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <Tooltip formatter={customTooltipFormatter} />
                    <Bar dataKey="Planned" fill="#C9C1AF" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Actual" fill="#A38035" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Departmental Summary Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-ink-500">
              Departmental Summary Cards
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(summary.categoryTotals).map(([cat, val]) => (
                <div key={cat} className="p-4 rounded-sm bg-card border border-paper-300 space-y-1">
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
        </div>
      )}

      {/* TAB 2: Expense Ledger */}
      {activeSubTab === 'ledger' && (
        <div className="bg-card rounded-sm border border-paper-300 overflow-hidden space-y-4">
          <div className="p-6 border-b border-paper-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-ink-900">
                Detailed Expense Ledger
              </h3>
              <p className="text-xs text-ink-500 font-mono">
                {filteredExpenses.length} expense line items logged
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setSelectedCategoryFilter('All')}
                className={`px-3 py-1 rounded-sm transition-colors ${
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
                  className={`px-3 py-1 rounded-sm transition-colors ${
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
                          className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider ${
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
                          className="p-1 rounded-sm text-ink-500 hover:text-ink-900 hover:bg-paper-200 transition-colors"
                          title="Edit Expense"
                        >
                          <IconEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1 rounded-sm text-ink-500 hover:text-ruby-600 hover:bg-ruby-50 transition-colors"
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
      )}

      {/* TAB 3: AI What-If Budget Simulator */}
      {activeSubTab === 'simulator' && (
        <div className="bg-card rounded-sm border border-paper-300 p-6 sm:p-8 space-y-8">
          <div className="border-b border-paper-200 pb-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
              Interactive Scenario Modeling
            </span>
            <h3 className="font-serif text-2xl font-bold text-ink-900 mt-1">
              AI Budget What-If Simulator
            </h3>
            <p className="text-xs sm:text-sm text-ink-600 max-w-2xl mt-1 font-sans">
              Test how scaling your budget up or down recalculates departmental targets and impacts your celebration without compromising guest experience.
            </p>
          </div>

          {/* Interactive Slider */}
          <div className="p-6 rounded-sm bg-paper-100 border border-paper-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-mono uppercase tracking-wider text-ink-700 font-semibold">
                Simulated Target Budget:
              </label>
              <div className="flex items-center space-x-3">
                <span className="font-serif text-2xl font-bold text-ink-900">
                  ₹{simulatedBudget.toLocaleString('en-IN')}
                </span>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded-sm font-semibold ${
                    simVariance > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : simVariance < 0
                      ? 'bg-ruby-100 text-ruby-800'
                      : 'bg-paper-200 text-ink-700'
                  }`}
                >
                  {simVariance > 0
                    ? `+₹${simVariance.toLocaleString('en-IN')} expansion`
                    : simVariance < 0
                    ? `-₹${Math.abs(simVariance).toLocaleString('en-IN')} reduction`
                    : 'Current Base'}
                </span>
              </div>
            </div>

            <input
              type="range"
              min={Math.max(15000, Math.round(Number(activeEvent.totalBudget) * 0.4))}
              max={Math.round(Number(activeEvent.totalBudget) * 1.8)}
              step={5000}
              value={simulatedBudget}
              onChange={(e) => setSimulatedBudget(Number(e.target.value))}
              className="w-full h-2 bg-paper-300 appearance-none cursor-pointer accent-ink-900 rounded-none"
            />

            <div className="flex justify-between text-[11px] font-mono text-ink-400">
              <span>Min: ₹{Math.max(15000, Math.round(Number(activeEvent.totalBudget) * 0.4)).toLocaleString('en-IN')}</span>
              <span>Baseline: ₹{Number(activeEvent.totalBudget).toLocaleString('en-IN')}</span>
              <span>Max: ₹{Math.round(Number(activeEvent.totalBudget) * 1.8).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Simulated Category Reallocation Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-ink-600">
              Dynamic AI Reallocation Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(summary.categoryTotals).map(([cat, val]) => {
                const simulatedVal = Math.round(val.planned * simRatio);
                return (
                  <div key={cat} className="p-4 rounded-sm border border-paper-200 bg-paper-50 space-y-1">
                    <p className="text-xs text-ink-500 font-medium">{cat}</p>
                    <p className="font-serif text-lg font-bold text-ink-900">
                      ₹{simulatedVal.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] font-mono text-ink-400">
                      Base: ₹{val.planned.toLocaleString('en-IN')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Strategic Assessment for this Scenario */}
          <div className="p-5 rounded-sm bg-gold-50 border border-gold-200 space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gold-700 font-bold">
              AI Trade-Off Analysis for ₹{simulatedBudget.toLocaleString('en-IN')} Scenario:
            </h4>
            <p className="text-xs sm:text-sm text-ink-800 leading-relaxed font-normal font-sans">
              {simVariance < 0
                ? `To scale down by ₹${Math.abs(simVariance).toLocaleString('en-IN')}, AI advises switching from imported florals to local jasmine and marigolds (saving ~₹12,000), substituting plated courses with live interactive grazing thali counters (saving ~₹18,000), and hiring a 2-person acoustic duo rather than a full 5-piece amplified band.`
                : simVariance > 0
                ? `With ₹${simVariance.toLocaleString('en-IN')} surplus expansion, AI advises adding drone aerial videography for the grand arrival, upgrading to customized dessert live stations with nitrogen kulfi, and adding keepsake brass favors for all ${activeEvent.guestCount} guests.`
                : `Your current plan of ₹${simulatedBudget.toLocaleString('en-IN')} is optimally weighted across venue, culinary excellence, and entertainment for ${activeEvent.location}.`}
            </p>
          </div>
        </div>
      )}

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-card border border-paper-300 rounded-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-paper-200 pb-4">
              <h3 className="font-serif text-xl font-bold text-ink-900">
                {editingExpense ? 'Edit Expense Item' : 'Add New Expense Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-sm text-ink-400 hover:text-ink-700"
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
                  className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
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
                  className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
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
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
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
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
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
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
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
                  className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                />
              </div>

              <div className="pt-4 border-t border-paper-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-sm text-xs font-semibold text-ink-600 hover:bg-paper-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-sm bg-ink-900 hover:bg-ink-950 text-white font-semibold text-xs"
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
