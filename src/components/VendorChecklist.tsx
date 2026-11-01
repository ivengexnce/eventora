'use client';

import React, { useState } from 'react';
import { EventItem, VendorCategory, VendorItem, VendorStatus } from '@/types';
import {
  Users2,
  Plus,
  Phone,
  Mail,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  HelpCircle,
  FileText,
  IndianRupee,
  Clock,
  ChevronDown,
} from 'lucide-react';
import {
  addVendorToEvent,
  updateVendorInEvent,
  deleteVendorFromEvent,
} from '@/lib/storage';

interface VendorChecklistProps {
  activeEvent: EventItem | null;
  onOpenCreateModal: () => void;
}

export const VendorChecklist: React.FC<VendorChecklistProps> = ({
  activeEvent,
  onOpenCreateModal,
}) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorItem | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('Venue');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number | ''>(20000);
  const [actualCost, setActualCost] = useState<number | ''>(20000);
  const [bookingStatus, setBookingStatus] = useState<VendorStatus>('Contacted');
  const [notes, setNotes] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  if (!activeEvent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Users2 className="w-12 h-12 text-terracotta-600 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">
          No celebration selected
        </h2>
        <p className="text-sm text-charcoal-600 max-w-md mx-auto">
          Please select an active event or create a new celebration to manage vendors and checklists.
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

  const vendors = activeEvent.vendors || [];

  const handleOpenAddModal = () => {
    setEditingVendor(null);
    setName('');
    setCategory('Venue');
    setPhone('');
    setEmail('');
    setContactPerson('');
    setEstimatedCost(20000);
    setActualCost(20000);
    setBookingStatus('Not contacted');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vendor: VendorItem) => {
    setEditingVendor(vendor);
    setName(vendor.name);
    setCategory(vendor.category as VendorCategory);
    setPhone(vendor.contact?.phone || '');
    setEmail(vendor.contact?.email || '');
    setContactPerson(vendor.contact?.contactPerson || '');
    setEstimatedCost(vendor.estimatedCost);
    setActualCost(vendor.actualCost ?? vendor.estimatedCost);
    setBookingStatus(vendor.bookingStatus);
    setNotes(vendor.notes);
    setIsModalOpen(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingVendor) {
      updateVendorInEvent(activeEvent.id, {
        ...editingVendor,
        name: name.trim(),
        category,
        contact: {
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          contactPerson: contactPerson.trim() || undefined,
        },
        estimatedCost: Number(estimatedCost) || 0,
        actualCost: Number(actualCost) || 0,
        bookingStatus,
        notes: notes.trim(),
      });
    } else {
      addVendorToEvent(activeEvent.id, {
        name: name.trim(),
        category,
        contact: {
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          contactPerson: contactPerson.trim() || undefined,
        },
        estimatedCost: Number(estimatedCost) || 0,
        actualCost: Number(actualCost) || 0,
        bookingStatus,
        notes: notes.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const handleQuickStatusChange = (vendor: VendorItem, newStatus: VendorStatus) => {
    updateVendorInEvent(activeEvent.id, {
      ...vendor,
      bookingStatus: newStatus,
    });
  };

  const handleDeleteVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to remove this vendor record?')) {
      deleteVendorFromEvent(activeEvent.id, vendorId);
    }
  };

  const vendorCategories: VendorCategory[] = [
    'Venue',
    'Catering',
    'Photography',
    'Decoration',
    'Makeup and styling',
    'Entertainment',
    'Transportation',
  ];

  const bookingStatuses: VendorStatus[] = [
    'Not contacted',
    'Contacted',
    'Negotiating',
    'Confirmed',
    'Cancelled',
  ];

  const filteredVendors = vendors.filter((v) => {
    const matchStatus = statusFilter === 'All' ? true : v.bookingStatus === statusFilter;
    const matchCat = categoryFilter === 'All' ? true : v.category === categoryFilter;
    return matchStatus && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
              Trusted Partner Coordination
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-charcoal-900 mt-1">
            The right people make the celebration.
          </h1>
          <p className="text-sm text-charcoal-600 mt-1">
            Active Event: <span className="font-semibold text-charcoal-900">{activeEvent.title}</span> ({activeEvent.location})
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-xs sm:text-sm shadow-subtle hover:shadow-card transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-ivory-200 shadow-subtle text-xs">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-charcoal-500 mr-1">Status:</span>
          {['All', ...bookingStatuses].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full transition-colors ${
                statusFilter === st
                  ? 'bg-terracotta-600 text-white font-semibold'
                  : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-charcoal-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-ivory-300 text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
          >
            <option value="All">All Categories</option>
            {vendorCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-ivory-200">
            <p className="text-sm text-charcoal-400">
              No vendors found matching these filters. Click &quot;Add Vendor&quot; above to create one.
            </p>
          </div>
        ) : (
          filteredVendors.map((vendor) => {
            const isConfirmed = vendor.bookingStatus === 'Confirmed';
            const isNegotiating = vendor.bookingStatus === 'Negotiating';
            const isCancelled = vendor.bookingStatus === 'Cancelled';

            return (
              <div
                key={vendor.id}
                className="p-6 rounded-3xl bg-white border border-ivory-200 shadow-card hover:border-terracotta-200 hover:shadow-floating transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-ivory-100 text-charcoal-800">
                      {vendor.category}
                    </span>

                    {/* Quick status dropdown selector */}
                    <select
                      value={vendor.bookingStatus}
                      onChange={(e) => handleQuickStatusChange(vendor, e.target.value as VendorStatus)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none ${
                        isConfirmed
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : isNegotiating
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : isCancelled
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-ivory-200 text-charcoal-700 border-ivory-300'
                      }`}
                    >
                      {bookingStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-charcoal-900 leading-snug">
                      {vendor.name}
                    </h3>
                    {vendor.contact?.contactPerson && (
                      <p className="text-xs text-charcoal-500 font-medium">
                        Lead: {vendor.contact.contactPerson}
                      </p>
                    )}
                  </div>

                  {/* Financial estimate */}
                  <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-charcoal-400 block">Estimated Cost</span>
                      <span className="font-serif text-base font-bold text-charcoal-900">
                        ₹{vendor.estimatedCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {vendor.actualCost && vendor.actualCost !== vendor.estimatedCost && (
                      <div className="text-right">
                        <span className="text-[10px] text-charcoal-400 block">Actual Quote</span>
                        <span className="font-serif text-sm font-bold text-terracotta-700">
                          ₹{vendor.actualCost.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 text-xs text-charcoal-600 pt-1">
                    {vendor.contact?.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-terracotta-500 flex-shrink-0" />
                        <span>{vendor.contact.phone}</span>
                      </div>
                    )}
                    {vendor.contact?.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3.5 h-3.5 text-terracotta-500 flex-shrink-0" />
                        <span className="truncate">{vendor.contact.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes / Deliverables */}
                  {vendor.notes && (
                    <div className="pt-2 border-t border-ivory-100 text-[11px] text-charcoal-600 leading-relaxed italic">
                      &ldquo;{vendor.notes}&rdquo;
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-ivory-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(vendor)}
                    className="p-1.5 rounded-lg text-charcoal-500 hover:text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                    title="Edit Vendor"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteVendor(vendor.id)}
                    className="p-1.5 rounded-lg text-charcoal-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Vendor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-floating border border-ivory-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                {editingVendor ? 'Edit Vendor Details' : 'Add New Vendor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Heritage Caterers or Artisan Beats"
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VendorCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                  >
                    {vendorCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Booking Status *
                  </label>
                  <select
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value as VendorStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                  >
                    {bookingStatuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Estimated Cost (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Actual / Quoted Cost (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Master Chef or Manager"
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@vendor.in"
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Notes & Contract Checklist
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Power backup included, sound curfew at 10 PM, 50% advance paid."
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-ivory-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-charcoal-600 hover:bg-ivory-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-xs shadow-subtle"
                >
                  {editingVendor ? 'Save Changes' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

