'use client';

import React from 'react';

export const PlanGenerationSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Concept Header Skeleton */}
      <div className="p-8 rounded-sm bg-card border border-paper-300 space-y-4">
        <div className="h-3 w-32 bg-paper-300 rounded-sm skeleton-shimmer" />
        <div className="h-8 w-3/4 bg-paper-300 rounded-sm skeleton-shimmer" />
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full bg-paper-200 rounded-sm skeleton-shimmer" />
          <div className="h-4 w-5/6 bg-paper-200 rounded-sm skeleton-shimmer" />
          <div className="h-4 w-2/3 bg-paper-200 rounded-sm skeleton-shimmer" />
        </div>
      </div>

      {/* 4 Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-sm bg-card border border-paper-300 space-y-3">
            <div className="h-3 w-20 bg-paper-300 rounded-sm skeleton-shimmer" />
            <div className="h-6 w-28 bg-paper-300 rounded-sm skeleton-shimmer" />
            <div className="h-3 w-16 bg-paper-200 rounded-sm skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* Split Chart + Details Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-sm bg-card border border-paper-300 flex flex-col items-center justify-center space-y-4">
          <div className="h-3 w-28 bg-paper-300 rounded-sm skeleton-shimmer" />
          <div className="w-40 h-40 rounded-full border-8 border-paper-200 skeleton-shimmer" />
        </div>
        <div className="lg:col-span-2 p-6 rounded-sm bg-card border border-paper-300 space-y-4">
          <div className="h-4 w-36 bg-paper-300 rounded-sm skeleton-shimmer" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-sm bg-paper-50 border border-paper-200 space-y-2">
                <div className="h-3 w-16 bg-paper-300 rounded-sm skeleton-shimmer" />
                <div className="h-5 w-24 bg-paper-300 rounded-sm skeleton-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 rounded-sm bg-card border border-paper-300 space-y-2 animate-pulse">
          <div className="h-3 w-20 bg-paper-300 rounded-sm skeleton-shimmer" />
          <div className="h-8 w-28 bg-paper-300 rounded-sm skeleton-shimmer" />
          <div className="h-3 w-24 bg-paper-200 rounded-sm skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-sm bg-card border border-paper-300 space-y-4 animate-pulse">
      <div className="h-4 w-40 bg-paper-300 rounded-sm skeleton-shimmer" />
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-paper-200">
            <div className="h-4 w-32 bg-paper-200 rounded-sm skeleton-shimmer" />
            <div className="h-4 w-20 bg-paper-200 rounded-sm skeleton-shimmer" />
            <div className="h-4 w-16 bg-paper-200 rounded-sm skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
};

