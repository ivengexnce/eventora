'use client';

import React from 'react';
import { EventItem } from '@/types';
import {
  IconPlus,
  IconCheck,
  IconArrowRight,
  IconCalendar,
  IconMapPin,
  IconUsers,
  IconClock,
  IconWallet,
} from './Icons';
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

  const allTasks = events.flatMap((e) =>
    (e.tasks || []).map((t) => ({ ...t, eventTitle: e.title, eventId: e.id }))
  );
  const upcomingDeadlines = allTasks
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const activities = [
    {
      id: 'act-1',
      title: 'AI Blueprint Synchronized',
      detail: `Generated comprehensive event plan for "${activeEvent?.title || 'Celebration'}"`,
      time: 'Just now',
    },
    {
      id: 'act-2',
      title: 'Financial Balance Verified',
      detail: `₹${metrics.combinedExpenses.toLocaleString('en-IN')} actual expenses tracked across ${metrics.activeEventsCount} active events`,
      time: '2 hours ago',
    },
    {
      id: 'act-3',
      title: 'Milestone Completed',
      detail: `${metrics.completedTasks} tasks verified and marked ready`,
      time: 'Today',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-300 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink-900">
            Let&apos;s make something worth celebrating.
          </h1>
          <p className="text-sm sm:text-base text-ink-600 mt-1 font-normal">
            Your celebrations, plans and priorities — all in one place.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-ink-900 hover:bg-ink-950 text-white font-medium text-xs sm:text-sm shadow-subtle transition-all active:scale-[0.98]"
        >
          <IconPlus className="w-3.5 h-3.5 text-gold-400" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Top 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Active Events */}
        <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
              Active Events
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-ink-900">
              {metrics.activeEventsCount}
            </span>
            <span className="text-xs text-ink-400 font-mono">celebrations</span>
          </div>
          <p className="text-[11px] font-mono text-gold-600 font-medium">
            Ready for execution
          </p>
        </div>

        {/* Total Budget */}
        <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
              Total Budget
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-ink-900">
              ₹{metrics.combinedBudget.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] font-mono text-ink-400">
            Combined planned funds
          </p>
        </div>

        {/* Total Expenses */}
        <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
              Total Expenses
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-ink-900">
              ₹{metrics.combinedExpenses.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] font-mono text-ink-400">
            Committed spending
          </p>
        </div>

        {/* Tasks Completed */}
        <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
              Tasks Completed
            </span>
            <span className="font-mono text-xs text-ink-500 font-semibold">
              {metrics.completedTasks}/{metrics.totalTasks}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-emerald-700 font-mono">
              {metrics.taskCompletionRate}%
            </span>
          </div>
          <div className="w-full bg-paper-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${metrics.taskCompletionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Celebrations & Planning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Events List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-900">
                Upcoming Celebrations
              </h2>
              <p className="text-xs text-ink-500">
                Click any event to switch active workspace focus
              </p>
            </div>
            <span className="text-xs font-mono text-ink-400">
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
                      ? 'border-ink-900 ring-1 ring-ink-900 shadow-card'
                      : 'border-paper-300 hover:border-paper-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-paper-100 border border-paper-300 text-ink-800">
                          {evt.eventType}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded bg-ink-900 text-white text-[10px] font-mono">
                            Active Focus
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-ink-900">
                        {evt.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500 font-mono pt-1">
                        <span className="flex items-center space-x-1">
                          <IconCalendar className="w-3.5 h-3.5 text-gold-600" />
                          <span>{evt.eventDate}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center space-x-1">
                          <IconMapPin className="w-3.5 h-3.5 text-gold-600" />
                          <span>{evt.location}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center space-x-1">
                          <IconUsers className="w-3.5 h-3.5 text-gold-600" />
                          <span>{evt.guestCount} guests</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between self-start sm:self-auto gap-2">
                      <p className="font-serif text-lg font-bold text-ink-900">
                        ₹{Number(evt.totalBudget).toLocaleString('en-IN')}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(evt.id);
                          onNavigateTab('studio');
                        }}
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded bg-paper-100 hover:bg-paper-200 text-ink-800 text-xs font-medium border border-paper-300 transition-colors"
                      >
                        <span>Open AI Studio</span>
                        <IconArrowRight className="w-3 h-3 text-gold-600" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bars within card */}
                  <div className="mt-4 pt-4 border-t border-paper-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <div className="flex justify-between text-ink-500 mb-1">
                        <span>Milestones</span>
                        <span className="font-semibold text-ink-800">{taskPercent}%</span>
                      </div>
                      <div className="w-full bg-paper-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: `${taskPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-ink-500 mb-1">
                        <span>Budget Spent</span>
                        <span className="font-semibold text-ink-800">
                          ₹{summary.actualExpenses.toLocaleString('en-IN')} / ₹{summary.totalBudget.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full bg-paper-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            summary.overBudgetAmount > 0 ? 'bg-ruby-500' : 'bg-gold-500'
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
            <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-paper-200 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink-900">
                    Active Readiness: {activeEvent.title}
                  </h3>
                  <p className="text-xs text-ink-500 font-mono">
                    Operational progress metrics
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('timeline')}
                  className="text-xs font-semibold text-gold-700 hover:underline inline-flex items-center space-x-1"
                >
                  <span>View Timeline</span>
                  <IconArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 font-mono">
                <div className="p-4 rounded-xl bg-paper-100 border border-paper-300">
                  <p className="text-xs text-ink-500">Tasks Completed</p>
                  <p className="font-serif text-xl font-bold text-ink-900 mt-1">
                    {(activeEvent.tasks || []).filter((t) => t.status === 'Completed').length} of{' '}
                    {(activeEvent.tasks || []).length}
                  </p>
                  <p className="text-[10px] text-emerald-700 mt-1">
                    {(activeEvent.tasks || []).filter((t) => t.status === 'Completed').length > 0 ? 'Milestones on track' : 'Initial setup'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-paper-100 border border-paper-300">
                  <p className="text-xs text-ink-500">Confirmed Vendors</p>
                  <p className="font-serif text-xl font-bold text-ink-900 mt-1">
                    {(activeEvent.vendors || []).filter((v) => v.bookingStatus === 'Confirmed').length} of{' '}
                    {(activeEvent.vendors || []).length}
                  </p>
                  <p className="text-[10px] text-gold-700 mt-1">
                    {(activeEvent.vendors || []).filter((v) => v.bookingStatus === 'Negotiating').length} negotiating
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-paper-100 border border-paper-300">
                  <p className="text-xs text-ink-500">Remaining Budget</p>
                  <p className="font-serif text-xl font-bold text-ink-900 mt-1">
                    ₹{(activeSummary?.remainingAmount || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-ink-500 mt-1">
                    {activeSummary?.overBudgetAmount ? 'Exceeded by ₹' + activeSummary.overBudgetAmount.toLocaleString('en-IN') : 'Healthy balance'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Deadlines & Activity */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-paper-200 pb-3">
              <h3 className="font-serif text-base font-bold text-ink-900">
                Upcoming Deadlines
              </h3>
              <button
                onClick={() => onNavigateTab('timeline')}
                className="text-xs text-gold-700 font-mono hover:underline"
              >
                All Milestones
              </button>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-ink-400 py-4 text-center font-mono">
                  All current deadlines completed.
                </p>
              ) : (
                upcomingDeadlines.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-paper-50 border border-paper-200 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider ${
                            task.priority === 'High'
                              ? 'bg-ruby-50 text-ruby-700 border border-ruby-200'
                              : task.priority === 'Medium'
                              ? 'bg-gold-50 text-gold-700 border border-gold-200'
                              : 'bg-paper-200 text-ink-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-ink-400 font-mono truncate max-w-[120px]">
                          {task.eventTitle}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-ink-900 leading-snug">
                        {task.title}
                      </p>
                      <p className="text-[10px] font-mono text-ink-400">
                        Due: {task.dueDate}
                      </p>
                    </div>

                    <button
                      onClick={() => onToggleTask(task.eventId, task.id)}
                      className="p-1 rounded text-ink-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Mark complete"
                    >
                      <IconCheck className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-paper-200 pb-3">
              <h3 className="font-serif text-base font-bold text-ink-900">
                Recent Activity
              </h3>
              <span className="text-[10px] font-mono text-ink-400">Live Audit</span>
            </div>

            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start space-x-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-600 mt-1.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-ink-900">{act.title}</p>
                    <p className="text-ink-600 text-[11px] leading-relaxed font-normal">
                      {act.detail}
                    </p>
                    <p className="text-[10px] font-mono text-ink-400">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
