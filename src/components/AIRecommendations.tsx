'use client';

import React, { useState } from 'react';
import { EventItem, RecommendationItem } from '@/types';
import {
  IconPlus,
  IconCheck,
  IconArrowRight,
} from './Icons';
import { addTaskToEvent } from '@/lib/storage';

interface AIRecommendationsProps {
  activeEvent: EventItem | null;
  onOpenCreateModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  activeEvent,
  onOpenCreateModal,
  onNavigateTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  if (!activeEvent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink-900">
          No celebration selected
        </h2>
        <p className="text-sm text-ink-600 max-w-md mx-auto">
          Please select an active event to explore personalized AI recommendations.
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

  const recs: RecommendationItem[] = [
    ...(activeEvent.recommendations || []),
    ...((activeEvent.aiPlan?.personalizedRecommendations || []).map((r, idx) => ({
      id: `ai-rec-${idx + 1}`,
      category: (r.category as any) || 'Cost Saving',
      title: r.title,
      description: r.advice,
      budgetImpact: (r.category.includes('Cost') ? 'High Savings' : 'Cost Neutral') as
        | 'High Savings'
        | 'Cost Neutral',
      tags: [activeEvent.eventType, activeEvent.location, 'AI Strategist'],
    }))),
  ];

  const uniqueRecs = recs.filter(
    (item, index, self) => index === self.findIndex((t) => t.title === item.title)
  );

  const categories = [
    'All',
    'Theme',
    'Decor',
    'Food',
    'Entertainment',
    'Cost Saving',
    'Location Tip',
  ];

  const filtered = uniqueRecs.filter((r) =>
    selectedCategory === 'All' ? true : r.category === selectedCategory
  );

  const handleApplyAsTask = (rec: RecommendationItem) => {
    addTaskToEvent(activeEvent.id, {
      title: `Implement: ${rec.title}`,
      description: rec.description,
      dueDate: activeEvent.eventDate,
      priority: rec.budgetImpact === 'High Savings' ? 'High' : 'Medium',
      status: 'Pending',
      category: rec.category,
    });

    setAppliedNotice(`Added "${rec.title}" directly to your Timeline milestones!`);
    setTimeout(() => setAppliedNotice(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-300 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
            Contextual Ideation & Nuances
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink-900 mt-1">
            A little inspiration goes a long way.
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 font-mono mt-1">
            Tailored suggestions for {activeEvent.title} ({activeEvent.guestCount} guests in {activeEvent.location})
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('studio')}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white hover:bg-paper-100 text-ink-800 font-medium text-xs sm:text-sm border border-paper-300 shadow-subtle transition-all"
        >
          <span>Full AI Blueprint</span>
          <IconArrowRight className="w-3.5 h-3.5 text-gold-600" />
        </button>
      </div>

      {/* Applied Notification */}
      {appliedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in font-mono">
          <div className="flex items-center space-x-2">
            <IconCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{appliedNotice}</span>
          </div>
          <button
            onClick={() => onNavigateTab('timeline')}
            className="text-xs underline hover:text-emerald-950 ml-4 font-bold"
          >
            View in Timeline →
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedCategory === cat
                ? 'bg-ink-900 text-white font-semibold'
                : 'bg-white border border-paper-300 text-ink-700 hover:bg-paper-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-paper-300">
            <p className="text-sm text-ink-400">
              No recommendations found in this category.
            </p>
          </div>
        ) : (
          filtered.map((rec) => {
            const isSavings = rec.category.includes('Cost') || rec.budgetImpact === 'High Savings';

            return (
              <div
                key={rec.id}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-paper-300 shadow-card hover:border-ink-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                        isSavings
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-paper-100 text-ink-800 border border-paper-300'
                      }`}
                    >
                      {rec.category}
                    </span>

                    {rec.budgetImpact && (
                      <span className="text-[10px] font-mono text-ink-400">
                        {rec.budgetImpact}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-ink-900 leading-snug">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-ink-600 leading-relaxed font-normal">
                    {rec.description}
                  </p>

                  {/* Tags */}
                  {rec.tags && rec.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rec.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono bg-paper-100 text-ink-500 px-1.5 py-0.5 rounded border border-paper-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-paper-200">
                  <button
                    onClick={() => handleApplyAsTask(rec)}
                    className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-paper-100 hover:bg-gold-50 hover:text-gold-800 text-ink-800 text-xs font-medium border border-paper-300 transition-colors"
                  >
                    <IconPlus className="w-3 h-3 text-gold-600" />
                    <span>Apply to Timeline Milestones</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
