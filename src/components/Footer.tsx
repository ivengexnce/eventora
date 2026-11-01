'use client';

import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  onOpenCreateModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, onOpenCreateModal }) => {
  return (
    <footer className="bg-charcoal-950 text-ivory-100 border-t border-charcoal-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-terracotta-500 to-champagne-400 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                EVENTORA
              </span>
            </div>
            <p className="font-serif italic text-lg text-champagne-200">
              &ldquo;Plan thoughtfully. Celebrate wholeheartedly.&rdquo;
            </p>
            <p className="text-xs text-charcoal-400 max-w-sm leading-relaxed">
              GenAI-powered celebration and event planning companion. One intelligent workspace for weddings, birthdays, and community gatherings across India and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-champagne-400 mb-4">
              Workspace
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-300">
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
                  className="text-terracotta-400 hover:text-terracotta-300 font-medium transition-colors"
                >
                  + Plan New Event
                </button>
              </li>
            </ul>
          </div>

          {/* Product & Legal Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-champagne-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-300">
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
                <span className="text-charcoal-500 cursor-default">Privacy & Security</span>
              </li>
              <li>
                <span className="text-charcoal-500 cursor-default">Contact Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-400 gap-4">
          <p>© {new Date().getFullYear()} Eventora. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-terracotta-500 inline fill-terracotta-500" />
            <span>for authentic celebrations.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

