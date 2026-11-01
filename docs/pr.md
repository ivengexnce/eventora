# EVENTORA — Product Requirements Document (PRD)

**Product:** Eventora  
**Tagline:** Every celebration deserves a perfect plan.  
**Challenge:** PromptWars Virtual — Main Challenge 05: Celebration & Event Planner  
**Version:** 1.0  
**Status:** MVP Development  
**Category:** Generative AI / Event Management / Productivity

---

# 1. Executive Summary

Eventora is a GenAI-powered celebration and event-planning platform designed to simplify the organization of weddings, birthdays, and community events.

It transforms a user's event requirements into an actionable planning workspace containing:

- Personalized event concepts and themes.
- Intelligent budget allocation.
- Automated planning timelines.
- Vendor management and checklists.
- Personalized recommendations.
- Expense tracking and progress monitoring.

Eventora combines Generative AI with practical event-management tools to help users plan celebrations with greater clarity, control, and confidence.

# 2. Problem Statement

Organizing an event requires coordinating multiple interconnected activities.

Individuals frequently struggle with:

1. Budget distribution and unexpected expenses.
2. Managing vendors and bookings.
3. Tracking preparation deadlines.
4. Coordinating event schedules.
5. Finding suitable themes and ideas.
6. Managing multiple planning activities across different applications.

Existing manual approaches rely heavily on spreadsheets, messaging applications, and disconnected task lists.

Eventora aims to solve this problem through a centralized AI-powered planning assistant.

# 3. Product Vision

**Make professional event planning accessible to everyone through intelligent, personalized AI assistance.**

Eventora should function as an intelligent planning companion rather than just another event-management dashboard.

# 4. Target Audience

| User Segment | Use Case |
|---|---|
| Couples and families | Wedding planning |
| Parents | Birthday celebrations |
| Community organizers | Festivals and gatherings |
| Individuals | Private celebrations |
| Small event organizers | Budget-conscious event management |

# 5. Core Product Modules

## 5.1 Landing Page

Purpose: Communicate the product's value and encourage users to start planning.

Content:

- Brand identity and navigation.
- Hero section.
- Product introduction.
- Feature highlights.
- How-it-works section.
- Event categories.
- Call-to-action.
- Footer.

Hero copy:

**Big celebrations. Zero planning chaos.**

From your first idea to the final celebration, let AI organize the details while you enjoy the moments that matter.

Primary CTA: Start Planning Your Event.

## 5.2 Event Creation

Purpose: Collect event information before generating an AI-powered plan.

Required inputs:

| Field | Type |
|---|---|
| Event Name | Text |
| Event Type | Wedding / Birthday / Community |
| Event Date | Date |
| Location | Text |
| Guest Count | Number |
| Total Budget | Currency |
| Preferred Theme | Selection / Custom |
| Preferences | Long text |

The application must validate inputs and provide clear feedback for missing or invalid information.

## 5.3 AI Event Planning Studio

Purpose: Generate a complete event plan using Google Gemini.

AI-generated outputs:

1. Event concept.
2. Theme recommendations.
3. Decoration suggestions.
4. Catering ideas.
5. Budget distribution.
6. Planning timeline.
7. Vendor checklist.
8. Entertainment recommendations.
9. Personalized ideas.

The AI should understand the event type, date, location, guest count, budget, and preferences.

### Example

Input:

- Event: Birthday.
- Location: Mumbai.
- Guests: 40.
- Budget: ₹25,000.
- Theme: Garden Party.

Expected output:

- Suggested event concept.
- Budget breakdown.
- Decoration ideas.
- Food recommendations.
- Planning milestones.
- Vendor requirements.
- Entertainment ideas.

### AI Requirements

- Use Gemini through a secure server-side API.
- Return structured JSON.
- Validate all generated data.
- Handle malformed responses.
- Display loading and error states.
- Allow users to regenerate individual sections.
- Preserve user edits.
- Never represent estimated prices as confirmed vendor quotations.

## 5.4 Smart Budget Manager

Purpose: Provide transparent financial planning.

Features:

- Total allocated budget.
- Planned expenses.
- Actual expenses.
- Remaining budget.
- Category-wise breakdown.
- Expense creation and editing.
- Expense deletion.
- Budget utilization charts.
- AI cost-saving suggestions.

Suggested categories:

| Category | Description |
|---|---|
| Venue | Hall, lawn, or location |
| Catering | Food and beverages |
| Decoration | Flowers, lighting, and stage |
| Photography | Photography and videography |
| Entertainment | Music and activities |
| Logistics | Transport and arrangements |
| Miscellaneous | Additional expenses |

### Budget Intelligence

AI should:

- Recommend budget allocation.
- Identify potential overspending.
- Suggest alternatives.
- Explain trade-offs.
- Recalculate proposed allocations when requirements change.

All financial calculations must be performed by application logic, not trusted blindly to AI.

## 5.5 Smart Timeline

Purpose: Convert event requirements into an actionable schedule.

Features:

- AI-generated milestones.
- Date-based planning.
- Task priorities.
- Due dates.
- Completion status.
- Upcoming deadlines.
- Editable tasks.

Example:

| Deadline | Task |
|---|---|
| 60 days before | Finalize venue |
| 45 days before | Confirm major vendors |
| 30 days before | Send invitations |
| 14 days before | Confirm guest count |
| 7 days before | Final coordination |
| 1 day before | Final preparations |
| Event day | Execute schedule |

Timeline generation must account for the actual event date and avoid creating deadlines in the past.

## 5.6 Vendor Management

Purpose: Organize vendor requirements and booking progress.

Vendor categories:

- Venues.
- Caterers.
- Photographers.
- Decorators.
- Florists.
- Entertainment providers.
- Transportation providers.

Each vendor record should support:

- Vendor name.
- Category.
- Contact information.
- Estimated price.
- Booking status.
- Notes.
- Requirements.

Booking statuses:

- Not contacted.
- Contacted.
- Negotiating.
- Confirmed.
- Cancelled.

AI can generate vendor selection criteria, comparison questions, and checklists.

It must not fabricate verified businesses, contact details, or confirmed availability.

## 5.7 Personalized AI Recommendations

Purpose: Make every event plan context-aware.

Recommendation categories:

- Event themes.
- Decoration ideas.
- Food and catering.
- Entertainment.
- Guest activities.
- Cost-saving ideas.
- Location-sensitive suggestions.

Recommendations must reflect the user's event requirements rather than producing generic suggestions.

# 6. Application Dashboard

The dashboard should provide a centralized overview.

### Dashboard Overview

Display:

- Active events.
- Total planned budget.
- Actual spending.
- Remaining budget.
- Completed tasks.
- Upcoming deadlines.

### Dashboard Sections

1. Welcome and quick actions.
2. Active events.
3. Upcoming celebrations.
4. Budget overview.
5. Planning progress.
6. Recent activity.
7. AI planning suggestions.

### Event Workspace Navigation

- Overview.
- AI Planning Studio.
- Budget.
- Timeline.
- Vendors.
- Recommendations.

# 7. User Journey

### Primary Workflow

1. User opens Eventora.
2. User selects Start Planning.
3. User creates an event.
4. User enters event details.
5. Application validates the information.
6. User requests AI generation.
7. Gemini generates a structured event plan.
8. Application validates and displays the plan.
9. User reviews and edits the generated content.
10. User manages expenses, tasks, and vendors.
11. Dashboard reflects updated planning progress.

The user must be able to continue managing the event without repeatedly regenerating the entire plan.

# 8. Technology Architecture

Recommended implementation:

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Backend | Next.js API Routes |
| Database | Supabase |
| AI Provider | Google Gemini |
| Charts | Recharts |
| Icons | Lucide |
| Deployment | Vercel |
| Repository | GitHub |

The implementation may adapt to an existing codebase where appropriate.

# 9. Database Design

Core entities:

### Users

- id
- name
- email
- created_at

### Events

- id
- user_id
- title
- event_type
- event_date
- location
- guest_count
- total_budget
- theme
- preferences
- created_at
- updated_at

### Budget Categories

- id
- event_id
- category
- planned_amount
- actual_amount

### Expenses

- id
- event_id
- category_id
- description
- amount
- expense_date

### Tasks

- id
- event_id
- title
- description
- due_date
- priority
- status

### Vendors

- id
- event_id
- name
- category
- contact
- estimated_cost
- booking_status
- notes

### AI Plans

- id
- event_id
- generated_content
- version
- created_at

Database access must enforce ownership and prevent unauthorized access to another user's information.

# 10. UI/UX Design System

## Design Direction

**Premium Editorial SaaS with a Celebration-focused identity.**

The application should feel elegant, trustworthy, modern, and approachable.

### Visual Language

- Warm ivory and neutral surfaces.
- Deep charcoal typography.
- Muted terracotta or burgundy accents.
- Elegant editorial headings.
- Clean sans-serif body typography.
- Subtle borders and shadows.
- Spacious layouts.
- Refined micro-interactions.

### Design Principles

1. Clear information hierarchy.
2. Consistent spacing.
3. Responsive layouts.
4. Accessible color contrast.
5. Functional interactions.
6. Minimal visual clutter.
7. Consistent component behavior.

Avoid excessive gradients, unnecessary glassmorphism, decorative animations, and overcrowded dashboards.

# 11. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Create and manage events | P0 |
| FR-02 | Generate AI event plans | P0 |
| FR-03 | Generate budget allocations | P0 |
| FR-04 | Generate planning timelines | P0 |
| FR-05 | Generate vendor checklists | P0 |
| FR-06 | Personalized recommendations | P0 |
| FR-07 | Edit and save generated plans | P0 |
| FR-08 | Expense tracking | P1 |
| FR-09 | Task completion tracking | P1 |
| FR-10 | Dashboard analytics | P1 |
| FR-11 | Vendor contact management | P1 |
| FR-12 | Export event plans | P2 |
| FR-13 | Guest management | P2 |
| FR-14 | Collaborative planning | P2 |

P0 features are required for the MVP.

# 12. Non-Functional Requirements

### Security

- Keep API keys server-side.
- Validate and sanitize user inputs.
- Enforce database authorization.
- Protect user-specific records.
- Apply API rate limiting.
- Avoid exposing sensitive information in logs.

### Performance

- Responsive page loading.
- Efficient database queries.
- AI generation loading indicators.
- Avoid unnecessary AI calls.
- Handle API timeouts.

### Reliability

- Preserve saved event data during AI failures.
- Provide retry functionality.
- Validate AI-generated JSON.
- Prevent duplicate submissions where practical.
- Handle empty states and invalid data.

### Accessibility

- Keyboard navigation.
- Accessible labels.
- Clear error messages.
- Sufficient contrast.
- Responsive desktop and mobile layouts.

# 13. AI Quality and Safety

AI output must be:

- Relevant to event requirements.
- Consistent with the specified budget.
- Practical and actionable.
- Editable.
- Transparent about estimated costs.
- Validated before persistence.

AI must not claim that vendors are booked, available, verified, or contacted unless this has actually happened.

Budget calculations, expense totals, and task statuses must be controlled by application logic.

# 14. Testing Strategy

### Functional Testing

- Event creation and editing.
- AI plan generation.
- Budget calculations.
- Expense tracking.
- Timeline generation.
- Checklist updates.
- Vendor management.
- Data persistence.

### Edge Case Testing

- Zero or negative budgets.
- Missing event dates.
- Past event dates.
- Extremely large guest counts.
- AI timeout.
- Invalid AI responses.
- Budget overruns.
- Empty vendor lists.
- Network interruptions.

### Responsive Testing

- Desktop.
- Tablet.
- Mobile.

# 15. MVP Acceptance Criteria

Eventora is ready for evaluation when:

- Users can create an event.
- AI generates a complete planning proposal.
- The proposal includes budget, timeline, vendor tasks, and recommendations.
- Budget totals are mathematically accurate.
- Users can edit and save information.
- Tasks can be completed.
- Expense updates reflect in the dashboard.
- AI errors do not destroy saved information.
- All primary controls work.
- The application is publicly accessible.
- The application works on desktop and mobile.

# 16. Hackathon Submission Requirements

Challenge: PromptWars Virtual — Main Challenge 05.

Submission deliverables:

1. Live application URL.
2. Public GitHub repository under 10 MB.
3. Project overview.
4. Walkthrough video under four minutes.

The demonstration should show:

- Event creation.
- Actual AI event generation.
- Budget allocation.
- Timeline.
- Vendor checklist.
- Personalized recommendations.
- Working application interactions.

# 17. Future Roadmap

Features intentionally outside the initial MVP:

- AI invitation designer.
- Guest RSVP management.
- Collaborative event planning.
- Calendar synchronization.
- Vendor discovery integrations.
- PDF event plan export.
- Multilingual planning assistant.
- Notifications and reminders.
- Event-day coordination tools.

# 18. Product Success Criteria

Evaluate Eventora based on:

- Completeness of AI-generated plans.
- Correctness of budget calculations.
- Relevance of personalized recommendations.
- Reliability of event management.
- Ease of use.
- Application stability.
- Actual end-to-end workflow completion.

Do not publish unverified performance metrics or fabricated user testimonials.

---

# FINAL PRODUCT DEFINITION

**Eventora is a GenAI-powered celebration planning platform that transforms event ideas into personalized, budget-aware, and actionable execution plans.**

It combines intelligent recommendations, financial planning, scheduling, and vendor coordination into one unified workspace.

**Core promise: Plan thoughtfully. Celebrate wholeheartedly.**