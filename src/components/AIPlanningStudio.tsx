'use client';

import React, { useState } from 'react';
import { EventItem, AIEventPlan } from '@/types';
import {
  IconRefresh,
  IconArrowRight,
  IconMapPin,
  IconUsers,
  IconCalendar,
  IconWallet,
  IconClock,
  IconPrinter,
  IconMessage,
  IconPieChart,
} from './Icons';
import { attachAIPlanToEvent } from '@/lib/storage';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const STUDIO_COLORS = ['#A38035', '#1A4331', '#6366F1', '#A83839', '#8A6B27', '#06B6D4', '#235840'];

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
          Please select an active celebration or create a new one to access the AI Planning Studio.
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

      if (lower.includes('cut') || lower.includes('budget') || lower.includes('save') || lower.includes('reallocate')) {
        answer = `Strategist Recommendation: For your ₹${Number(activeEvent.totalBudget).toLocaleString('en-IN')} budget in ${activeEvent.location}, you can save approximately ₹15,000 to ₹25,000 by procuring seasonal florals directly from local wholesale flower mandis early morning instead of full-service florist markups, and pre-batching twin 5L signature mocktails instead of single-serve canned beverages.`;
      } else if (lower.includes('vegetarian') || lower.includes('food') || lower.includes('menu')) {
        answer = `Curated Menu Additions: For ${activeEvent.guestCount} guests, elevate the spread with Truffle Sev Puri canapes, Paneer Kundan Kalia with saffron rotis, live Jalebi with artisanal pistachio Rabdi, and hot Masala Chai served in clay kulhads for an authentic, memorable culinary identity.`;
      } else if (lower.includes('negotiat') || lower.includes('vendor')) {
        answer = `Vendor Negotiation Script: "We are finalizing our vendor partners for our ${activeEvent.eventType} on ${activeEvent.eventDate} in ${activeEvent.location} for ${activeEvent.guestCount} guests. We admire your portfolio and have allocated a target of ₹${Math.round(Number(activeEvent.totalBudget) * 0.25).toLocaleString('en-IN')} for this service. Can we lock this with a 30% advance if we confirm by this Friday?"`;
      } else {
        answer = `Strategist Advice for "${activeEvent.title}": Focus guest arrival 45 minutes prior to golden hour (5:30 PM) to capture pristine natural sunset portraits before switching to warm incandescent ambient lighting. Keep guest flow fluid with live interactive skewer stations rather than rigid sit-down dining.`;
      }

      setCopilotResponse(answer);
      setIsCopilotThinking(false);
    }, 600);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-300 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
            Synthesis Engine · Google Gemini
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink-900 mt-1">
            Your AI Planning Studio
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 font-mono mt-1">
            {activeEvent.title} · {activeEvent.eventType} · {activeEvent.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Print / Export Dossier Button */}
          <button
            onClick={handlePrintDossier}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-sm bg-card hover:bg-paper-200 border border-paper-300 text-ink-800 text-xs font-mono font-medium transition-colors"
            title="Export Clean Executive Print Dossier"
          >
            <IconPrinter className="w-4 h-4 text-ink-600" />
            <span>Export Dossier (Print/PDF)</span>
          </button>

          {/* Regenerate AI Plan Button */}
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-sm bg-ink-900 hover:bg-ink-950 text-white font-medium text-xs sm:text-sm transition-colors active:scale-[0.99] disabled:opacity-60"
          >
            <IconRefresh className={`w-3.5 h-3.5 text-gold-400 ${regenerating ? 'animate-spin' : ''}`} />
            <span>{regenerating ? 'Synthesizing...' : 'Re-Run Blueprint Synthesis'}</span>
          </button>
        </div>
      </div>

      {regenerateSuccess && (
        <div className="p-4 rounded-sm bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono flex items-center justify-between">
          <span>AI event plan refreshed and synced with latest celebration requirements.</span>
        </div>
      )}

      {/* Summary Parameters Bar */}
      <div className="p-6 rounded-sm bg-card border border-paper-300 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <span className="text-[10px] text-ink-400 block uppercase">Target Celebration</span>
          <span className="font-semibold text-ink-900 block truncate">{activeEvent.title}</span>
        </div>
        <div>
          <span className="text-[10px] text-ink-400 block uppercase">Total Allocation</span>
          <span className="font-serif text-base font-bold text-ink-900 block">
            ₹{Number(activeEvent.totalBudget).toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-ink-400 block uppercase">Guest Roster</span>
          <span className="font-semibold text-ink-900 block">{activeEvent.guestCount} guests</span>
        </div>
        <div>
          <span className="text-[10px] text-ink-400 block uppercase">Event Date</span>
          <span className="font-semibold text-ink-900 block">{activeEvent.eventDate}</span>
        </div>
      </div>

      {/* Interactive AI Copilot QA Module */}
      <div className="p-6 sm:p-8 rounded-sm bg-card border border-paper-300 space-y-4">
        <div className="flex items-center justify-between border-b border-paper-200 pb-3">
          <div className="flex items-center space-x-2">
            <IconMessage className="w-4 h-4 text-gold-600" />
            <h3 className="font-serif text-lg font-bold text-ink-900">
              Interactive Planning Copilot
            </h3>
          </div>
          <span className="text-[11px] text-ink-500 font-mono">Real-Time Assistant</span>
        </div>

        {/* Quick Suggestion Chips without emojis */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => {
              setCopilotQuery('Cut ₹30,000 from decor and reallocate to catering');
              handleCopilotAsk('Cut ₹30,000 from decor and reallocate to catering');
            }}
            className="px-3 py-1.5 rounded-sm bg-paper-100 hover:bg-paper-200 border border-paper-300 text-ink-700 transition-colors"
          >
            Optimization: Cut ₹30,000 from decor and reallocate to catering
          </button>
          <button
            onClick={() => {
              setCopilotQuery('Suggest gourmet vegetarian menu for winter in Mumbai');
              handleCopilotAsk('Suggest gourmet vegetarian menu for winter in Mumbai');
            }}
            className="px-3 py-1.5 rounded-sm bg-paper-100 hover:bg-paper-200 border border-paper-300 text-ink-700 transition-colors"
          >
            Culinary: Curate regional gourmet vegetarian highlights
          </button>
          <button
            onClick={() => {
              setCopilotQuery('Draft negotiation message for wedding photographer');
              handleCopilotAsk('Draft negotiation message for wedding photographer');
            }}
            className="px-3 py-1.5 rounded-sm bg-paper-100 hover:bg-paper-200 border border-paper-300 text-ink-700 transition-colors"
          >
            Negotiation: Generate vendor negotiation script
          </button>
        </div>

        {/* Input box */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={copilotQuery}
            onChange={(e) => setCopilotQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCopilotAsk()}
            placeholder="Ask anything regarding timing, budget rebalancing, vendor questions, or decor..."
            className="flex-1 px-4 py-2.5 rounded-sm border border-paper-300 text-xs sm:text-sm text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
          />
          <button
            onClick={() => handleCopilotAsk()}
            disabled={isCopilotThinking}
            className="px-5 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-950 text-white text-xs font-semibold transition-colors disabled:opacity-60"
          >
            {isCopilotThinking ? 'Thinking...' : 'Consult AI'}
          </button>
        </div>

        {/* Skeleton Shimmer While Copilot Is Thinking */}
        {isCopilotThinking && (
          <div className="p-4 rounded-sm bg-paper-50 border border-paper-300 space-y-2 animate-pulse">
            <div className="h-3 w-32 bg-paper-300 rounded-sm skeleton-shimmer" />
            <div className="h-4 w-full bg-paper-200 rounded-sm skeleton-shimmer" />
            <div className="h-4 w-5/6 bg-paper-200 rounded-sm skeleton-shimmer" />
          </div>
        )}

        {/* Response Box */}
        {copilotResponse && !isCopilotThinking && (
          <div className="p-4 rounded-sm bg-paper-50 border border-paper-300 text-xs sm:text-sm text-ink-800 leading-relaxed font-sans">
            <p className="font-semibold text-ink-900 mb-1 font-mono text-xs uppercase tracking-wider text-gold-600">
              AI Strategic Recommendation:
            </p>
            {copilotResponse}
          </div>
        )}
      </div>

      {!plan ? (
        <div className="p-12 text-center bg-card rounded-sm border border-paper-300">
          <p className="text-sm text-ink-600 mb-4">No AI plan found for this event yet.</p>
          <button
            onClick={handleRegenerate}
            className="px-6 py-2.5 rounded-sm bg-ink-900 text-white font-medium text-xs"
          >
            Generate AI Blueprint Now
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Module 1: Concept and Tagline */}
          <div className="p-8 sm:p-10 rounded-sm bg-card border border-paper-300 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
              01 / Concept & Creative Vision
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 leading-snug">
              {plan.tagline || 'Where memorable moments come to life.'}
            </h2>

            <p className="text-sm sm:text-base text-ink-700 leading-relaxed max-w-4xl font-normal font-sans">
              {plan.concept}
            </p>
          </div>

          {/* Module 2: Theme and Color Palette */}
          <div className="p-8 sm:p-10 rounded-sm bg-card border border-paper-300 space-y-6">
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
                <p className="text-xs sm:text-sm text-ink-600 leading-relaxed font-sans">
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
                          className="w-12 h-12 rounded-sm border border-paper-300"
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

              {/* Style notes without checkmark bullets */}
              <div className="p-6 rounded-sm bg-paper-100 border border-paper-300 space-y-3">
                <p className="text-[11px] font-mono uppercase tracking-wider text-ink-600 font-semibold">
                  Architectural Styling Cues
                </p>
                <div className="space-y-2.5 text-xs text-ink-700 font-sans">
                  {(plan.theme.styleNotes || []).map((note, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="font-mono text-[10px] text-gold-600 font-bold mt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="leading-relaxed">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Module 3: Decoration Installations */}
          <div className="p-8 sm:p-10 rounded-sm bg-card border border-paper-300 space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
              03 / Decoration Installations
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(plan.decorationIdeas || []).map((decor, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-sm bg-paper-50 border border-paper-300 space-y-2.5"
                >
                  <span className="px-2 py-0.5 rounded-sm bg-card border border-paper-300 text-ink-700 text-[10px] font-mono uppercase tracking-wider">
                    {decor.placement}
                  </span>
                  <h4 className="font-serif text-base font-bold text-ink-900">
                    {decor.title}
                  </h4>
                  <p className="text-xs text-ink-600 leading-relaxed font-sans">
                    {decor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Module 4: Catering Concept */}
          <div className="p-8 sm:p-10 rounded-sm bg-card border border-paper-300 space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
              04 / Catering Concept
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-sm bg-paper-100 border border-paper-300 space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-ink-400">
                  Cuisine Framework
                </p>
                <h4 className="font-serif text-lg font-bold text-ink-900">
                  {plan.cateringSuggestions.cuisineStyle}
                </h4>
                <p className="text-xs text-ink-500 font-sans">
                  Tailored for {activeEvent.guestCount} guests in {activeEvent.location}.
                </p>
              </div>

              <div className="md:col-span-2 p-6 rounded-sm bg-card border border-paper-300 space-y-3">
                <p className="text-[11px] font-mono uppercase tracking-wider text-ink-400">
                  Menu Highlights
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-800 font-sans">
                  {(plan.cateringSuggestions.menuHighlights || []).map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 rounded-sm bg-paper-50 border border-paper-200">
                      <span className="font-mono text-[10px] text-gold-600 font-bold">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dietary and Beverage Pairings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1 font-sans">
              <div className="p-4 rounded-sm bg-paper-50 border border-paper-300">
                <p className="font-semibold text-ink-800 mb-1 font-mono text-[11px]">Dietary Notes</p>
                <p className="text-ink-600">
                  {plan.cateringSuggestions.dietaryConsiderations?.join(', ') || 'Vegetarian and allergen accommodations.'}
                </p>
              </div>
              <div className="p-4 rounded-sm bg-paper-50 border border-paper-300">
                <p className="font-semibold text-ink-800 mb-1 font-mono text-[11px]">Beverage Pairings</p>
                <p className="text-ink-600">
                  {plan.cateringSuggestions.beveragePairings?.join(', ') || 'Botanical sodas and spiced coolers.'}
                </p>
              </div>
            </div>
          </div>

          {/* Module 5: Suggested Budget Distribution with Recharts */}
          <div className="p-8 sm:p-10 rounded-sm bg-card border border-paper-300 space-y-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="p-4 rounded-sm bg-paper-50 border border-paper-200 flex flex-col items-center justify-center">
                <p className="text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                  Visual Share Breakdown
                </p>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={plan.budgetDistribution.map((b) => ({
                          name: b.category,
                          value: b.suggestedAmount,
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {plan.budgetDistribution.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={STUDIO_COLORS[index % STUDIO_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Suggested']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(plan.budgetDistribution || []).map((b, idx) => (
                  <div key={idx} className="p-4 rounded-sm bg-paper-50 border border-paper-300 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink-900">{b.category}</span>
                      <span className="font-mono font-bold text-gold-700">{b.percentage}%</span>
                    </div>
                    <p className="font-serif text-lg font-bold text-ink-900">
                      ₹{b.suggestedAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-ink-600 leading-relaxed font-sans">
                      {b.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module 6: Recommended Planning Timeline */}
          <div className="p-8 sm:p-10 rounded-sm bg-card border border-paper-300 space-y-6">
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
                <div key={idx} className="p-6 rounded-sm bg-paper-50 border border-paper-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-ink-900">
                      {stage.stage}
                    </h4>
                    <span className="px-2 py-0.5 rounded-sm bg-card text-ink-700 text-[10px] font-mono border border-paper-300">
                      {stage.timeframe}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-ink-700 font-sans">
                    {(stage.tasks || []).map((task, tIdx) => (
                      <div key={tIdx} className="flex items-start space-x-2">
                        <span className="font-mono text-[10px] text-emerald-700 font-bold mt-0.5">
                          {String(tIdx + 1).padStart(2, '0')}
                        </span>
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module 7: Vendor Checklist Questions */}
          <div className="p-8 sm:p-10 rounded-sm bg-card border border-paper-300 space-y-6">
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
                <span>Vendor Manager & WhatsApp</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(plan.vendorChecklist || []).map((ven, idx) => (
                <div key={idx} className="p-6 rounded-sm bg-paper-50 border border-paper-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-ink-900">
                      {ven.category}
                    </h4>
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase bg-card border border-paper-300 text-ink-700">
                      {ven.priority}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-ink-700 font-sans">
                    <p className="font-mono text-[10px] uppercase text-ink-500">Key Verification Inquiries:</p>
                    {(ven.questionsToAsk || []).map((q, qIdx) => (
                      <div key={qIdx} className="flex items-start space-x-2">
                        <span className="text-gold-600 font-mono font-bold text-[10px] mt-0.5">
                          {String(qIdx + 1).padStart(2, '0')}
                        </span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module 8: Activities & Curated Ideas */}
          <div className="p-8 sm:p-10 rounded-sm bg-card border border-paper-300 space-y-6">
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
                <div key={idx} className="p-6 rounded-sm bg-paper-50 border border-paper-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-ink-900">
                      {act.name}
                    </h4>
                    <span className="text-[10px] font-mono text-ink-500 bg-card px-2 py-0.5 rounded-sm border border-paper-300">
                      {act.suitableFor}
                    </span>
                  </div>
                  <p className="text-xs text-ink-600 leading-relaxed font-sans">
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
