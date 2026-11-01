'use client';

import React, { useState, useEffect } from 'react';
import { EventItem } from '@/types';
import {
  getStoredEvents,
  getActiveEventId,
  setActiveEventId,
  toggleTaskStatus,
} from '@/lib/storage';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/components/LandingPage';
import { DashboardView } from '@/components/DashboardView';
import { AIPlanningStudio } from '@/components/AIPlanningStudio';
import { BudgetManager } from '@/components/BudgetManager';
import { SmartTimeline } from '@/components/SmartTimeline';
import { VendorChecklist } from '@/components/VendorChecklist';
import { AIRecommendations } from '@/components/AIRecommendations';
import { CreateEventModal } from '@/components/CreateEventModal';
import { LegalModal } from '@/components/LegalModal';

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeEventId, setActiveId] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [legalModalState, setLegalModalState] = useState<{ isOpen: boolean; tab: 'tos' | 'privacy' }>({
    isOpen: false,
    tab: 'tos',
  });
  const [mounted, setMounted] = useState<boolean>(false);

  // Hydration sync
  useEffect(() => {
    const loadedEvents = getStoredEvents();
    const activeId = getActiveEventId();
    setEvents(loadedEvents);
    setActiveId(activeId);
    setMounted(true);

    const handleEventsUpdated = (e: any) => {
      setEvents(e.detail || getStoredEvents());
    };

    const handleActiveChanged = (e: any) => {
      setActiveId(e.detail || getActiveEventId());
    };

    window.addEventListener('eventora-events-updated', handleEventsUpdated);
    window.addEventListener('eventora-active-event-changed', handleActiveChanged);

    return () => {
      window.removeEventListener('eventora-events-updated', handleEventsUpdated);
      window.removeEventListener('eventora-active-event-changed', handleActiveChanged);
    };
  }, []);

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0] || null;

  const handleSelectEvent = (id: string) => {
    setActiveId(id);
    setActiveEventId(id);
  };

  const handleEventCreated = (newEvent: EventItem) => {
    setEvents(getStoredEvents());
    setActiveId(newEvent.id);
    setActiveEventId(newEvent.id);
    setCurrentTab('studio'); // Navigate straight to AI Studio as required
  };

  const handleToggleTask = (eventId: string, taskId: string) => {
    toggleTaskStatus(eventId, taskId);
    setEvents(getStoredEvents());
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-ink-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg font-bold text-ink-900">
            EVENTORA
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper-100 text-ink-900 selection:bg-gold-100 selection:text-ink-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        events={events}
        activeEvent={activeEvent}
        onSelectEvent={handleSelectEvent}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onStartPlanning={() => setIsCreateModalOpen(true)}
            onExploreDashboard={() => setCurrentTab('dashboard')}
            onSelectEvent={handleSelectEvent}
            events={events}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            events={events}
            activeEvent={activeEvent}
            onSelectEvent={handleSelectEvent}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onNavigateTab={setCurrentTab}
            onToggleTask={handleToggleTask}
          />
        )}

        {currentTab === 'studio' && (
          <AIPlanningStudio
            activeEvent={activeEvent}
            onNavigateTab={setCurrentTab}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentTab === 'budget' && (
          <BudgetManager
            activeEvent={activeEvent}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'timeline' && (
          <SmartTimeline
            activeEvent={activeEvent}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentTab === 'vendors' && (
          <VendorChecklist
            activeEvent={activeEvent}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentTab === 'recommendations' && (
          <AIRecommendations
            activeEvent={activeEvent}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onNavigateTab={setCurrentTab}
          />
        )}
      </main>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEventCreated={handleEventCreated}
      />

      {/* Legal Modal (Terms of Service & Privacy Policy) */}
      <LegalModal
        isOpen={legalModalState.isOpen}
        onClose={() => setLegalModalState((prev) => ({ ...prev, isOpen: false }))}
        initialTab={legalModalState.tab}
      />

      {/* Footer */}
      <Footer
        setCurrentTab={setCurrentTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenLegalModal={(tab) => setLegalModalState({ isOpen: true, tab })}
      />
    </div>
  );
}

