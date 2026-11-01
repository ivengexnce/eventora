'use client';

import React, { useState } from 'react';
import { EventItem } from '@/types';
import { Sparkles, Plus, Calendar, Menu, X, ChevronDown, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  events: EventItem[];
  activeEvent: EventItem | null;
  onSelectEvent: (eventId: string) => void;
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  events,
  activeEvent,
  onSelectEvent,
  onOpenCreateModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'studio', label: 'AI Studio' },
    { id: 'budget', label: 'Budget' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'recommendations', label: 'Inspiration' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory-50/90 backdrop-blur-md border-b border-ivory-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentTab('landing')}
              className="flex items-center space-x-2 text-left group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-terracotta-600 to-champagne-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                  EVENTORA
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200">
                  GenAI Planner
                </span>
              </div>
            </button>

            {/* Active Event Switcher (Desktop) */}
            {activeEvent && (
              <div className="hidden lg:relative lg:block">
                <button
                  type="button"
                  onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-ivory-200 hover:border-terracotta-300 text-xs font-medium text-charcoal-700 shadow-subtle transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="truncate max-w-[150px] font-semibold text-charcoal-900">
                    {activeEvent.title}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
                </button>

                {eventDropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-64 rounded-xl bg-white shadow-floating border border-ivory-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setEventDropdownOpen(false)}
                  >
                    <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-charcoal-400">
                      Switch Active Celebration
                    </div>
                    {events.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => {
                          onSelectEvent(evt.id);
                          setEventDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-ivory-50 transition-colors ${
                          activeEvent.id === evt.id ? 'bg-terracotta-50 text-terracotta-700 font-semibold' : 'text-charcoal-700'
                        }`}
                      >
                        <div className="truncate">
                          <p className="truncate">{evt.title}</p>
                          <p className="text-[10px] text-charcoal-400">
                            {evt.eventType} · {evt.location}
                          </p>
                        </div>
                        {activeEvent.id === evt.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-600 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-ivory-100 mt-1 pt-1 px-2">
                      <button
                        onClick={() => {
                          setEventDropdownOpen(false);
                          onOpenCreateModal();
                        }}
                        className="w-full flex items-center space-x-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Plan New Celebration</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  currentTab === item.id
                    ? 'text-terracotta-600 bg-terracotta-50/80 font-semibold'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-ivory-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs sm:text-sm font-medium shadow-subtle hover:shadow-card transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenCreateModal}
              className="p-2 rounded-full bg-terracotta-600 text-white"
              title="Create Event"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-700 hover:bg-ivory-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-ivory-200 animate-in slide-in-from-top-4 duration-200">
            {activeEvent && (
              <div className="mb-3 px-3 py-2 bg-white rounded-xl border border-ivory-200">
                <p className="text-[10px] uppercase font-semibold text-charcoal-400">Current Celebration</p>
                <p className="text-sm font-bold text-charcoal-900 truncate">{activeEvent.title}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-ivory-100 text-xs text-charcoal-500">
                  <span>{activeEvent.eventType}</span>
                  <span>₹{Number(activeEvent.totalBudget).toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                    currentTab === item.id
                      ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                      : 'text-charcoal-700 hover:bg-ivory-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-ivory-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCreateModal();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-terracotta-600 text-white font-medium text-sm shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Plan New Event</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

