'use client';

import React, { useState } from 'react';
import { EventItem } from '@/types';
import {
  IconPlus,
  IconClose,
  IconMenu,
  IconChevronDown,
  IconCheck,
  IconPrinter,
  IconSparkles,
} from './Icons';

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
    { id: 'landing', label: 'Overview' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'studio', label: 'AI Studio' },
    { id: 'budget', label: 'Budget' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'recommendations', label: 'Inspiration' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-paper-100/95 backdrop-blur-md border-b border-paper-300 no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Identity */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentTab('landing')}
              className="flex items-center space-x-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-ink-900 text-gold-400 flex items-center justify-center font-serif text-sm font-bold border border-ink-800 shadow-subtle group-hover:bg-ink-950 transition-colors">
                E
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-ink-900 group-hover:text-gold-600 transition-colors">
                  EVENTORA
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-wider text-ink-500 border-l border-paper-300 pl-2">
                  GenAI Planner
                </span>
              </div>
            </button>

            {/* Active Celebration Switcher (Desktop) */}
            {activeEvent && (
              <div className="hidden lg:relative lg:block">
                <button
                  type="button"
                  onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-paper-300 hover:border-ink-400 text-xs text-ink-700 shadow-subtle transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span className="truncate max-w-[150px] font-medium text-ink-900">
                    {activeEvent.title}
                  </span>
                  <IconChevronDown className="w-3 h-3 text-ink-400" />
                </button>

                {eventDropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-72 rounded-xl bg-white shadow-elevation border border-paper-300 py-2 z-50 animate-in fade-in duration-100"
                    onMouseLeave={() => setEventDropdownOpen(false)}
                  >
                    <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-ink-400">
                      Switch Active Celebration
                    </div>
                    {events.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => {
                          onSelectEvent(evt.id);
                          setEventDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-paper-100 transition-colors ${
                          activeEvent.id === evt.id ? 'bg-paper-100 text-ink-900 font-semibold' : 'text-ink-600'
                        }`}
                      >
                        <div className="truncate">
                          <p className="truncate text-ink-900">{evt.title}</p>
                          <p className="text-[10px] text-ink-400 font-mono">
                            {evt.eventType} · {evt.location}
                          </p>
                        </div>
                        {activeEvent.id === evt.id && (
                          <IconCheck className="w-3.5 h-3.5 text-gold-600 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-paper-200 mt-1 pt-1 px-2">
                      <button
                        onClick={() => {
                          setEventDropdownOpen(false);
                          onOpenCreateModal();
                        }}
                        className="w-full flex items-center space-x-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gold-600 hover:bg-gold-50 transition-colors"
                      >
                        <IconPlus className="w-3 h-3" />
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
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all ${
                  currentTab === item.id
                    ? 'text-ink-900 bg-white font-semibold shadow-subtle border border-paper-300'
                    : 'text-ink-500 hover:text-ink-900 hover:bg-paper-200/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={handlePrint}
              title="Print / Export Executive Dossier"
              className="p-2 rounded-lg bg-white border border-paper-300 hover:bg-paper-200 text-ink-600 hover:text-ink-900 transition-colors text-xs"
            >
              <IconPrinter className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-ink-900 hover:bg-ink-950 text-white text-xs sm:text-sm font-medium shadow-subtle transition-all active:scale-[0.98]"
            >
              <IconPlus className="w-3.5 h-3.5 text-gold-400" />
              <span>New Event</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenCreateModal}
              className="p-2 rounded-lg bg-ink-900 text-white"
              title="Create Event"
            >
              <IconPlus className="w-4 h-4 text-gold-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink-700 hover:bg-paper-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <IconClose className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-paper-300 animate-in slide-in-from-top-2 duration-150">
            {activeEvent && (
              <div className="mb-3 px-3 py-2 bg-white rounded-xl border border-paper-300">
                <p className="text-[10px] font-mono uppercase text-ink-400">Current Celebration</p>
                <p className="text-sm font-bold text-ink-900 truncate">{activeEvent.title}</p>
                <div className="flex items-center justify-between mt-1 text-xs text-ink-500 font-mono">
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
                  className={`px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    currentTab === item.id
                      ? 'text-ink-900 bg-white font-semibold border border-paper-300'
                      : 'text-ink-600 hover:bg-paper-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-paper-300">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCreateModal();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-ink-900 text-white font-medium text-sm"
              >
                <IconPlus className="w-4 h-4 text-gold-400" />
                <span>Create New Plan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
