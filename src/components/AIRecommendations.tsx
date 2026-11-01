'use client';

import React, { useState } from 'react';
import { EventItem, RecommendationItem } from '@/types';
import {
  Sparkles,
  Lightbulb,
  Plus,
  CheckCircle2,
  Filter,
  TrendingDown,
  Palette,
  UtensilsCrossed,
  Music,
  MapPin,
} from 'lucide-react';
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
        <Sparkles className="w-12 h-12 text-terracotta-500 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">
          No celebration selected
        </h2>
        <p className="text-sm text-charcoal-600 max-w-md mx-auto">
          Please select an active event to explore personalized AI recommendations.
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

  // Combine recommendations from event and active plan
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

  // Remove duplicates based on title
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
              Context-Aware Intelligence
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900 mt-1">
            A little inspiration goes a long way.
          </h1>
          <p className="text-sm text-charcoal-600 mt-1">
            Personalized suggestions tailored for {activeEvent.title} ({activeEvent.guestCount} guests in {activeEvent.location})
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('studio')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white hover:bg-ivory-50 text-charcoal-800 font-semibold text-xs sm:text-sm border border-ivory-300 shadow-subtle transition-all"
        >
          <Sparkles className="w-4 h-4 text-terracotta-600" />
          <span>Full AI Blueprint</span>
        </button>
      </div>

      {/* Applied Notification */}
      {appliedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{appliedNotice}</span>
          </div>
          <button
            onClick={() => onNavigateTab('timeline')}
            className="text-xs underline hover:text-emerald-900 ml-4 font-bold"
          >
            View in Timeline →
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-terracotta-600 text-white font-semibold shadow-subtle'
                : 'bg-white border border-ivory-200 text-charcoal-700 hover:bg-ivory-100'
            }`}
          >
            {cat === 'Cost Saving' ? '💰 Cost Saving' : cat}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-ivory-200">
            <p className="text-sm text-charcoal-400">
              No recommendations found in this category.
            </p>
          </div>
        ) : (
          filtered.map((rec) => {
            const isSavings = rec.category.includes('Cost') || rec.budgetImpact === 'High Savings';

            return (
              <div
                key={rec.id}
                className={`p-6 sm:p-7 rounded-3xl bg-white border transition-all flex flex-col justify-between space-y-4 hover:shadow-floating ${
                  isSavings
                    ? 'border-emerald-300 shadow-card bg-gradient-to-b from-white to-emerald-50/20'
                    : 'border-ivory-200 shadow-card hover:border-terracotta-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isSavings
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-terracotta-50 text-terracotta-700'
                      }`}
                    >
                      {rec.category}
                    </span>

                    {rec.budgetImpact && (
                      <span className="text-[10px] font-medium text-charcoal-500">
                        {rec.budgetImpact}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-charcoal-900 leading-snug">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Tags */}
                  {rec.tags && rec.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {rec.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-ivory-100 text-charcoal-600 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-ivory-100">
                  <button
                    onClick={() => handleApplyAsTask(rec)}
                    className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-ivory-100 hover:bg-terracotta-50 hover:text-terracotta-700 text-charcoal-800 text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Apply to Timeline</span>
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
