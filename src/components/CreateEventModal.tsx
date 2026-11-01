'use client';

import React, { useState } from 'react';
import { EventType, ThemeType, EventItem } from '@/types';
import {
  IconClose,
  IconArrowRight,
  IconRefresh,
} from './Icons';
import { addOrUpdateEvent, setActiveEventId } from '@/lib/storage';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (newEvent: EventItem) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [eventName, setEventName] = useState('Ananya & Siddharth Wedding');
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split('T')[0];
  });
  const [location, setLocation] = useState('Mumbai');
  const [guestCount, setGuestCount] = useState<number | ''>(150);
  const [totalBudget, setTotalBudget] = useState<number | ''>(300000);
  const [theme, setTheme] = useState<ThemeType>('Traditional');
  const [customTheme, setCustomTheme] = useState('');
  const [preferences, setPreferences] = useState('Coastal sunset ceremony, royal Gujarati thali, acoustic Shehnai welcoming');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const applyPreset = (preset: 'mumbai-wedding' | 'garden-birthday' | 'blr-community') => {
    if (preset === 'mumbai-wedding') {
      setEventType('Wedding');
      setEventName('Ananya & Siddharth Wedding');
      setLocation('Mumbai');
      setGuestCount(150);
      setTotalBudget(300000);
      setTheme('Traditional');
      setPreferences('Coastal banquet lawn, Gujarati royal thali, acoustic Shehnai welcoming, marigold decor');
    } else if (preset === 'garden-birthday') {
      setEventType('Birthday');
      setEventName('Garden Glow 30th Birthday');
      setLocation('Mumbai');
      setGuestCount(40);
      setTotalBudget(25000);
      setTheme('Modern');
      setPreferences('Bandra rooftop, fairy lights, acoustic guitar set, artisanal grazing boards, pistachio cake');
    } else {
      setEventType('Community');
      setEventName('Utsav Community Diwali Mela');
      setLocation('Bengaluru');
      setGuestCount(500);
      setTotalBudget(250000);
      setTheme('Traditional');
      setPreferences('1000 clay oil diyas, zero plastic dinnerware, inter-block rangoli contest, resident food stalls');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!eventName.trim()) {
      setError('Please provide an event name.');
      return;
    }
    if (!location.trim()) {
      setError('Please provide a city or venue location.');
      return;
    }
    if (!guestCount || Number(guestCount) <= 0) {
      setError('Please provide a valid guest count (at least 1).');
      return;
    }
    if (!totalBudget || Number(totalBudget) <= 0) {
      setError('Please provide a valid total budget in INR (₹).');
      return;
    }

    const selectedTheme = theme === 'Custom' ? customTheme.trim() || 'Custom' : theme;
    setLoading(true);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: eventName.trim(),
          eventType,
          eventDate,
          location: location.trim(),
          guestCount: Number(guestCount),
          totalBudget: Number(totalBudget),
          theme: selectedTheme,
          preferences: preferences.trim(),
        }),
      });

      const resData = await response.json();
      if (!resData.success || !resData.data) {
        throw new Error(resData.error || 'Failed to generate plan.');
      }

      const generated = resData.data;
      const newEventId = `evt-${Date.now()}`;

      const newEvent: EventItem = {
        id: newEventId,
        title: eventName.trim(),
        eventType,
        eventDate,
        location: location.trim(),
        guestCount: Number(guestCount),
        totalBudget: Number(totalBudget),
        theme: selectedTheme,
        preferences: preferences.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiPlan: {
          ...generated.aiPlan,
          eventId: newEventId,
        },
        expenses: generated.suggestedExpenses.map((exp: any, idx: number) => ({
          ...exp,
          id: `exp-${newEventId}-${idx + 1}`,
          eventId: newEventId,
        })),
        tasks: generated.suggestedTasks.map((tsk: any, idx: number) => ({
          ...tsk,
          id: `tsk-${newEventId}-${idx + 1}`,
          eventId: newEventId,
        })),
        vendors: generated.suggestedVendors.map((ven: any, idx: number) => ({
          ...ven,
          id: `ven-${newEventId}-${idx + 1}`,
          eventId: newEventId,
        })),
        recommendations: generated.suggestedRecommendations,
      };

      addOrUpdateEvent(newEvent);
      setActiveEventId(newEvent.id);
      onEventCreated(newEvent);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while generating your plan. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-100">
      <div className="relative w-full max-w-2xl bg-card rounded-sm border border-paper-300 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-8 pb-5 border-b border-paper-300 bg-paper-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
              AI Event Architecture
            </span>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-1.5 rounded-sm text-ink-500 hover:text-ink-800 hover:bg-paper-200 transition-colors"
            >
              <IconClose className="w-5 h-5" />
            </button>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 mt-2">
            Let&apos;s plan your celebration.
          </h2>
          <p className="text-xs sm:text-sm text-ink-600 mt-1 font-normal">
            Tell us a little about your event. Our AI will help you turn your vision into a practical plan.
          </p>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <span className="text-[10px] font-mono text-ink-400">Challenge Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('mumbai-wedding')}
              className="px-2.5 py-1 rounded-sm bg-card hover:bg-paper-200 border border-paper-300 text-[11px] font-medium text-ink-800 transition-colors"
            >
              Mumbai Wedding (150 guests · ₹3L)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('garden-birthday')}
              className="px-2.5 py-1 rounded-sm bg-card hover:bg-paper-200 border border-paper-300 text-[11px] font-medium text-ink-800 transition-colors"
            >
              Garden Birthday (40 guests · ₹25k)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-sm bg-ruby-50 border border-ruby-200 text-ruby-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Event Name */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
              Event Title *
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Ananya & Siddharth Wedding"
              className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm font-medium text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
            />
          </div>

          {/* Event Type & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                Event Type *
              </label>
              <select
                disabled={loading}
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900 cursor-pointer"
              >
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="Community">Community Celebration</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                Target Date *
              </label>
              <input
                type="date"
                required
                disabled={loading}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
              />
            </div>
          </div>

          {/* Location & Guest Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                City / Location *
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                Guest Count *
              </label>
              <input
                type="number"
                min="1"
                required
                disabled={loading}
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900 font-mono"
              />
            </div>
          </div>

          {/* Total Budget & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                Total Budget (INR ₹) *
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                required
                disabled={loading}
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm font-semibold text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                Theme Direction *
              </label>
              <select
                disabled={loading}
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeType)}
                className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900 cursor-pointer"
              >
                <option value="Traditional">Traditional</option>
                <option value="Modern">Modern</option>
                <option value="Minimal">Minimal</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          {theme === 'Custom' && (
            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                Custom Theme Description
              </label>
              <input
                type="text"
                disabled={loading}
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                placeholder="e.g. Royal Bollywood, Rustic Desert Chic"
                className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
              />
            </div>
          )}

          {/* Preferences */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
              Preferences & Styling Notes
            </label>
            <textarea
              rows={2}
              disabled={loading}
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g. Sunset golden hour arrival, Gujarati vegetarian catering, live Shehnai welcoming"
              className="w-full px-3.5 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900 resize-none"
            />
          </div>

          {/* Footer CTAs */}
          <div className="pt-3 border-t border-paper-200 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-sm text-xs font-semibold text-ink-600 hover:bg-paper-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-950 text-white font-medium text-xs sm:text-sm transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <IconRefresh className="w-3.5 h-3.5 animate-spin text-gold-400" />
                  <span>Synthesizing Plan...</span>
                </>
              ) : (
                <>
                  <span>Generate My AI Event Plan</span>
                  <IconArrowRight className="w-3.5 h-3.5 text-gold-400" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
