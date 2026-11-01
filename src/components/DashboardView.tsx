'use client';

import React from 'react';
import { EventItem } from '@/types';
import {
  Calendar,
  Wallet,
  CheckCircle2,
  Plus,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  MapPin,
  Users2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { calculateBudgetSummary, calculateDashboardMetrics } from '@/lib/storage';

interface DashboardViewProps {
  events: EventItem[];
  activeEvent: EventItem | null;
  onSelectEvent: (eventId: string) => void;
  onOpenCreateModal: () => void;
  onNavigateTab: (tab: string) => void;
  onToggleTask: (eventId: string, taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onOpenCreateModal,
  onNavigateTab,
  onToggleTask,
}) => {
  const metrics = calculateDashboardMetrics(events);
  const activeSummary = activeEvent ? calculateBudgetSummary(activeEvent) : null;

  // Gather upcoming deadlines across active event or all events
  const allTasks = events.flatMap((e) =>
    (e.tasks || []).map((t) => ({ ...t, eventTitle: e.title, eventId: e.id }))
  );
  const upcomingDeadlines = allTasks
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Gather recent activities dynamically
  const activities = [
    {
      id: 'act-1',
      title: 'AI Studio Plan Synchronized',
      detail: `Generated comprehensive blueprint for "${activeEvent?.title || 'Celebration'}"`,
      time: 'Just now',
      type: 'ai',
    },
    {
      id: 'act-2',
      title: 'Budget Allocation Balanced',
      detail: `₹${metrics.combinedExpenses.toLocaleString('en-IN')} actual expenses tracked across ${metrics.activeEventsCount} events`,
      time: '2 hours ago',
      type: 'budget',
    },
    {
      id: 'act-3',
      title: 'Milestone Completed',
      detail: `${metrics.completedTasks} tasks verified and marked ready`,
      time: 'Today',
      type: 'task',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900">
            Let&apos;s make something worth celebrating.
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 mt-1">
            Your celebrations, plans and priorities — all in one place.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-xs sm:text-sm shadow-subtle hover:shadow-card transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Top 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Active Events */}
        <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-2 hover:border-terracotta-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Active Events
            </span>
            <div className="w-8 h-8 rounded-lg bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-charcoal-900">
              {metrics.activeEventsCount}
            </span>
            <span className="text-xs text-charcoal-400">celebrations</span>
          </div>
          <p className="text-[11px] text-terracotta-600 font-medium">
            Ready for execution
          </p>
        </div>

        {/* Total Budget */}
        <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-2 hover:border-champagne-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Total Budget
            </span>
            <div className="w-8 h-8 rounded-lg bg-champagne-50 text-champagne-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-charcoal-900">
              ₹{metrics.combinedBudget.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-charcoal-500">
            Combined planned budget
          </p>
        </div>

        {/* Total Expenses */}
        <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-2 hover:border-ivory-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Total Expenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-ivory-100 text-charcoal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-charcoal-900">
              ₹{metrics.combinedExpenses.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-charcoal-500">
            Actual committed spend
          </p>
        </div>

        {/* Tasks Completed */}
        <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Tasks Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-charcoal-900">
              {metrics.taskCompletionRate}%
            </span>
            <span className="text-xs text-charcoal-400">
              ({metrics.completedTasks}/{metrics.totalTasks})
            </span>
          </div>
          <div className="w-full bg-ivory-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${metrics.taskCompletionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Celebrations & Planning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Events List (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal-900">
                Upcoming Celebrations
              </h2>
              <p className="text-xs text-charcoal-500">
                Click any event to switch active workspace focus
              </p>
            </div>
            <span className="text-xs text-charcoal-400 font-medium">
              {events.length} Active
            </span>
          </div>

          <div className="space-y-4">
            {events.map((evt) => {
              const summary = calculateBudgetSummary(evt);
              const isActive = activeEvent?.id === evt.id;
              const completedCount = (evt.tasks || []).filter((t) => t.status === 'Completed').length;
              const totalCount = (evt.tasks || []).length;
              const taskPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt.id)}
                  className={`p-6 rounded-2xl bg-white border transition-all cursor-pointer hover:shadow-card ${
                    isActive
                      ? 'border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-card'
                      : 'border-ivory-200 hover:border-ivory-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            evt.eventType === 'Wedding'
                              ? 'bg-rose-100 text-rose-800'
                              : evt.eventType === 'Birthday'
                              ? 'bg-terracotta-100 text-terracotta-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {evt.eventType}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-terracotta-50 text-terracotta-700 text-[10px] font-semibold border border-terracotta-200">
                            Active Focus
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-charcoal-900">
                        {evt.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
                          <span>{evt.eventDate}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                          <span>{evt.location}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center space-x-1">
                          <Users2 className="w-3.5 h-3.5 text-terracotta-500" />
                          <span>{evt.guestCount} guests</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between self-start sm:self-auto gap-2">
                      <p className="font-serif text-lg font-bold text-charcoal-900">
                        ₹{Number(evt.totalBudget).toLocaleString('en-IN')}
                      </p>
                      <div className="flex items-center space-x-2 text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEvent(evt.id);
                            onNavigateTab('studio');
                          }}
                          className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 font-semibold transition-colors"
                        >
                          <span>AI Studio</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress bars within card */}
                  <div className="mt-4 pt-4 border-t border-ivory-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="flex justify-between text-charcoal-500 mb-1">
                        <span>Milestone Progress</span>
                        <span className="font-semibold text-charcoal-800">{taskPercent}%</span>
                      </div>
                      <div className="w-full bg-ivory-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${taskPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-charcoal-500 mb-1">
                        <span>Budget Spent</span>
                        <span className="font-semibold text-charcoal-800">
                          ₹{summary.actualExpenses.toLocaleString('en-IN')} / ₹{summary.totalBudget.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full bg-ivory-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            summary.overBudgetAmount > 0 ? 'bg-rose-500' : 'bg-champagne-500'
                          }`}
                          style={{ width: `${summary.utilizationPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Planning Progress Breakdown */}
          {activeEvent && (
            <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal-900">
                    Event Planning Progress: {activeEvent.title}
                  </h3>
                  <p className="text-xs text-charcoal-500">
                    Current readiness indicators for celebration day
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('timeline')}
                  className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 inline-flex items-center space-x-1"
                >
                  <span>View Timeline</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-200">
                  <p className="text-xs text-charcoal-500">Tasks Completed</p>
                  <p className="font-serif text-xl font-bold text-charcoal-900 mt-1">
                    {(activeEvent.tasks || []).filter((t) => t.status === 'Completed').length} of{' '}
                    {(activeEvent.tasks || []).length}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    {(activeEvent.tasks || []).filter((t) => t.status === 'Completed').length > 0 ? 'On Track' : 'Getting started'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-200">
                  <p className="text-xs text-charcoal-500">Confirmed Vendors</p>
                  <p className="font-serif text-xl font-bold text-charcoal-900 mt-1">
                    {(activeEvent.vendors || []).filter((v) => v.bookingStatus === 'Confirmed').length} of{' '}
                    {(activeEvent.vendors || []).length}
                  </p>
                  <p className="text-[11px] text-terracotta-600 font-medium mt-1">
                    {(activeEvent.vendors || []).filter((v) => v.bookingStatus === 'Negotiating').length} negotiating
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-200">
                  <p className="text-xs text-charcoal-500">Remaining Budget</p>
                  <p className="font-serif text-xl font-bold text-charcoal-900 mt-1">
                    ₹{(activeSummary?.remainingAmount || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-charcoal-500 mt-1">
                    {activeSummary?.overBudgetAmount ? 'Exceeded by ₹' + activeSummary.overBudgetAmount.toLocaleString('en-IN') : 'Healthy balance'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Deadlines & Recent Activity */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-terracotta-600" />
                <h3 className="font-serif text-base font-bold text-charcoal-900">
                  Upcoming Deadlines
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('timeline')}
                className="text-xs text-terracotta-600 font-medium hover:underline"
              >
                All Tasks
              </button>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-charcoal-400 py-4 text-center">
                  All current deadlines checked off!
                </p>
              ) : (
                upcomingDeadlines.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-ivory-50/70 border border-ivory-200/80 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            task.priority === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : task.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-charcoal-100 text-charcoal-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-charcoal-400 truncate max-w-[120px]">
                          {task.eventTitle}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-charcoal-800 leading-snug">
                        {task.title}
                      </p>
                      <p className="text-[10px] text-charcoal-500">
                        Due: {task.dueDate}
                      </p>
                    </div>

                    <button
                      onClick={() => onToggleTask(task.eventId, task.id)}
                      className="p-1 rounded-full text-charcoal-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Mark as done"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-charcoal-900">
                Recent Activity
              </h3>
              <span className="text-xs text-charcoal-400">Live sync</span>
            </div>

            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-terracotta-500 mt-1.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-charcoal-900">{act.title}</p>
                    <p className="text-charcoal-500 text-[11px] leading-relaxed">
                      {act.detail}
                    </p>
                    <p className="text-[10px] text-charcoal-400">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Tip / Prompt */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-terracotta-50 to-champagne-50 border border-terracotta-200/80 space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-terracotta-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-terracotta-800">
                AI Planning Studio
              </h4>
            </div>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Explore custom decor themes, vendor negotiation queries, and catering highlights tailored to your event requirements.
            </p>
            <button
              onClick={() => onNavigateTab('studio')}
              className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-semibold shadow-subtle transition-colors"
            >
              <span>Open AI Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

