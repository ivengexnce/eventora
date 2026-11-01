'use client';

import React, { useState } from 'react';
import { EventType, ThemeType, EventItem } from '@/types';
import { Sparkles, X, Calendar, MapPin, Users2, IndianRupee, Palette, FileText, Loader2, AlertCircle } from 'lucide-react';
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
  // Form State
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [eventDate, setEventDate] = useState(() => {
    // Default 30 days in future
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState<number | ''>(100);
  const [totalBudget, setTotalBudget] = useState<number | ''>(500000);
  const [theme, setTheme] = useState<ThemeType>('Traditional');
  const [customTheme, setCustomTheme] = useState('');
  const [preferences, setPreferences] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
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
      // Call Gemini API route
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

      // Assemble full EventItem
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

      // Persist
      addOrUpdateEvent(newEvent);
      setActiveEventId(newEvent.id);
      onEventCreated(newEvent);
      onClose();
    } catch (err: any) {
      console.error('Error during AI plan generation:', err);
      setError(err?.message || 'Something went wrong while generating your plan. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-floating border border-ivory-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-8 pb-6 bg-gradient-to-br from-ivory-100 to-terracotta-50/40 border-b border-ivory-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-terracotta-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-800">
                New Celebration Plan
              </span>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-full text-charcoal-400 hover:text-charcoal-700 hover:bg-ivory-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-3">
            Let&apos;s plan your celebration.
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Tell us a little about your event. Our AI will help you turn your vision into a practical plan.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Event Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
              Event Name *
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Diya & Kabir's Royal Sangeet or Rohan's 30th Birthday"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600 text-sm text-charcoal-900 bg-white placeholder-charcoal-400 transition-all"
            />
          </div>

          {/* Event Type & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Event Type *
              </label>
              <select
                disabled={loading}
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600 text-sm text-charcoal-900 bg-white transition-all cursor-pointer"
              >
                <option value="Wedding">Wedding Celebration</option>
                <option value="Birthday">Birthday Celebration</option>
                <option value="Community">Community Festival / Mela</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Event Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  disabled={loading}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600 text-sm text-charcoal-900 bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Location & Guest Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Location (City or Venue) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Udaipur, Mumbai, Bengaluru"
                  className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600 text-sm text-charcoal-900 bg-white placeholder-charcoal-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Guest Count *
              </label>
              <input
                type="number"
                min="1"
                required
                disabled={loading}
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 50"
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600 text-sm text-charcoal-900 bg-white placeholder-charcoal-400 transition-all"
              />
            </div>
          </div>

          {/* Total Budget & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Total Budget (INR ₹) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  disabled={loading}
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="500000"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600 text-sm text-charcoal-900 bg-white placeholder-charcoal-400 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Theme *
              </label>
              <select
                disabled={loading}
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeType)}
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600 text-sm text-charcoal-900 bg-white transition-all cursor-pointer"
              >
                <option value="Traditional">Traditional (Royal / Heritage)</option>
                <option value="Modern">Modern (Contemporary Chic)</option>
                <option value="Minimal">Minimal (Clean / Botanical)</option>
                <option value="Custom">Custom Theme</option>
              </select>
            </div>
          </div>

          {theme === 'Custom' && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Specify Custom Theme
              </label>
              <input
                type="text"
                disabled={loading}
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                placeholder="e.g. Boho Sunset, Retro Bollywood, Celestial Starlight"
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600 text-sm text-charcoal-900 bg-white placeholder-charcoal-400 transition-all"
              />
            </div>
          )}

          {/* Preferences */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
              Special Preferences & Details
            </label>
            <textarea
              rows={3}
              disabled={loading}
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g. Sunset golden hour arrival, strictly vegetarian Gujarati feast, acoustic live performance, eco-friendly clay diyas, no plastics."
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600 text-sm text-charcoal-900 bg-white placeholder-charcoal-400 transition-all resize-none"
            />
          </div>

          {/* CTA Footer */}
          <div className="pt-4 border-t border-ivory-200 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-charcoal-600 hover:bg-ivory-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-sm shadow-card hover:shadow-floating transition-all disabled:opacity-70 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing AI Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate My AI Event Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

