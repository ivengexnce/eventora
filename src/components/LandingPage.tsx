'use client';

import React, { useState } from 'react';
import { EventItem, EventType, ThemeType } from '@/types';
import {
  IconArrowRight,
  IconCheck,
  IconCalendar,
  IconWallet,
  IconClock,
  IconUsers,
  IconMapPin,
  IconRefresh,
  IconSparkles,
} from './Icons';
import { addOrUpdateEvent, setActiveEventId } from '@/lib/storage';

interface LandingPageProps {
  onStartPlanning: () => void;
  onExploreDashboard: () => void;
  onSelectEvent: (eventId: string) => void;
  events: EventItem[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onExploreDashboard,
  onSelectEvent,
  events,
}) => {
  // Inline AI Generator state right on the hero!
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [eventName, setEventName] = useState('Ananya & Siddharth Wedding');
  const [location, setLocation] = useState('Mumbai');
  const [guestCount, setGuestCount] = useState<number | ''>(150);
  const [totalBudget, setTotalBudget] = useState<number | ''>(300000);
  const [theme, setTheme] = useState<ThemeType>('Traditional');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split('T')[0];
  });
  const [preferences, setPreferences] = useState('Coastal sunset ceremony, royal Gujarati thali, acoustic Shehnai welcoming');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active showcase event for the bottom preview card
  const sampleEvent = events.find((e) => e.id === 'evt-mumbai-birthday') || events[0];

  // Quick 1-click Preset Loader (Matches prompt and challenge requirements directly!)
  const applyPreset = (preset: 'mumbai-wedding' | 'garden-birthday' | 'blr-community') => {
    if (preset === 'mumbai-wedding') {
      setEventType('Wedding');
      setEventName('Ananya & Siddharth Royal Wedding');
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

  const handleInlineGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!eventName.trim() || !location.trim()) {
      setErrorMessage('Please provide an event title and location.');
      return;
    }
    if (!guestCount || Number(guestCount) <= 0) {
      setErrorMessage('Guest count must be at least 1.');
      return;
    }
    if (!totalBudget || Number(totalBudget) <= 0) {
      setErrorMessage('Budget must be a valid positive amount in INR.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 700);

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
          theme,
          preferences: preferences.trim(),
        }),
      });

      const resData = await response.json();
      clearInterval(stepInterval);

      if (!resData.success || !resData.data) {
        throw new Error(resData.error || 'Plan synthesis failed.');
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
        theme,
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
      onSelectEvent(newEvent.id);
      onExploreDashboard();
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err?.message || 'Error communicating with AI planner.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Top Hero Section */}
      <section className="relative pt-8 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-paper-200 border border-paper-300 rounded text-[11px] font-mono uppercase tracking-widest text-ink-600">
            <span>GenAI Planning Architecture</span>
            <span>·</span>
            <span>Weddings · Birthdays · Community Events</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink-900 leading-[1.08]">
            Big celebrations. <br />
            <span className="italic font-normal text-gold-600">Zero planning chaos.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-ink-600 font-normal leading-relaxed">
            From your first idea to the final celebration, let AI organize the details while you enjoy the moments that matter.
          </p>
        </div>

        {/* Central GenAI Planning Console */}
        <div className="max-w-4xl mx-auto mt-10">
          <div className="bg-white rounded-2xl border border-paper-300 shadow-elevation overflow-hidden">
            {/* Console Bar Header */}
            <div className="px-6 py-4 bg-paper-100 border-b border-paper-300 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 font-mono text-ink-700">
                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                <span className="font-semibold uppercase tracking-wider">AI Event Planning Console</span>
              </div>

              {/* 1-Click Challenge Presets */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-ink-400 font-mono hidden sm:inline">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => applyPreset('mumbai-wedding')}
                  className="px-2.5 py-1 rounded bg-white hover:bg-paper-200 border border-paper-300 text-[11px] font-medium text-ink-800 transition-colors"
                >
                  Mumbai Wedding (150 guests)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('garden-birthday')}
                  className="px-2.5 py-1 rounded bg-white hover:bg-paper-200 border border-paper-300 text-[11px] font-medium text-ink-800 transition-colors"
                >
                  Garden Birthday (₹25k)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('blr-community')}
                  className="px-2.5 py-1 rounded bg-white hover:bg-paper-200 border border-paper-300 text-[11px] font-medium text-ink-800 transition-colors hidden md:inline"
                >
                  Diwali Mela (500)
                </button>
              </div>
            </div>

            {/* Console Form */}
            <form onSubmit={handleInlineGenerate} className="p-6 sm:p-8 space-y-6">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-ruby-50 border border-ruby-100 text-ruby-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Row 1: Event Name & Event Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Diya & Kabir's Royal Sangeet"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 text-sm font-medium text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                    Celebration Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 text-sm font-medium text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50 cursor-pointer"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Community">Community Celebration</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Location, Guest Count, Budget, Date */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 text-sm text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                    Guest Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 text-sm text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                    Total Budget (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 text-sm font-semibold text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 text-sm text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50"
                  />
                </div>
              </div>

              {/* Row 3: Preferences & Cultural Notes */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                  Cultural Preferences, Styling & Specific Requirements
                </label>
                <input
                  type="text"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g. Vegetarian royal thali, acoustic live performance, marigold decor, zero plastic"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 text-sm text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50"
                />
              </div>

              {/* Generation Progress Indicator */}
              {isGenerating && (
                <div className="p-4 rounded-xl bg-paper-100 border border-paper-300 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-mono text-ink-700">
                    <span className="flex items-center space-x-2">
                      <IconRefresh className="w-3.5 h-3.5 animate-spin text-gold-600" />
                      <span>
                        {generationStep === 1 && 'Synthesizing cultural concept & styling palette...'}
                        {generationStep === 2 && 'Calculating mathematical budget allocations in INR (₹)...'}
                        {generationStep === 3 && 'Sequencing timeline milestones relative to event date...'}
                        {generationStep >= 4 && 'Structuring vendor checklists and contract negotiation questions...'}
                      </span>
                    </span>
                    <span>Step {generationStep} of 4</span>
                  </div>
                  <div className="w-full bg-paper-300 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-gold-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(generationStep / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-ink-500">
                  Generates budget allocation, milestone timeline, vendor checklist, theme & ideas.
                </p>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-lg bg-ink-900 hover:bg-ink-950 text-white font-medium text-sm shadow-subtle transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  <span>{isGenerating ? 'Synthesizing Blueprint...' : 'Generate My AI Event Plan'}</span>
                  <IconArrowRight className="w-4 h-4 text-gold-400" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Illustrative AI Output Preview Showcase (PRD Section 4 garden glow example) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-paper-300 rounded-2xl bg-white p-6 sm:p-10 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-200 pb-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600">
                AI Planning Studio Showcase
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink-900 mt-1">
                Garden Glow Birthday
              </h3>
              <p className="text-xs text-ink-500 font-mono mt-0.5">
                40 guests · Mumbai · ₹25,000 budget
              </p>
            </div>

            <button
              onClick={() => {
                onSelectEvent('evt-mumbai-birthday');
                onExploreDashboard();
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-paper-100 hover:bg-paper-200 border border-paper-300 text-xs font-medium text-ink-800 transition-colors self-start sm:self-auto"
            >
              <span>Explore Full Workspace</span>
              <IconArrowRight className="w-3.5 h-3.5 text-gold-600" />
            </button>
          </div>

          {/* Budget distribution */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-ink-400 mb-3">
              Suggested Budget Allocation
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-4 rounded-xl bg-paper-100 border border-paper-300">
                <p className="text-xs text-ink-500">Catering</p>
                <p className="font-serif text-xl font-bold text-ink-900 mt-1">₹10,000</p>
                <p className="text-[10px] font-mono text-gold-600">40% of budget</p>
              </div>
              <div className="p-4 rounded-xl bg-paper-100 border border-paper-300">
                <p className="text-xs text-ink-500">Decoration</p>
                <p className="font-serif text-xl font-bold text-ink-900 mt-1">₹5,000</p>
                <p className="text-[10px] font-mono text-gold-600">20% of budget</p>
              </div>
              <div className="p-4 rounded-xl bg-paper-100 border border-paper-300">
                <p className="text-xs text-ink-500">Entertainment</p>
                <p className="font-serif text-xl font-bold text-ink-900 mt-1">₹4,000</p>
                <p className="text-[10px] font-mono text-gold-600">16% of budget</p>
              </div>
              <div className="p-4 rounded-xl bg-paper-100 border border-paper-300">
                <p className="text-xs text-ink-500">Venue</p>
                <p className="font-serif text-xl font-bold text-ink-900 mt-1">₹4,000</p>
                <p className="text-[10px] font-mono text-gold-600">16% of budget</p>
              </div>
              <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-paper-100 border border-paper-300">
                <p className="text-xs text-ink-500">Miscellaneous</p>
                <p className="font-serif text-xl font-bold text-ink-900 mt-1">₹2,000</p>
                <p className="text-[10px] font-mono text-gold-600">8% of budget</p>
              </div>
            </div>
          </div>

          {/* AI Suggestions Checklist */}
          <div className="pt-2 border-t border-paper-200">
            <p className="text-xs font-mono uppercase tracking-wider text-ink-400 mb-3">
              Synthesized Suggestions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ink-700">
              <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-paper-50 border border-paper-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                <span>Warm fairy-light decoration and botanical greenery</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-paper-50 border border-paper-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                <span>Garden-themed photo corner with instant polaroids</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-paper-50 border border-paper-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                <span>Personalized pistachio rose-milk birthday cake</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-paper-50 border border-paper-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                <span>Acoustic music set and interactive trivia icebreaker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-paper-300 shadow-card space-y-3">
            <span className="font-mono text-xs text-gold-600 font-bold uppercase tracking-wider">
              01 / Synthesis
            </span>
            <h3 className="font-serif text-xl font-bold text-ink-900">
              Your AI Planning Studio
            </h3>
            <p className="text-xs text-ink-600 leading-relaxed">
              Turns cultural requirements, regional nuances, and budgets into concepts, themes, catering menus, and activities in seconds.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-paper-300 shadow-card space-y-3">
            <span className="font-mono text-xs text-gold-600 font-bold uppercase tracking-wider">
              02 / Precision
            </span>
            <h3 className="font-serif text-xl font-bold text-ink-900">
              Every Rupee, Thoughtfully Planned
            </h3>
            <p className="text-xs text-ink-600 leading-relaxed">
              Deterministic calculations ensure real-world control. Track planned vs. actual expenses with proactive cost-saving alerts.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-paper-300 shadow-card space-y-3">
            <span className="font-mono text-xs text-gold-600 font-bold uppercase tracking-wider">
              03 / Sequencing
            </span>
            <h3 className="font-serif text-xl font-bold text-ink-900">
              The Countdown to Your Celebration
            </h3>
            <p className="text-xs text-ink-600 leading-relaxed">
              Reverse-engineered milestone scheduling anchored to your celebration date with an active live countdown timer.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
