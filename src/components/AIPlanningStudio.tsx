'use client';

import React, { useState } from 'react';
import { EventItem, AIEventPlan } from '@/types';
import {
  Sparkles,
  RefreshCw,
  Palette,
  UtensilsCrossed,
  Wallet,
  Clock,
  Users2,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Music,
  MapPin,
  Calendar,
  AlertCircle,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import { attachAIPlanToEvent } from '@/lib/storage';

interface AIPlanningStudioProps {
  activeEvent: EventItem | null;
  onNavigateTab: (tab: string) => void;
  onOpenCreateModal: () => void;
}

export const AIPlanningStudio: React.FC<AIPlanningStudioProps> = ({
  activeEvent,
  onNavigateTab,
  onOpenCreateModal,
}) => {
  const [regenerating, setRegenerating] = useState(false);
  const [regenerateSuccess, setRegenerateSuccess] = useState(false);

  if (!activeEvent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Sparkles className="w-12 h-12 text-terracotta-500 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">
          No celebration selected
        </h2>
        <p className="text-sm text-charcoal-600 max-w-md mx-auto">
          Please select an active event from the navigation bar or create a new celebration to access the AI Planning Studio.
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

  const plan = activeEvent.aiPlan;

  const handleRegenerate = async () => {
    setRegenerating(true);
    setRegenerateSuccess(false);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: activeEvent.title,
          eventType: activeEvent.eventType,
          eventDate: activeEvent.eventDate,
          location: activeEvent.location,
          guestCount: activeEvent.guestCount,
          totalBudget: activeEvent.totalBudget,
          theme: activeEvent.theme,
          preferences: activeEvent.preferences,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        attachAIPlanToEvent(activeEvent.id, resData.data.aiPlan);
        setRegenerateSuccess(true);
        setTimeout(() => setRegenerateSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to regenerate plan:', err);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Studio Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white to-ivory-100/90 border border-ivory-200 p-6 sm:p-10 shadow-card overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-terracotta-50 border border-terracotta-200 text-xs font-semibold text-terracotta-800">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
                <span>AI Generated Blueprint</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-ivory-200 text-xs font-semibold text-charcoal-700">
                {activeEvent.eventType}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-charcoal-900">
              Your AI Planning Studio
            </h1>

            <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-normal">
              Your personal event strategist, ready to turn ideas into action.
            </p>

            {/* Active Event Context Pill Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-charcoal-600 font-medium">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                <span>{activeEvent.location}</span>
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1">
                <Users2 className="w-3.5 h-3.5 text-terracotta-500" />
                <span>{activeEvent.guestCount} guests</span>
              </span>
              <span>·</span>
              <span className="font-semibold text-charcoal-900">
                ₹{Number(activeEvent.totalBudget).toLocaleString('en-IN')} Budget
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
                <span>{activeEvent.eventDate}</span>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 flex-shrink-0">
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white hover:bg-ivory-50 text-charcoal-800 font-semibold text-xs sm:text-sm border border-ivory-300 shadow-subtle transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 text-terracotta-600 ${regenerating ? 'animate-spin' : ''}`} />
              <span>{regenerating ? 'Regenerating Proposal...' : 'Regenerate Plan'}</span>
            </button>

            {regenerateSuccess && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-in fade-in">
                ✓ Plan refreshed with new ideas!
              </span>
            )}
          </div>
        </div>
      </div>

      {!plan ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-ivory-200">
          <p className="text-sm text-charcoal-600 mb-4">No AI plan found for this event yet.</p>
          <button
            onClick={handleRegenerate}
            className="px-6 py-2.5 rounded-full bg-terracotta-600 text-white font-medium text-xs"
          >
            Generate AI Blueprint Now
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Section 1: Concept & Tagline */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ivory-200 shadow-card space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
                1. Event Concept & Creative Vision
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 leading-snug">
              {plan.tagline || 'Where memorable moments come to life.'}
            </h2>

            <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed max-w-4xl">
              {plan.concept}
            </p>
          </div>

          {/* Section 2: Theme & Color Palette */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ivory-200 shadow-card space-y-6">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-terracotta-600" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                2. Theme & Aesthetic Direction
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-3">
                <h4 className="font-serif text-lg font-bold text-terracotta-700">
                  {plan.theme.name}
                </h4>
                <p className="text-sm text-charcoal-600 leading-relaxed">
                  {plan.theme.description}
                </p>

                {/* Color Swatches */}
                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
                    Curated Color Palette
                  </p>
                  <div className="flex items-center space-x-3">
                    {plan.theme.colorPalette.map((color, idx) => (
                      <div key={idx} className="space-y-1 text-center">
                        <div
                          className="w-10 h-10 rounded-xl shadow-subtle border border-ivory-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        <span className="text-[10px] text-charcoal-500 font-mono">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Style notes */}
              <div className="p-6 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                  Styling Notes & Placement Cues
                </p>
                <ul className="space-y-2.5 text-xs text-charcoal-700">
                  {(plan.theme.styleNotes || []).map((note, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Decoration Ideas */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ivory-200 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-champagne-600" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                  3. Decoration Installations
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(plan.decorationIdeas || []).map((decor, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-ivory-50/70 border border-ivory-200 space-y-3 hover:border-terracotta-300 transition-colors"
                >
                  <span className="px-2.5 py-0.5 rounded-full bg-terracotta-100 text-terracotta-800 text-[10px] font-bold uppercase tracking-wider">
                    {decor.placement}
                  </span>
                  <h4 className="font-serif text-base font-bold text-charcoal-900">
                    {decor.title}
                  </h4>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {decor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Catering Suggestions */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ivory-200 shadow-card space-y-6">
            <div className="flex items-center space-x-2">
              <UtensilsCrossed className="w-5 h-5 text-terracotta-600" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                4. Catering & Culinary Concept
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                  Cuisine Style
                </p>
                <h4 className="font-serif text-lg font-bold text-charcoal-900">
                  {plan.cateringSuggestions.cuisineStyle}
                </h4>
                <p className="text-xs text-charcoal-500">
                  Designed for {activeEvent.guestCount} guests in {activeEvent.location}.
                </p>
              </div>

              <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-ivory-200 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                  Menu Highlights
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal-800">
                  {(plan.cateringSuggestions.menuHighlights || []).map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 rounded-lg bg-ivory-50">
                      <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-600 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dietary & Beverage Pairings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-200">
                <p className="font-semibold text-charcoal-700 mb-1">Dietary Considerations</p>
                <p className="text-charcoal-600">
                  {plan.cateringSuggestions.dietaryConsiderations?.join(', ') || 'Vegetarian and allergen accommodations.'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-200">
                <p className="font-semibold text-charcoal-700 mb-1">Beverage Pairings</p>
                <p className="text-charcoal-600">
                  {plan.cateringSuggestions.beveragePairings?.join(', ') || 'Botanical sodas and spiced coolers.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Suggested Budget Distribution */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ivory-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-champagne-600" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                  5. Suggested Budget Distribution
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('budget')}
                className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 inline-flex items-center space-x-1"
              >
                <span>Manage Rupee by Rupee</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(plan.budgetDistribution || []).map((b, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal-900">{b.category}</span>
                    <span className="font-bold text-terracotta-700">{b.percentage}%</span>
                  </div>
                  <p className="font-serif text-xl font-bold text-charcoal-900">
                    ₹{b.suggestedAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-charcoal-600 leading-snug">
                    {b.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Planning Timeline Milestones */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ivory-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                  6. Recommended Planning Timeline
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('timeline')}
                className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 inline-flex items-center space-x-1"
              >
                <span>Open Live Countdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(plan.planningTimeline || []).map((stage, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-ivory-50/70 border border-ivory-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-charcoal-900">
                      {stage.stage}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-charcoal-700 text-xs font-medium border border-ivory-300">
                      {stage.timeframe}
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-charcoal-700">
                    {(stage.tasks || []).map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Vendor Checklist Questions */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ivory-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-terracotta-600" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                  7. Vendor Checklist & Critical Questions
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('vendors')}
                className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 inline-flex items-center space-x-1"
              >
                <span>Vendor Manager</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(plan.vendorChecklist || []).map((ven, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-charcoal-900">
                      {ven.category}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-terracotta-100 text-terracotta-800">
                      {ven.priority}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-charcoal-700">
                    <p className="font-semibold text-charcoal-500 text-[11px]">Must-Ask Questions:</p>
                    {(ven.questionsToAsk || []).map((q, qIdx) => (
                      <div key={qIdx} className="flex items-start space-x-2">
                        <span className="text-terracotta-600 font-bold">?</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Activities & Entertainment */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ivory-200 shadow-card space-y-6">
            <div className="flex items-center space-x-2">
              <Music className="w-5 h-5 text-champagne-600" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                8. Activities & Entertainment
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(plan.entertainmentAndActivities || []).map((act, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-charcoal-900">
                      {act.name}
                    </h4>
                    <span className="text-[10px] font-medium text-charcoal-500 bg-white px-2 py-0.5 rounded-full border border-ivory-200">
                      {act.suitableFor}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 9: Personalized Recommendations Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-terracotta-50 to-champagne-50 border border-terracotta-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-terracotta-600" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                  9. Personalized Recommendations & Cost Savings
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('recommendations')}
                className="text-xs font-semibold text-terracotta-700 hover:underline"
              >
                View Full Inspiration
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {(plan.personalizedRecommendations || []).map((rec, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/90 border border-ivory-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600">
                    {rec.category}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-charcoal-900">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {rec.advice}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

