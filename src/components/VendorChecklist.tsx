'use client';

import React, { useState } from 'react';
import { EventItem, VendorCategory, VendorItem, VendorStatus } from '@/types';
import {
  IconPlus,
  IconPhone,
  IconMail,
  IconEdit,
  IconTrash,
  IconClose,
  IconMessage,
  IconCheck,
  IconWhatsApp,
} from './Icons';
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

  // AI Script Modal state
  const [scriptModalVendor, setScriptModalVendor] = useState<VendorItem | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  if (!activeEvent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink-900">
          No celebration selected
        </h2>
        <p className="text-sm text-ink-600 max-w-md mx-auto">
          Please select an active event or create a new celebration to manage vendors and checklists.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="px-6 py-2.5 rounded-sm bg-ink-900 text-white font-medium text-xs sm:text-sm hover:bg-ink-950 transition-colors"
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

  const generateVendorScript = (v: VendorItem) => {
    return `Namaste ${v.contact?.contactPerson || v.name},\n\nWe are organizing a ${activeEvent.eventType} celebration ("${activeEvent.title}") in ${activeEvent.location} on ${activeEvent.eventDate} for approximately ${activeEvent.guestCount} guests.\n\nWe would love to inquire about your availability and discuss catering to our ${activeEvent.theme.toLowerCase()} theme. Our estimated allocation for ${v.category.toLowerCase()} is around ₹${v.estimatedCost.toLocaleString('en-IN')}.\n\nCould you please share your standard package inclusions, staff details, and booking terms?\n\nWarm regards,\nEventora Celebration Host`;
  };

  const handleWhatsApp = (vendor: VendorItem) => {
    const scriptText = generateVendorScript(vendor);
    const cleanPhone = vendor.contact?.phone ? vendor.contact.phone.replace(/[^0-9]/g, '') : '';
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(scriptText)}`
      : `https://wa.me/?text=${encodeURIComponent(scriptText)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-300 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
            Partner Roster & Verification
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink-900 mt-1">
            The right people make the celebration.
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 font-mono mt-1">
            {activeEvent.title} · {activeEvent.location}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-950 text-white font-medium text-xs sm:text-sm transition-colors active:scale-[0.99]"
        >
          <IconPlus className="w-3.5 h-3.5 text-gold-400" />
          <span>Add Vendor Partner</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-sm border border-paper-300 text-xs font-mono">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-ink-400 mr-1 uppercase text-[10px]">Status:</span>
          {['All', ...bookingStatuses].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-sm transition-colors ${
                statusFilter === st
                  ? 'bg-ink-900 text-white font-semibold'
                  : 'bg-paper-100 text-ink-700 hover:bg-paper-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-ink-400 uppercase text-[10px]">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-sm border border-paper-300 text-ink-800 bg-paper-50 focus:outline-none focus:border-ink-900"
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
          <div className="col-span-full p-12 text-center bg-card rounded-sm border border-paper-300">
            <p className="text-sm text-ink-400 font-mono">
              No vendors found matching these filters. Click &quot;Add Vendor Partner&quot; above to create one.
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
                className="p-6 rounded-sm bg-card border border-paper-300 hover:border-ink-500 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase bg-paper-100 border border-paper-300 text-ink-800">
                      {vendor.category}
                    </span>

                    {/* Quick status dropdown selector */}
                    <select
                      value={vendor.bookingStatus}
                      onChange={(e) => handleQuickStatusChange(vendor, e.target.value as VendorStatus)}
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border cursor-pointer focus:outline-none ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : isNegotiating
                          ? 'bg-gold-50 text-gold-800 border-gold-300'
                          : isCancelled
                          ? 'bg-ruby-50 text-ruby-800 border-ruby-300'
                          : 'bg-paper-100 text-ink-700 border-paper-300'
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
                    <h3 className="font-serif text-lg font-bold text-ink-900 leading-snug">
                      {vendor.name}
                    </h3>
                    {vendor.contact?.contactPerson && (
                      <p className="text-xs text-ink-500 font-medium font-sans">
                        Contact: {vendor.contact.contactPerson}
                      </p>
                    )}
                  </div>

                  {/* Financial estimate */}
                  <div className="p-3 rounded-sm bg-paper-100 border border-paper-300 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-ink-400 block">Target Budget</span>
                      <span className="font-serif text-base font-bold text-ink-900">
                        ₹{vendor.estimatedCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {vendor.actualCost && vendor.actualCost !== vendor.estimatedCost && (
                      <div className="text-right">
                        <span className="text-[10px] text-ink-400 block">Actual Quote</span>
                        <span className="font-serif text-sm font-bold text-gold-700">
                          ₹{vendor.actualCost.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 text-xs text-ink-600 font-mono">
                    {vendor.contact?.phone && (
                      <div className="flex items-center space-x-2">
                        <IconPhone className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                        <span>{vendor.contact.phone}</span>
                      </div>
                    )}
                    {vendor.contact?.email && (
                      <div className="flex items-center space-x-2">
                        <IconMail className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                        <span className="truncate">{vendor.contact.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes / Deliverables */}
                  {vendor.notes && (
                    <div className="pt-2 border-t border-paper-200 text-[11px] text-ink-600 leading-relaxed font-sans">
                      &ldquo;{vendor.notes}&rdquo;
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-paper-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-1.5">
                    {/* Direct WhatsApp button */}
                    <button
                      onClick={() => handleWhatsApp(vendor)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-mono font-semibold transition-colors"
                      title="Open WhatsApp with Pre-filled RFQ Inquiry"
                    >
                      <IconWhatsApp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    {/* AI Script Trigger Button */}
                    <button
                      onClick={() => setScriptModalVendor(vendor)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-sm bg-paper-100 hover:bg-gold-50 hover:text-gold-700 text-ink-700 border border-paper-200 text-[11px] font-mono transition-colors"
                      title="View AI Negotiation Script"
                    >
                      <IconMessage className="w-3 h-3 text-gold-600" />
                      <span>Script</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(vendor)}
                      className="p-1.5 rounded-sm text-ink-400 hover:text-ink-900 hover:bg-paper-200 transition-colors"
                      title="Edit Vendor"
                    >
                      <IconEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="p-1.5 rounded-sm text-ink-400 hover:text-ruby-600 hover:bg-ruby-50 transition-colors"
                      title="Delete Vendor"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* AI Outreach Script Modal */}
      {scriptModalVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-card border border-paper-300 rounded-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-paper-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600">
                  AI Negotiation Assistant
                </span>
                <h3 className="font-serif text-xl font-bold text-ink-900 mt-0.5">
                  Outreach Script for {scriptModalVendor.name}
                </h3>
              </div>
              <button
                onClick={() => setScriptModalVendor(null)}
                className="p-1 rounded-sm text-ink-400 hover:text-ink-700"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-sm bg-paper-100 border border-paper-300 text-xs sm:text-sm text-ink-800 font-mono whitespace-pre-wrap leading-relaxed">
              {generateVendorScript(scriptModalVendor)}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] font-mono text-ink-500">
                {copiedNotice ? 'Copied to clipboard' : 'Personalized to event budget and guest count.'}
              </span>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => handleWhatsApp(scriptModalVendor)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                >
                  <IconWhatsApp className="w-3.5 h-3.5 text-white" />
                  <span>Send on WhatsApp</span>
                </button>

                <button
                  onClick={() => handleCopyScript(generateVendorScript(scriptModalVendor))}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-sm bg-ink-900 hover:bg-ink-950 text-white font-medium text-xs transition-colors"
                >
                  <IconCheck className="w-3.5 h-3.5 text-gold-400" />
                  <span>Copy Text</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-card border border-paper-300 rounded-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-paper-200 pb-4">
              <h3 className="font-serif text-xl font-bold text-ink-900">
                {editingVendor ? 'Edit Vendor Record' : 'Add New Vendor Partner'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-sm text-ink-400 hover:text-ink-700"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Business / Vendor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mandap Floral Artistry"
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Service Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VendorCategory)}
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  >
                    {vendorCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Ramesh Bhai"
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Phone (WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 11223"
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@decor.in"
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Estimated Cost (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Quoted / Actual (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                    Booking Status
                  </label>
                  <select
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value as VendorStatus)}
                    className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900"
                  >
                    {bookingStatuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-1">
                  Deliverables & Contract Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Includes stage lighting, 4 mic channels, 2 sound engineers, and power generator"
                  className="w-full px-3 py-2 rounded-sm border border-paper-300 text-xs text-ink-900 bg-paper-50 focus:outline-none focus:border-ink-900 font-sans"
                />
              </div>

              <div className="pt-4 border-t border-paper-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-sm text-xs font-semibold text-ink-600 hover:bg-paper-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-sm bg-ink-900 hover:bg-ink-950 text-white font-semibold text-xs"
                >
                  {editingVendor ? 'Save Changes' : 'Record Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
