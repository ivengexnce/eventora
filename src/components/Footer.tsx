'use client';

import React from 'react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  onOpenCreateModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, onOpenCreateModal }) => {
  return (
    <footer className="bg-ink-950 text-paper-100 border-t border-ink-800 no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-ink-900 border border-ink-700 text-gold-400 flex items-center justify-center font-serif text-sm font-bold">
                E
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                EVENTORA
              </span>
            </div>
            <p className="font-serif italic text-lg text-gold-300">
              &ldquo;Plan thoughtfully. Celebrate wholeheartedly.&rdquo;
            </p>
            <p className="text-xs text-ink-400 max-w-sm leading-relaxed font-normal">
              GenAI-powered celebration and event planning companion. One intelligent workspace for weddings, birthdays, and community gatherings.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-gold-400 mb-4">
              Workspace
            </h4>
            <ul className="space-y-2 text-xs text-ink-300">
              <li>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Celebration Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('studio')}
                  className="hover:text-white transition-colors"
                >
                  AI Planning Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('budget')}
                  className="hover:text-white transition-colors"
                >
                  Smart Budget Manager
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('timeline')}
                  className="hover:text-white transition-colors"
                >
                  Countdown & Milestones
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('vendors')}
                  className="hover:text-white transition-colors"
                >
                  Vendor Management
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCreateModal}
                  className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
                >
                  + Plan New Event
                </button>
              </li>
            </ul>
          </div>

          {/* Product & Legal Links */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-gold-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-ink-300">
              <li>
                <button
                  onClick={() => setCurrentTab('landing')}
                  className="hover:text-white transition-colors"
                >
                  About Eventora
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('landing')}
                  className="hover:text-white transition-colors"
                >
                  Core Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('recommendations')}
                  className="hover:text-white transition-colors"
                >
                  Curated Inspiration
                </button>
              </li>
              <li>
                <span className="text-ink-500 cursor-default">Privacy</span>
              </li>
              <li>
                <span className="text-ink-500 cursor-default">Contact</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-ink-900 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-500 font-mono gap-4">
          <p>© {new Date().getFullYear()} Eventora. All rights reserved.</p>
          <p>PromptWars Virtual · Challenge 05: Celebration & Event Planner</p>
        </div>
      </div>
    </footer>
  );
};
