'use client';

import React, { useState } from 'react';
import { EventItem, EventType, ThemeType } from '@/types';
import {
  IconArrowRight,
  IconCalendar,
  IconWallet,
  IconClock,
  IconUsers,
  IconMapPin,
  IconRefresh,
  IconPieChart,
  IconWhatsApp,
} from './Icons';
import { addOrUpdateEvent, setActiveEventId } from '@/lib/storage';
import { PlanGenerationSkeleton } from './SkeletonLoader';
import confetti from 'canvas-confetti';

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
  // Inline AI Generator state
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [eventName, setEventName] = useState('Ananya & Siddharth Royal Wedding');
  const [location, setLocation] = useState('Mumbai');
  const [guestCount, setGuestCount] = useState<number | ''>(150);
  const [totalBudget, setTotalBudget] = useState<number | ''>(300000);
  const [theme, setTheme] = useState<ThemeType>('Traditional');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split('T')[0];
  });
  const [preferences, setPreferences] = useState('Coastal sunset lawn, royal Gujarati thali, acoustic Shehnai welcoming, marigold decor');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Interactive Pillar Explorer State (replaces cliché "cards in a row")
  const [activePillar, setActivePillar] = useState<'studio' | 'budget' | 'timeline' | 'vendors'>('studio');

  // 1-Click Preset Loader
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
    }, 650);

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

      // Trigger golden confetti celebration on generating new plan
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A38035', '#1A4331', '#8E2A2B', '#FAF8F2'],
        });
      } catch (err) {}

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
      <section className="relative pt-10 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-card border border-paper-300 rounded-sm text-[11px] font-mono uppercase tracking-widest text-ink-700">
            <span className="w-1.5 h-1.5 bg-gold-600 inline-block" />
            <span>INTRODUCING YOUR AI CELEBRATION COMPANION</span>
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
          <div className="bg-card rounded-sm border border-paper-300 overflow-hidden">
            {/* Console Bar Header */}
            <div className="px-6 py-4 bg-paper-100 border-b border-paper-300 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 font-mono text-ink-700">
                <span className="w-2 h-2 bg-gold-500 rounded-none" />
                <span className="font-semibold uppercase tracking-wider">AI Event Planning Console</span>
              </div>

              {/* 1-Click Challenge Presets */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-ink-500 font-mono hidden sm:inline">1-Click Presets:</span>
                <button
                  type="button"
                  onClick={() => applyPreset('mumbai-wedding')}
                  className="px-2.5 py-1 rounded-sm bg-card hover:bg-paper-200 border border-paper-300 text-[11px] font-medium text-ink-800 transition-colors"
                >
                  Mumbai Wedding (150 guests)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('garden-birthday')}
                  className="px-2.5 py-1 rounded-sm bg-card hover:bg-paper-200 border border-paper-300 text-[11px] font-medium text-ink-800 transition-colors"
                >
                  Garden Birthday (₹25k)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('blr-community')}
                  className="px-2.5 py-1 rounded-sm bg-card hover:bg-paper-200 border border-paper-300 text-[11px] font-medium text-ink-800 transition-colors hidden md:inline"
                >
                  Diwali Mela (500)
                </button>
              </div>
            </div>

            {/* Console Form */}
            <form onSubmit={handleInlineGenerate} className="p-6 sm:p-8 space-y-6">
              {errorMessage && (
                <div className="p-3 rounded-sm bg-ruby-50 border border-ruby-200 text-ruby-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Row 1: Event Name and Event Type */}
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
                    className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm font-medium text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                    Celebration Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm font-medium text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50 cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50"
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
                    className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50 font-mono"
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
                    className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm font-semibold text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50 font-mono"
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
                    className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50"
                  />
                </div>
              </div>

              {/* Row 3: Preferences and Cultural Notes */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500">
                  Cultural Preferences, Styling & Specific Requirements
                </label>
                <input
                  type="text"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g. Vegetarian royal thali, acoustic live performance, marigold decor, zero plastic"
                  className="w-full px-3.5 py-2.5 rounded-sm border border-paper-300 text-sm text-ink-900 focus:outline-none focus:border-ink-900 bg-paper-50"
                />
              </div>

              {/* Generation Progress Indicator */}
              {isGenerating && (
                <div className="p-4 rounded-sm bg-paper-100 border border-paper-300 space-y-2">
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
                  <div className="w-full bg-paper-300 rounded-none h-1 overflow-hidden">
                    <div
                      className="bg-gold-500 h-1 transition-all duration-300"
                      style={{ width: `${(generationStep / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-ink-500 font-mono">
                  Generates budget allocation, milestone timeline, vendor checklist, theme and ideas.
                </p>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-sm bg-ink-900 hover:bg-ink-950 text-white font-medium text-sm transition-colors active:scale-[0.99] disabled:opacity-70"
                >
                  <span>{isGenerating ? 'Synthesizing Blueprint...' : 'Generate My AI Event Plan'}</span>
                  <IconArrowRight className="w-4 h-4 text-gold-400" />
                </button>
              </div>
            </form>

            {/* Skeleton Loader Rendered While Generating */}
            {isGenerating && (
              <div className="p-6 border-t border-paper-300 bg-paper-100">
                <p className="text-xs font-mono uppercase tracking-wider text-ink-500 mb-4">
                  Constructing Blueprint Skeleton...
                </p>
                <PlanGenerationSkeleton />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Real Celebration Showcase Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-paper-300 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
              Multi-Event Architecture
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 mt-1">
              One Intelligent Workspace For Every Celebration
            </h2>
          </div>
          <p className="text-xs text-ink-500 font-mono">
            Select any celebration to view its full interactive workspace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Royal Wedding */}
          <div
            onClick={() => {
              onSelectEvent('evt-jaipur-wedding');
              onExploreDashboard();
            }}
            className="group cursor-pointer rounded-sm bg-card border border-paper-300 overflow-hidden hover:border-ink-700 transition-colors"
          >
            <div className="relative h-48 overflow-hidden bg-ink-950">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                alt="Royal Indian Wedding"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-sm bg-ink-950/90 text-[10px] font-mono uppercase text-gold-400 border border-gold-500/20">
                Weddings
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-serif text-xl font-bold text-ink-900 group-hover:text-gold-600 transition-colors">
                Royal Marigold Sangeet
              </h3>
              <p className="text-xs text-ink-600 line-clamp-2">
                150 guests · Mumbai / Jaipur · Traditional royal mandap, shehnai welcoming, Gujarati thali, and live photo corners.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-paper-200 text-xs font-mono">
                <span className="text-ink-900 font-bold">₹3,00,000</span>
                <span className="text-gold-600 inline-flex items-center space-x-1 font-medium">
                  <span>Open Plan</span>
                  <IconArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Garden Birthday */}
          <div
            onClick={() => {
              onSelectEvent('evt-mumbai-birthday');
              onExploreDashboard();
            }}
            className="group cursor-pointer rounded-sm bg-card border border-paper-300 overflow-hidden hover:border-ink-700 transition-colors"
          >
            <div className="relative h-48 overflow-hidden bg-ink-950">
              <img
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80"
                alt="Garden Glow Birthday"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-sm bg-ink-950/90 text-[10px] font-mono uppercase text-emerald-400 border border-emerald-500/20">
                Birthdays
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-serif text-xl font-bold text-ink-900 group-hover:text-gold-600 transition-colors">
                Garden Glow Birthday
              </h3>
              <p className="text-xs text-ink-600 line-clamp-2">
                40 guests · Mumbai Rooftop · Fairy-light canopy, acoustic guitar set, artisanal grazing boards, pistachio cake.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-paper-200 text-xs font-mono">
                <span className="text-ink-900 font-bold">₹25,000</span>
                <span className="text-gold-600 inline-flex items-center space-x-1 font-medium">
                  <span>Open Plan</span>
                  <IconArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Community Diwali Mela */}
          <div
            onClick={() => {
              onSelectEvent('evt-blr-diwali');
              onExploreDashboard();
            }}
            className="group cursor-pointer rounded-sm bg-card border border-paper-300 overflow-hidden hover:border-ink-700 transition-colors"
          >
            <div className="relative h-48 overflow-hidden bg-ink-950">
              <img
                src="https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80"
                alt="Diwali Community Celebration"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-sm bg-ink-950/90 text-[10px] font-mono uppercase text-gold-400 border border-gold-500/20">
                Community
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-serif text-xl font-bold text-ink-900 group-hover:text-gold-600 transition-colors">
                Utsav Community Diwali Mela
              </h3>
              <p className="text-xs text-ink-600 line-clamp-2">
                500 residents · Bengaluru · 1000 clay oil diyas, eco-friendly dinnerware, rangoli competition, resident food stalls.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-paper-200 text-xs font-mono">
                <span className="text-ink-900 font-bold">₹2,50,000</span>
                <span className="text-gold-600 inline-flex items-center space-x-1 font-medium">
                  <span>Open Plan</span>
                  <IconArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Illustrative AI Output Preview Showcase (PRD Section 4 Birthday Celebration) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-paper-300 rounded-sm bg-card p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-200 pb-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
                PRD Verified Output Showcase
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
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-sm bg-paper-100 hover:bg-paper-200 border border-paper-300 text-xs font-medium text-ink-800 transition-colors self-start sm:self-auto"
            >
              <span>Explore Live Workspace</span>
              <IconArrowRight className="w-3.5 h-3.5 text-gold-600" />
            </button>
          </div>

          {/* Budget distribution */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-ink-400 mb-3">
              Suggested Budget Allocation
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-4 rounded-sm bg-paper-100 border border-paper-300">
                <p className="text-xs text-ink-500">Catering</p>
                <p className="font-serif text-xl font-bold text-ink-900 mt-1">₹10,000</p>
                <p className="text-[10px] font-mono text-gold-600">40% of budget</p>
              </div>
              <div className="p-4 rounded-sm bg-paper-100 border border-paper-300">
                <p className="text-xs text-ink-500">Decoration</p>
                <p className="font-serif text-xl font-bold text-ink-900 mt-1">₹5,000</p>
                <p className="text-[10px] font-mono text-gold-600">20% of budget</p>
              </div>
              <div className="p-4 rounded-sm bg-paper-100 border border-paper-300">
                <p className="text-xs text-ink-500">Entertainment</p>
                <p className="font-serif text-xl font-bold text-ink-900 mt-1">₹4,000</p>
                <p className="text-[10px] font-mono text-gold-600">16% of budget</p>
              </div>
              <div className="p-4 rounded-sm bg-paper-100 border border-paper-300">
                <p className="text-xs text-ink-500">Venue</p>
                <p className="font-serif text-xl font-bold text-ink-900 mt-1">₹4,000</p>
                <p className="text-[10px] font-mono text-gold-600">16% of budget</p>
              </div>
              <div className="col-span-2 sm:col-span-1 p-4 rounded-sm bg-paper-100 border border-paper-300">
                <p className="text-xs text-ink-500">Miscellaneous</p>
                <p className="font-serif text-xl font-bold text-ink-900 mt-1">₹2,000</p>
                <p className="text-[10px] font-mono text-gold-600">8% of budget</p>
              </div>
            </div>
          </div>

          {/* AI Suggestions Checklist (Numbered, no checkmark bullets) */}
          <div className="pt-2 border-t border-paper-200">
            <p className="text-xs font-mono uppercase tracking-wider text-ink-400 mb-3">
              AI Suggestions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ink-700 font-sans">
              <div className="flex items-center space-x-2.5 p-3 rounded-sm bg-paper-50 border border-paper-200">
                <span className="font-mono text-[10px] text-gold-600 font-bold">01</span>
                <span>Warm fairy-light decoration and botanical greenery</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-sm bg-paper-50 border border-paper-200">
                <span className="font-mono text-[10px] text-gold-600 font-bold">02</span>
                <span>Garden-themed photo corner with instant polaroids</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-sm bg-paper-50 border border-paper-200">
                <span className="font-mono text-[10px] text-gold-600 font-bold">03</span>
                <span>Personalized pistachio rose-milk birthday cake</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-sm bg-paper-50 border border-paper-200">
                <span className="font-mono text-[10px] text-gold-600 font-bold">04</span>
                <span>Acoustic music set and interactive trivia icebreaker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Architectural Explorer (Replaces cliché feature cards in a row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-paper-300 pb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
            System Capabilities
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 mt-1">
            Engineered For Event Precision
          </h2>
          <p className="text-xs text-ink-500 font-mono mt-1">
            Explore how Eventora coordinates each dimension of celebration planning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Module Selector */}
          <div className="lg:col-span-5 space-y-2">
            {[
              {
                id: 'studio' as const,
                index: '01',
                title: 'AI Planning Studio',
                desc: 'Synthesizes theme concepts, decor palettes, catering menus, and guest activities tailored to Indian cities.',
              },
              {
                id: 'budget' as const,
                index: '02',
                title: 'Precision Budget Manager',
                desc: 'Recharts visual analytics, departmental allocations, live ledger, and interactive what-if simulator.',
              },
              {
                id: 'timeline' as const,
                index: '03',
                title: 'Smart Countdown Timeline',
                desc: 'Live ticking countdown in days, hours, minutes, and seconds with milestone completion sequencing.',
              },
              {
                id: 'vendors' as const,
                index: '04',
                title: 'Vendor Hub & WhatsApp RFQs',
                desc: '7 core vendor categories with 1-click WhatsApp quote requests and negotiation script generators.',
              },
            ].map((p) => {
              const isSelected = activePillar === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setActivePillar(p.id)}
                  className={`p-5 rounded-sm border transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-card border-ink-900'
                      : 'bg-paper-100 border-paper-300 hover:border-paper-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-gold-600 font-bold">{p.index}</span>
                    <span className="text-ink-400">{isSelected ? 'Active View' : 'Click to Inspect'}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink-900">
                    {p.title}
                  </h3>
                  <p className="text-xs text-ink-600 mt-1 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Blueprint Preview Panel */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-sm bg-card border border-paper-300 min-h-[380px] flex flex-col justify-between">
            {activePillar === 'studio' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-paper-200 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gold-600">
                    AI Studio Preview
                  </span>
                  <span className="text-xs font-mono text-ink-500">Live Copilot Enabled</span>
                </div>
                <h4 className="font-serif text-xl font-bold text-ink-900">
                  Concept: Coastal Sunset Royal Sangeet
                </h4>
                <p className="text-xs text-ink-700 leading-relaxed font-sans">
                  Harmonizes traditional marigold decor with minimalist acoustic shehnai welcoming, authentic Gujarati vegetarian thali, and seaside sunset photo corners.
                </p>
                <div className="p-4 rounded-sm bg-paper-100 border border-paper-200 font-mono text-xs space-y-1">
                  <span className="text-ink-500 uppercase text-[10px] block">Harmonized Color Palette:</span>
                  <div className="flex items-center space-x-2 pt-1">
                    <div className="w-6 h-6 rounded-sm bg-[#A38035] border border-paper-300" title="Aged Brass" />
                    <div className="w-6 h-6 rounded-sm bg-[#1A4331] border border-paper-300" title="Forest Pine" />
                    <div className="w-6 h-6 rounded-sm bg-[#F5EED9] border border-paper-300" title="Warm Silk" />
                    <div className="w-6 h-6 rounded-sm bg-[#8E2A2B] border border-paper-300" title="Terra-Cotta" />
                  </div>
                </div>
              </div>
            )}

            {activePillar === 'budget' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-paper-200 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700">
                    Budget Precision Preview
                  </span>
                  <span className="text-xs font-mono text-ink-500">Recharts Math Sync</span>
                </div>
                <h4 className="font-serif text-xl font-bold text-ink-900">
                  Departmental Allocation Ledger
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-sm bg-paper-100 border border-paper-200">
                    <span className="text-[10px] text-ink-400 block">Catering (35%)</span>
                    <span className="font-serif text-base font-bold text-ink-900">₹1,05,000</span>
                  </div>
                  <div className="p-3 rounded-sm bg-paper-100 border border-paper-200">
                    <span className="text-[10px] text-ink-400 block">Venue (25%)</span>
                    <span className="font-serif text-base font-bold text-ink-900">₹75,000</span>
                  </div>
                  <div className="p-3 rounded-sm bg-paper-100 border border-paper-200">
                    <span className="text-[10px] text-ink-400 block">Florals & Decor (20%)</span>
                    <span className="font-serif text-base font-bold text-ink-900">₹60,000</span>
                  </div>
                  <div className="p-3 rounded-sm bg-paper-100 border border-paper-200">
                    <span className="text-[10px] text-ink-400 block">Entertainment (12%)</span>
                    <span className="font-serif text-base font-bold text-ink-900">₹36,000</span>
                  </div>
                </div>
              </div>
            )}

            {activePillar === 'timeline' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-paper-200 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gold-600">
                    Smart Timeline Preview
                  </span>
                  <span className="text-xs font-mono text-ink-500">Reverse Engineered</span>
                </div>
                <h4 className="font-serif text-xl font-bold text-ink-900">
                  Countdown to Celebration
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center font-mono py-2">
                  <div className="p-3 rounded-sm bg-paper-100 border border-paper-200">
                    <span className="font-serif text-2xl font-bold text-gold-700">45</span>
                    <span className="text-[10px] block text-ink-500">Days</span>
                  </div>
                  <div className="p-3 rounded-sm bg-paper-100 border border-paper-200">
                    <span className="font-serif text-2xl font-bold text-gold-700">14</span>
                    <span className="text-[10px] block text-ink-500">Hours</span>
                  </div>
                  <div className="p-3 rounded-sm bg-paper-100 border border-paper-200">
                    <span className="font-serif text-2xl font-bold text-gold-700">32</span>
                    <span className="text-[10px] block text-ink-500">Mins</span>
                  </div>
                  <div className="p-3 rounded-sm bg-paper-100 border border-paper-200">
                    <span className="font-serif text-2xl font-bold text-gold-700">08</span>
                    <span className="text-[10px] block text-ink-500">Secs</span>
                  </div>
                </div>
              </div>
            )}

            {activePillar === 'vendors' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-paper-200 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700">
                    Vendor Partner Preview
                  </span>
                  <span className="text-xs font-mono text-ink-500">1-Click WhatsApp</span>
                </div>
                <h4 className="font-serif text-xl font-bold text-ink-900">
                  Negotiation Script & Outreach
                </h4>
                <div className="p-4 rounded-sm bg-paper-100 border border-paper-200 text-xs font-mono text-ink-800 space-y-2">
                  <p className="text-[11px] text-ink-500">Sample WhatsApp RFQ Template:</p>
                  <p className="italic bg-card p-2.5 rounded-sm border border-paper-300 text-[11px]">
                    &quot;Namaste, we are organizing a Wedding celebration in Mumbai on Dec 16 for 150 guests. We would love to discuss your catering package...&quot;
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Direct CTA */}
            <div className="pt-4 border-t border-paper-200 flex items-center justify-between">
              <span className="text-xs text-ink-500 font-mono">
                Included in every Eventora workspace
              </span>
              <button
                onClick={onExploreDashboard}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-ink-900 hover:bg-ink-950 text-white text-xs font-medium transition-colors"
              >
                <span>Launch Workspace</span>
                <IconArrowRight className="w-3.5 h-3.5 text-gold-400" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
