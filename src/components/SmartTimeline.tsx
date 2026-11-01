'use client';

import React, { useState, useEffect } from 'react';
import { EventItem, TaskItem, TaskPriority } from '@/types';
import {
  IconPlus,
  IconCheck,
  IconCalendar,
  IconClock,
  IconTrash,
  IconEdit,
  IconClose,
} from './Icons';
import {
  addTaskToEvent,
  updateTaskInEvent,
  deleteTaskFromEvent,
  toggleTaskStatus,
} from '@/lib/storage';
import confetti from 'canvas-confetti';

interface SmartTimelineProps {
  activeEvent: EventItem | null;
  onOpenCreateModal: () => void;
}

export const SmartTimeline: React.FC<SmartTimelineProps> = ({
  activeEvent,
  onOpenCreateModal,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [category, setCategory] = useState('Planning');

  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed' | 'High'>('All');

  useEffect(() => {
    if (!activeEvent?.eventDate) return;

    const calculateTime = () => {
      const target = new Date(activeEvent.eventDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeEvent?.eventDate]);

  if (!activeEvent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink-900">
          No celebration selected
        </h2>
        <p className="text-sm text-ink-600 max-w-md mx-auto">
          Please select an active event or create a new celebration to view your timeline countdown.
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

  const tasks = activeEvent.tasks || [];
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setPriority('Medium');
    setCategory('Coordination');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setCategory(task.category);
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTaskInEvent(activeEvent.id, {
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        category,
      });
    } else {
      addTaskToEvent(activeEvent.id, {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        status: 'Pending',
        category,
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task milestone?')) {
      deleteTaskFromEvent(activeEvent.id, taskId);
    }
  };

  const handleToggleTaskWithConfetti = (task: TaskItem) => {
    const willBeCompleted = task.status !== 'Completed';
    toggleTaskStatus(activeEvent.id, task.id);

    if (willBeCompleted) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#A38035', '#1A4331', '#8E2A2B', '#FAF8F2'],
        });
      } catch (err) {}
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'Pending') return t.status !== 'Completed';
    if (filter === 'Completed') return t.status === 'Completed';
    if (filter === 'High') return t.priority === 'High';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-300 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
            Chronological Execution Schedule
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink-900 mt-1">
            The countdown to your celebration.
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 font-mono mt-1">
            {activeEvent.title} · Date: {activeEvent.eventDate} ({activeEvent.location})
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-950 text-white font-medium text-xs sm:text-sm transition-colors active:scale-[0.99]"
        >
          <IconPlus className="w-3.5 h-3.5 text-gold-400" />
          <span>Add Task Milestone</span>
        </button>
      </div>

      {/* Countdown Clock Banner (No radial orbs, crisp borders) */}
      <div className="p-8 sm:p-10 rounded-sm bg-ink-900 text-white border border-ink-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-800 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
              Live Celebration Countdown
            </span>
            <h3 className="font-serif text-2xl font-bold">
              {activeEvent.title}
            </h3>
            <p className="text-xs text-ink-400 font-mono">
              Target Celebration Date: {activeEvent.eventDate} ({activeEvent.location})
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase text-ink-400">Milestone Progress</span>
            <p className="font-serif text-2xl font-bold text-emerald-400 font-mono">
              {completedCount}/{tasks.length} Done ({progressPercent}%)
            </p>
          </div>
        </div>

        {/* Big Digit Counters with Live Tick */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 text-center font-mono">
          <div className="p-4 sm:p-6 rounded-sm bg-ink-950 border border-ink-800">
            <p className="font-serif text-3xl sm:text-5xl font-bold text-gold-300">
              {timeLeft.days}
            </p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold mt-1">
              Days
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-sm bg-ink-950 border border-ink-800">
            <p className="font-serif text-3xl sm:text-5xl font-bold text-gold-300">
              {timeLeft.hours}
            </p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold mt-1">
              Hours
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-sm bg-ink-950 border border-ink-800">
            <p className="font-serif text-3xl sm:text-5xl font-bold text-gold-300">
              {timeLeft.minutes}
            </p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold mt-1">
              Minutes
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-sm bg-ink-950 border border-ink-800">
            <p className="font-serif text-3xl sm:text-5xl font-bold text-gold-300">
              {timeLeft.seconds}
            </p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold mt-1">
              Seconds
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 text-xs">
        <div className="flex items-center space-x-2 font-mono">
          <span className="text-ink-600">Filter:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'Pending', 'Completed', 'High'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1 rounded-sm transition-colors ${
                  filter === opt
                    ? 'bg-ink-900 text-white font-semibold'
                    : 'bg-paper-200 text-ink-700 hover:bg-paper-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-500 font-mono">
          Showing {filteredTasks.length} milestones
        </p>
      </div>

      {/* Milestone Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-sm border border-paper-300">
            <p className="text-sm text-ink-400">
              No tasks match the selected filter.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';

            return (
              <div
                key={task.id}
                className={`p-5 sm:p-6 rounded-sm bg-card border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-paper-300 hover:border-ink-400'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Interactive toggle box */}
                  <button
                    onClick={() => handleToggleTaskWithConfetti(task)}
                    className="mt-0.5 flex-shrink-0 text-ink-300 hover:text-emerald-700 transition-colors"
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  >
                    <div
                      className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'border-paper-400 bg-paper-50 hover:border-ink-600'
                      }`}
                    >
                      {isCompleted && <IconCheck className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider ${
                          task.priority === 'High'
                            ? 'bg-ruby-50 text-ruby-700 border border-ruby-200'
                            : task.priority === 'Medium'
                            ? 'bg-gold-50 text-gold-700 border border-gold-200'
                            : 'bg-paper-200 text-ink-700'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                      <span className="text-[10px] font-mono text-ink-500 bg-paper-100 px-2 py-0.5 rounded-sm border border-paper-200">
                        {task.category}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                          Completed
                        </span>
                      )}
                    </div>

                    <h4
                      className={`font-semibold text-sm sm:text-base ${
                        isCompleted ? 'line-through text-ink-400' : 'text-ink-900'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-xs text-ink-500 max-w-2xl leading-relaxed font-sans">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Due Date & Action controls */}
                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-ink-500 bg-paper-100 px-3 py-1.5 rounded-sm border border-paper-200">
                    <IconCalendar className="w-3.5 h-3.5 text-ink-400" />
                    <span>Due: {task.dueDate}</span>
                  </div>

                  <button
                    onClick={() => handleOpenEditModal(task)}
                    className="p-1.5 rounded-sm text-ink-400 hover:text-ink-900 hover:bg-paper-200 transition-colors"
                    title="Edit Milestone"
                  >
                    <IconEdit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-sm text-ink-400 hover:text-ruby-600 hover:bg-ruby-50 transition-colors"
                    title="Delete Milestone"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-card border border-paper-300 rounded-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-paper-200 pb-4">
              <h3 className="font-serif text-xl font-bold text-ink-900">
                {editingTask ? 'Edit Task Milestone' : 'Add Task Milestone'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-sm text-ink-400 hover:text-ink-700"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Confirm wedding mandap florist contract"
                  className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                  Details / Scope
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Ensure delivery includes 50 fresh marigold garlands before 10 AM"
                  className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Venue, Florals, Catering, Attire"
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
                  {editingTask ? 'Save Changes' : 'Create Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
