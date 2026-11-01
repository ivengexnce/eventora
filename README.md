# EVENTORA — AI Celebration & Event Planner

> **"Plan thoughtfully. Celebrate wholeheartedly."**
> GenAI-powered celebration and event planning companion. One intelligent workspace for weddings, birthdays, and community celebrations.

---

## 🌟 Overview

**Eventora** transforms celebration dreams into structured, culturally resonant, and mathematically rigorous event blueprints. Whether planning a royal heritage wedding in Jaipur, an intimate fairy-lit birthday in Mumbai, or a zero-waste community Diwali Mela in Bengaluru, Eventora eliminates planning chaos through AI intelligence and deterministic project management.

---

## 🚀 Key Features

### 1. Editorial Landing Page & Showcase
- **Hero Section**: Introduces the AI celebration companion with core capability badges.
- **Interactive Live Preview**: Demonstrates a real generated event plan (*Garden Glow Birthday, Mumbai, 40 guests, ₹25,000 budget*) with real-time budget ring calculations.
- **Three-Step Walkthrough**: Clear path from vision to AI synthesis to execution.

### 2. Centralized Celebration Dashboard
- **Greeting**: *"Let's make something worth celebrating."*
- **Real-Time Metrics**: Active Events, Combined Planned Budget, Actual Spending, Tasks Completed %.
- **Upcoming Deadlines**: High-priority milestones with instant completion toggles.
- **Active Celebration Switcher**: Seamlessly toggle between multiple celebrations or plan new ones.

### 3. Event Creation Studio
- Collects event name, celebration type (Wedding / Birthday / Community), target date, city or venue, guest count, total budget in INR (₹), aesthetic theme, and special cultural preferences.
- Server-side validation with real-time loading feedback.

### 4. AI Planning Studio (Main Differentiating Feature)
- **Concept & Tagline**: Emotionally resonant vision for the host.
- **Theme & Color Palette**: Harmonious 4-color swatch palettes with architectural styling notes.
- **Decoration Ideas**: Specific installations with exact placement cues (e.g. entrance pergolas, central mandaps, cocktail tables).
- **Catering Concept**: Menu highlights, dietary considerations (Jain, vegan, pure-veg), and artisanal beverage pairings.
- **Suggested Budget Distribution**: Category percentage allocations with rationales.
- **Milestone Sequencing**: Reverse-engineered deadlines relative to celebration date.
- **Vendor Checklist**: High-priority must-ask questions for contracts and negotiation.
- **Activities & Entertainment**: Curated guest experiences and icebreakers.
- **Regenerate & Tweak**: Live plan re-synthesis with preserved workspace data.

### 5. Smart Budget Manager (*Every rupee, thoughtfully planned*)
- Full mathematical precision (no hallucinated totals).
- Track **Total Budget**, **Planned Expenses**, **Actual Expenses**, and **Remaining Amount**.
- **Utilization Health Bar**: Color-coded safety thresholds (Green / Amber / Red).
- **Over-Budget Warnings**: AI cost-saving suggestions (e.g. *"Your estimated expenses exceed your budget by ₹3,500. Would you like AI to suggest adjustments?"*).
- **CRUD Operations**: Add, edit, and delete expense items with instant reactive balance recalculation.

### 6. Smart Timeline (*The countdown to your celebration*)
- **Live Celebration Countdown Clock**: Days, Hours, Minutes, and Seconds remaining.
- **Milestone Checklists**: Interactive checkboxes that immediately update dashboard completion percentages.
- **Priority Tiers**: High, Medium, Low badges.
- **Add / Edit / Delete Milestones**: Tailor schedules as plans progress.

### 7. Vendor Management (*The right people make the celebration*)
- Comprehensive categories: *Venue, Catering, Photography, Decoration, Makeup & styling, Entertainment, Transportation*.
- Status tracking: *Not contacted, Contacted, Negotiating, Confirmed, Cancelled*.
- Quick status switcher on vendor cards.
- Tracks estimated vs. actual quoted costs, contact persons, phone numbers, and negotiation notes.

### 8. Context-Aware AI Recommendations (*A little inspiration goes a long way*)
- Dynamic recommendations tailored specifically to the active event's location, budget, guest count, and theme.
- Filter by *Theme, Decor, Food, Entertainment, Cost Saving, Location Tip*.
- **"Apply to Timeline" Action**: Instantly converts any recommended idea into an actionable milestone task!

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict typing)
- **Styling**: Tailwind CSS (Custom luxury editorial palette: Royal Terracotta & Champagne Gold)
- **Icons**: Lucide React
- **AI Intelligence**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`) via Next.js server route `/api/generate-plan` with built-in resilient contextual fallback generator.
- **Data Persistence**: Reactive LocalStorage sync with custom events.

---

## 💻 Local Development

### 1. Clone & Install
```bash
git clone https://github.com/your-username/eventora.git
cd eventora
npm install
```

### 2. Environment Configuration (Optional)
Create `.env.local` to provide your Gemini API key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(Note: If no API key is provided, Eventora operates seamlessly in Resilient Fallback Mode with rich contextual plan generation!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3005](http://localhost:3005) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 📄 License
MIT License. Built for celebration planners everywhere.

