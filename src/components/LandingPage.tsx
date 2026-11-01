'use client';

import React from 'react';
import { EventItem } from '@/types';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Wallet,
  Clock,
  Users2,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  Lightbulb,
  Music,
  MapPin,
} from 'lucide-react';

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
  const sampleEvent = events.find((e) => e.id === 'evt-mumbai-birthday') || events[0];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Subtle decorative background aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-terracotta-100/40 via-champagne-100/30 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-terracotta-50 border border-terracotta-200 shadow-subtle">
            <Sparkles className="w-4 h-4 text-terracotta-600 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-terracotta-800">
              INTRODUCING YOUR AI CELEBRATION COMPANION
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-charcoal-900 leading-[1.1]">
            Big celebrations. <br className="hidden sm:inline" />
            <span className="italic font-normal text-terracotta-600">Zero planning chaos.</span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-charcoal-600 leading-relaxed font-normal">
            From your first idea to the final celebration, let AI organize the details while you enjoy the moments that matter.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-ivory-200 text-xs font-medium text-charcoal-700 shadow-subtle">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
              <span>AI Event Planner</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-ivory-200 text-xs font-medium text-charcoal-700 shadow-subtle">
              <Wallet className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Smart Budget</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-ivory-200 text-xs font-medium text-charcoal-700 shadow-subtle">
              <Clock className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Smart Timeline</span>
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartPlanning}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-base shadow-card hover:shadow-floating transition-all active:scale-[0.98] group"
            >
              <span>Start Planning Your Event</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-full bg-white hover:bg-ivory-100 text-charcoal-800 font-medium text-base border border-ivory-300 shadow-subtle transition-all"
            >
              <span>Explore Active Workspace</span>
            </button>
          </div>

          {/* Social Proof Categories */}
          <div className="pt-4 text-xs font-medium tracking-wide uppercase text-charcoal-400">
            <span>Weddings · Birthdays · Community Events</span>
          </div>
        </div>

        {/* Hero Interactive Preview Showcase Card */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="relative rounded-2xl bg-white border border-ivory-200 shadow-floating overflow-hidden">
            {/* Header pill */}
            <div className="bg-ivory-100/70 px-6 py-4 border-b border-ivory-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 rounded-full bg-terracotta-100 text-terracotta-800 text-xs font-semibold uppercase tracking-wider">
                  AI Generated
                </span>
                <span className="text-xs text-charcoal-500 font-medium">
                  Birthday Celebration
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-charcoal-600">
                <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Mumbai</span>
                <span>·</span>
                <Users2 className="w-3.5 h-3.5 text-terracotta-500" />
                <span>40 guests</span>
                <span>·</span>
                <span className="font-semibold text-charcoal-900">₹25,000 budget</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                    Garden Glow Birthday
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
                    Warm fairy lights, acoustic melodies, and artisanal grazing platters.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectEvent('evt-mumbai-birthday');
                    onExploreDashboard();
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 text-xs font-semibold border border-terracotta-200 transition-colors self-start sm:self-auto"
                >
                  <span>Open in Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Suggested Budget Allocation Grid (matches exact PRD illustrative sample!) */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-3">
                  Suggested Budget Allocation
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200">
                    <p className="text-xs font-medium text-charcoal-500">Catering</p>
                    <p className="font-serif text-lg font-bold text-charcoal-900 mt-1">₹10,000</p>
                    <p className="text-[10px] text-terracotta-600 font-medium">40% of total</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200">
                    <p className="text-xs font-medium text-charcoal-500">Decoration</p>
                    <p className="font-serif text-lg font-bold text-charcoal-900 mt-1">₹5,000</p>
                    <p className="text-[10px] text-terracotta-600 font-medium">20% of total</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200">
                    <p className="text-xs font-medium text-charcoal-500">Entertainment</p>
                    <p className="font-serif text-lg font-bold text-charcoal-900 mt-1">₹4,000</p>
                    <p className="text-[10px] text-terracotta-600 font-medium">16% of total</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200">
                    <p className="text-xs font-medium text-charcoal-500">Venue</p>
                    <p className="font-serif text-lg font-bold text-charcoal-900 mt-1">₹4,000</p>
                    <p className="text-[10px] text-terracotta-600 font-medium">16% of total</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-ivory-50 border border-ivory-200">
                    <p className="text-xs font-medium text-charcoal-500">Miscellaneous</p>
                    <p className="font-serif text-lg font-bold text-charcoal-900 mt-1">₹2,000</p>
                    <p className="text-[10px] text-terracotta-600 font-medium">8% of total</p>
                  </div>
                </div>
              </div>

              {/* AI Suggestions Checklist (matches PRD section 4 example) */}
              <div className="pt-2 border-t border-ivory-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-3 flex items-center space-x-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-champagne-500" />
                  <span>AI Suggestions</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal-700">
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-ivory-50/70 border border-ivory-200/60">
                    <CheckCircle2 className="w-4 h-4 text-terracotta-600 flex-shrink-0" />
                    <span>Warm fairy-light decoration and botanical greenery</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-ivory-50/70 border border-ivory-200/60">
                    <CheckCircle2 className="w-4 h-4 text-terracotta-600 flex-shrink-0" />
                    <span>Garden-themed photo corner with instant polaroids</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-ivory-50/70 border border-ivory-200/60">
                    <CheckCircle2 className="w-4 h-4 text-terracotta-600 flex-shrink-0" />
                    <span>Personalized pistachio rose-milk birthday cake</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-ivory-50/70 border border-ivory-200/60">
                    <CheckCircle2 className="w-4 h-4 text-terracotta-600 flex-shrink-0" />
                    <span>Acoustic music set and interactive trivia icebreaker</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-600">
            Engineered for Precision & Joy
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            One intelligent workspace for every celebration detail
          </h2>
          <p className="text-sm sm:text-base text-charcoal-600">
            No fragmented spreadsheets or lost notes. Eventora unites creative vision with mathematical control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: AI Studio */}
          <div className="p-8 rounded-2xl bg-white border border-ivory-200 shadow-card hover:shadow-floating transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta-50 flex items-center justify-center text-terracotta-600 border border-terracotta-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Your AI Planning Studio
            </h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Your personal event strategist. Turn a simple brief into concepts, decor ideas, curated menus, and customized guest entertainment in seconds.
            </p>
            <ul className="text-xs text-charcoal-700 space-y-2 pt-2 border-t border-ivory-100">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Contextual to your city and cultural heritage</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Editable sections that adapt as plans evolve</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Smart Budget */}
          <div className="p-8 rounded-2xl bg-white border border-ivory-200 shadow-card hover:shadow-floating transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-champagne-50 flex items-center justify-center text-champagne-600 border border-champagne-100">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Every Rupee, Thoughtfully Planned
            </h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Real application logic ensures zero budget slip. Track planned vs. actual costs, manage deposits, and receive proactive AI cost-saving alternatives.
            </p>
            <ul className="text-xs text-charcoal-700 space-y-2 pt-2 border-t border-ivory-100">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne-600" />
                <span>Dynamic mathematical calculations in INR (₹)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne-600" />
                <span>Over-budget warning detection & mitigations</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Smart Timeline */}
          <div className="p-8 rounded-2xl bg-white border border-ivory-200 shadow-card hover:shadow-floating transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              The Countdown to Your Celebration
            </h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Converts event milestones into actionable schedules. Track due dates, priority tiers, and completion status with a live celebration countdown timer.
            </p>
            <ul className="text-xs text-charcoal-700 space-y-2 pt-2 border-t border-ivory-100">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Automated sequencing relative to celebration date</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Interactive checklist with instant dashboard updates</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-ivory-100/60 py-16 border-y border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-600">
              How It Works
            </span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-900">
              Three steps from dream to execution
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-subtle space-y-3">
              <span className="font-serif text-3xl font-bold text-terracotta-600">01</span>
              <h4 className="font-serif text-lg font-bold text-charcoal-900">Share your vision</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Provide event type, target date, city, guest count, total budget in INR, and aesthetic preferences.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-subtle space-y-3">
              <span className="font-serif text-3xl font-bold text-terracotta-600">02</span>
              <h4 className="font-serif text-lg font-bold text-charcoal-900">AI crafts the blueprint</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Google Gemini synthesizes a tailored proposal: theme color swatches, budget allocations, decor plans, and vendor checklists.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-subtle space-y-3">
              <span className="font-serif text-3xl font-bold text-terracotta-600">03</span>
              <h4 className="font-serif text-lg font-bold text-charcoal-900">Manage with ease</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Log actual expenses, complete timeline milestones, track vendor negotiations, and enjoy the celebration day stress-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Plan CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-charcoal-900 to-charcoal-950 text-white p-8 sm:p-14 text-center space-y-6 shadow-floating relative overflow-hidden">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-champagne-400">
              Start Your Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Let&apos;s make something worth celebrating.
            </h2>
            <p className="text-sm sm:text-base text-charcoal-300">
              Join families and organizers crafting flawless weddings, milestone birthdays, and community festivals with Eventora.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onStartPlanning}
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-base shadow-card transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5" />
              <span>Create Your Event Plan Now</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

