'use client';

import React, { useState } from 'react';
import { EventItem, AIEventPlan } from '@/types';
import {
  IconRefresh,
  IconCheck,
  IconArrowRight,
  IconMapPin,
  IconUsers,
  IconCalendar,
  IconWallet,
  IconClock,
  IconPrinter,
  IconMessage,
  IconSparkles,
} from './Icons';
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

  // Copilot interactive state
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  if (!activeEvent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink-900">
          No celebration selected
        </h2>
        <p className="text-sm text-ink-600 max-w-md mx-auto">
          Please select an active event from the navigation bar or create a new celebration to access the AI Planning Studio.
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

  const handleCopilotAsk = (promptText?: string) => {
    const q = promptText || copilotQuery;
    if (!q.trim()) return;

    setIsCopilotThinking(true);
    setCopilotResponse(null);

    setTimeout(() => {
      let answer = '';
      const lower = q.toLowerCase();

      if (lower.includes('cut') || lower.includes('budget') || lower.includes('save')) {
        answer = `Strategist Recommendation: For your ₹${Number(activeEvent.totalBudget).toLocaleString('en-IN')} budget in ${activeEvent.location}, you can save ~₹15,000–₹25,000 by procuring seasonal florals directly from local wholesale flower mandis early morning instead of full-service florist markups, and pre-batching twin 5L signature mocktails instead of single-serve canned beverages.`;
      } else if (lower.includes('vegetarian') || lower.includes('food') || lower.includes('menu')) {
        answer = `Curated Menu Additions: For ${activeEvent.guestCount} guests, elevate the spread with Truffle Sev Puri canapés, Paneer Kundan Kalia with saffron rotis, live Jalebi with artisanal pistachio Rabdi, and hot Masala Chai served in clay kulhads for an authentic, memorable culinary identity.`;
      } else if (lower.includes('negotiat') || lower.includes('vendor')) {
        answer = `Vendor Negotiation Script: "We are finalizing our vendor partners for our ${activeEvent.eventType} on ${activeEvent.eventDate} in ${activeEvent.location} for ${activeEvent.guestCount} guests. We admire your portfolio and have allocated a target of ₹${Math.round(Number(activeEvent.totalBudget) * 0.25).toLocaleString('en-IN')} for this service. Can we lock this with a 30% advance if we confirm by this Friday?"`;
      } else {
        answer = `Strategist Advice for "${activeEvent.title}": Focus guest arrival 45 minutes prior to golden hour (5:30 PM) to capture pristine natural sunset portraits before switching to warm incandescent ambient lighting. Keep guest flow fluid with live interactive skewer stations rather than rigid sit-down dining.`;
      }

      setCopilotResponse(answer);
      setIsCopilotThinking(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Studio Header Banner */}
      <div className="rounded-2xl bg-white border border-paper-300 p-6 sm:p-10 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-paper-200 text-ink-700 text-[11px] font-mono uppercase tracking-wider">
                GenAI Planning Studio
              </span>
              <span className="px-2.5 py-0.5 rounded bg-paper-100 text-ink-600 text-[11px] font-mono border border-paper-300">
                {activeEvent.eventType}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink-900">
              Your AI Planning Studio
            </h1>

            <p className="text-sm sm:text-base text-ink-600 font-normal leading-relaxed">
              Your personal event strategist, ready to turn ideas into action.
            </p>

            {/* Context bar */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-ink-600 font-mono">
              <span className="flex items-center space-x-1">
                <IconMapPin className="w-3.5 h-3.5 text-gold-600" />
                <span>{activeEvent.location}</span>
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1">
                <IconUsers className="w-3.5 h-3.5 text-gold-600" />
                <span>{activeEvent.guestCount} guests</span>
              </span>
              <span>·</span>
              <span className="font-semibold text-ink-900">
                ₹{Number(activeEvent.totalBudget).toLocaleString('en-IN')} Budget
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1">
                <IconCalendar className="w-3.5 h-3.5 text-gold-600" />
                <span>{activeEvent.eventDate}</span>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 flex-shrink-0 no-print">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white hover:bg-paper-100 text-ink-800 text-xs font-medium border border-paper-300 shadow-subtle transition-colors"
            >
              <IconPrinter className="w-3.5 h-3.5 text-ink-600" />
              <span>Print Executive Dossier</span>
            </button>

            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-ink-900 hover:bg-ink-950 text-white font-medium text-xs sm:text-sm shadow-subtle transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <IconRefresh className={`w-3.5 h-3.5 text-gold-400 ${regenerating ? 'animate-spin' : ''}`} />
              <span>{regenerating ? 'Synthesizing Proposal...' : 'Regenerate Plan'}</span>
            </button>

            {regenerateSuccess && (
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                ✓ Plan refreshed with new ideas
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive AI Copilot / Quick Command Bar (New Feature) */}
      <div className="rounded-2xl bg-paper-100 border border-paper-300 p-6 space-y-4 no-print shadow-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-gold-500" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-ink-800 font-semibold">
              Ask Eventora AI Strategist
            </h3>
          </div>
          <span className="text-[11px] text-ink-400 font-mono">Live Copilot</span>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => {
              setCopilotQuery('Cut ₹30,000 from decor and reallocate to catering');
              handleCopilotAsk('Cut ₹30,000 from decor and reallocate to catering');
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-paper-300 hover:border-ink-400 text-ink-700 transition-colors"
          >
            💡 How can we cut ₹30,000 without losing impact?
          </button>
          <button
            onClick={() => {
              setCopilotQuery('Suggest gourmet vegetarian menu for winter in Mumbai');
              handleCopilotAsk('Suggest gourmet vegetarian menu for winter in Mumbai');
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-paper-300 hover:border-ink-400 text-ink-700 transition-colors"
          >
            🍽️ Curate regional vegetarian gourmet highlights
          </button>
          <button
            onClick={() => {
              setCopilotQuery('Draft negotiation message for wedding photographer');
              handleCopilotAsk('Draft negotiation message for wedding photographer');
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-paper-300 hover:border-ink-400 text-ink-700 transition-colors"
          >
            📝 Generate vendor negotiation script
          </button>
        </div>

        {/* Input box */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={copilotQuery}
            onChange={(e) => setCopilotQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCopilotAsk()}
            placeholder="Ask anything about timing, budget rebalancing, vendor questions, or decor..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-paper-300 text-xs sm:text-sm text-ink-900 bg-white focus:outline-none focus:border-ink-900"
          />
          <button
            onClick={() => handleCopilotAsk()}
            disabled={isCopilotThinking}
            className="px-4 py-2.5 rounded-lg bg-ink-900 hover:bg-ink-950 text-white text-xs font-semibold shadow-subtle transition-colors"
          >
            {isCopilotThinking ? 'Thinking...' : 'Ask AI'}
          </button>
        </div>

        {/* Response Box */}
        {copilotResponse && (
          <div className="p-4 rounded-xl bg-white border border-paper-300 text-xs sm:text-sm text-ink-800 leading-relaxed font-normal animate-in fade-in">
            <p className="font-semibold text-ink-900 mb-1 font-mono text-xs uppercase tracking-wider text-gold-600">
              AI Strategic Recommendation:
            </p>
            {copilotResponse}
          </div>
        )}
      </div>

      {!plan ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-paper-300">
          <p className="text-sm text-ink-600 mb-4">No AI plan found for this event yet.</p>
          <button
            onClick={handleRegenerate}
            className="px-6 py-2.5 rounded-lg bg-ink-900 text-white font-medium text-xs"
          >
            Generate AI Blueprint Now
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Module 1: Concept & Tagline */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-paper-300 shadow-card space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
              01 / Concept & Creative Vision
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 leading-snug">
              {plan.tagline || 'Where memorable moments come to life.'}
            </h2>

            <p className="text-sm sm:text-base text-ink-700 leading-relaxed max-w-4xl font-normal">
              {plan.concept}
            </p>
          </div>

          {/* Module 2: Theme & Color Palette */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-paper-300 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-paper-200 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
                  02 / Aesthetic Direction
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-900 mt-1">
                  {plan.theme.name}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                  {plan.theme.description}
                </p>

                {/* Color Swatches */}
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-ink-400 mb-2">
                    Harmonized Color Palette
                  </p>
                  <div className="flex items-center space-x-3">
                    {plan.theme.colorPalette.map((color, idx) => (
                      <div key={idx} className="space-y-1 text-center">
                        <div
                          className="w-12 h-12 rounded-lg border border-paper-300 shadow-subtle"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        <span className="text-[10px] text-ink-500 font-mono block">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Style notes */}
              <div className="p-6 rounded-xl bg-paper-100 border border-paper-300 space-y-3">
                <p className="text-[11px] font-mono uppercase tracking-wider text-ink-500 font-semibold">
                  Architectural Styling Cues
                </p>
                <ul className="space-y-2.5 text-xs text-ink-700">
                  {(plan.theme.styleNotes || []).map((note, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-600 mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Module 3: Decoration Installations */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-paper-300 shadow-card space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
              03 / Decoration Installations
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(plan.decorationIdeas || []).map((decor, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-paper-50 border border-paper-300 space-y-2.5"
                >
                  <span className="px-2 py-0.5 rounded bg-white border border-paper-300 text-ink-700 text-[10px] font-mono uppercase tracking-wider">
                    {decor.placement}
                  </span>
                  <h4 className="font-serif text-base font-bold text-ink-900">
                    {decor.title}
                  </h4>
                  <p className="text-xs text-ink-600 leading-relaxed">
                    {decor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Module 4: Catering Concept */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-paper-300 shadow-card space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
              04 / Catering Concept
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-paper-100 border border-paper-300 space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-ink-400">
                  Cuisine Framework
                </p>
                <h4 className="font-serif text-lg font-bold text-ink-900">
                  {plan.cateringSuggestions.cuisineStyle}
                </h4>
                <p className="text-xs text-ink-500">
                  Tailored for {activeEvent.guestCount} guests in {activeEvent.location}.
                </p>
              </div>

              <div className="md:col-span-2 p-6 rounded-xl bg-white border border-paper-300 space-y-3">
                <p className="text-[11px] font-mono uppercase tracking-wider text-ink-400">
                  Menu Highlights
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-800">
                  {(plan.cateringSuggestions.menuHighlights || []).map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 rounded bg-paper-50 border border-paper-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-600 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dietary & Beverage Pairings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-4 rounded-xl bg-paper-50 border border-paper-300">
                <p className="font-semibold text-ink-800 mb-1 font-mono text-[11px]">Dietary Notes</p>
                <p className="text-ink-600">
                  {plan.cateringSuggestions.dietaryConsiderations?.join(', ') || 'Vegetarian and allergen accommodations.'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-paper-50 border border-paper-300">
                <p className="font-semibold text-ink-800 mb-1 font-mono text-[11px]">Beverage Pairings</p>
                <p className="text-ink-600">
                  {plan.cateringSuggestions.beveragePairings?.join(', ') || 'Botanical sodas and spiced coolers.'}
                </p>
              </div>
            </div>
          </div>

          {/* Module 5: Suggested Budget Distribution */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-paper-300 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-paper-200 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
                  05 / Suggested Budget Distribution
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-900 mt-1">
                  Total Allocation: ₹{Number(activeEvent.totalBudget).toLocaleString('en-IN')}
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('budget')}
                className="text-xs font-semibold text-gold-700 hover:underline inline-flex items-center space-x-1"
              >
                <span>Manage Rupee by Rupee</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(plan.budgetDistribution || []).map((b, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-paper-50 border border-paper-300 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink-900">{b.category}</span>
                    <span className="font-mono font-bold text-gold-700">{b.percentage}%</span>
                  </div>
                  <p className="font-serif text-xl font-bold text-ink-900">
                    ₹{b.suggestedAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-ink-600 leading-relaxed">
                    {b.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Module 6: Recommended Planning Timeline */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-paper-300 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-paper-200 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
                  06 / Recommended Planning Milestones
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-900 mt-1">
                  Sequenced from Event Date
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('timeline')}
                className="text-xs font-semibold text-gold-700 hover:underline inline-flex items-center space-x-1"
              >
                <span>Open Live Countdown</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(plan.planningTimeline || []).map((stage, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-paper-50 border border-paper-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-ink-900">
                      {stage.stage}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-white text-ink-700 text-[10px] font-mono border border-paper-300">
                      {stage.timeframe}
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-ink-700">
                    {(stage.tasks || []).map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Module 7: Vendor Checklist Questions */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-paper-300 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-paper-200 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
                  07 / Vendor Checklist
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-900 mt-1">
                  Critical Negotiation & Verification Questions
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('vendors')}
                className="text-xs font-semibold text-gold-700 hover:underline inline-flex items-center space-x-1"
              >
                <span>Vendor Manager</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(plan.vendorChecklist || []).map((ven, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-paper-50 border border-paper-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-ink-900">
                      {ven.category}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white border border-paper-300 text-ink-700">
                      {ven.priority}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-ink-700">
                    <p className="font-mono text-[10px] uppercase text-ink-400">Must-Ask Questions:</p>
                    {(ven.questionsToAsk || []).map((q, qIdx) => (
                      <div key={qIdx} className="flex items-start space-x-2">
                        <span className="text-gold-600 font-bold">?</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module 8: Activities & Personalized Ideas */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-paper-300 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-paper-200 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
                  08 / Guest Experience & Entertainment
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-900 mt-1">
                  Curated Activities
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(plan.entertainmentAndActivities || []).map((act, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-paper-50 border border-paper-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-ink-900">
                      {act.name}
                    </h4>
                    <span className="text-[10px] font-mono text-ink-500 bg-white px-2 py-0.5 rounded border border-paper-300">
                      {act.suitableFor}
                    </span>
                  </div>
                  <p className="text-xs text-ink-600 leading-relaxed">
                    {act.description}
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
