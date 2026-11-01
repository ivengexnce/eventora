import { AIEventPlan, BudgetDistributionItem, EventType, ExpenseItem, TaskItem, VendorItem, RecommendationItem } from '@/types';

export interface PlanGenerationInput {
  eventName: string;
  eventType: EventType;
  eventDate: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  theme: string;
  preferences: string;
}

export interface GeneratedFullEventPayload {
  aiPlan: AIEventPlan;
  suggestedExpenses: Array<Omit<ExpenseItem, 'id' | 'eventId'>>;
  suggestedTasks: Array<Omit<TaskItem, 'id' | 'eventId'>>;
  suggestedVendors: Array<Omit<VendorItem, 'id' | 'eventId'>>;
  suggestedRecommendations: RecommendationItem[];
}

export async function generateEventPlanWithAI(input: PlanGenerationInput): Promise<GeneratedFullEventPayload> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const response = await callGeminiAPI(apiKey, input);
      if (response) {
        return response;
      }
    } catch (error) {
      console.warn('Gemini API call failed or encountered error, falling back to local contextual intelligence:', error);
    }
  }

  // Resilient contextual intelligence fallback
  return generateContextualFallbackPlan(input);
}

async function callGeminiAPI(apiKey: string, input: PlanGenerationInput): Promise<GeneratedFullEventPayload | null> {
  const prompt = `You are Eventora's Senior Master Event Strategist. Generate a comprehensive, culturally authentic, and mathematically rigorous event plan for the following celebration in India:
Event Name: ${input.eventName}
Event Type: ${input.eventType}
Event Date: ${input.eventDate}
Location: ${input.location}
Guest Count: ${input.guestCount}
Total Budget: INR ${input.totalBudget} (₹)
Theme: ${input.theme}
User Preferences: ${input.preferences || 'None provided'}

CRITICAL INSTRUCTIONS:
1. All budget distributions must sum up exactly to the total budget of ${input.totalBudget} INR.
2. Provide practical, high-value Indian market vendor suggestions (do not fabricate fake phone numbers or addresses).
3. The response MUST be pure valid JSON without markdown fences, adhering to this exact schema:
{
  "concept": "string description",
  "tagline": "string inspiring slogan",
  "theme": {
    "name": "string",
    "description": "string",
    "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
    "styleNotes": ["note1", "note2", "note3"]
  },
  "decorationIdeas": [
    {"title": "string", "description": "string", "placement": "string"}
  ],
  "cateringSuggestions": {
    "cuisineStyle": "string",
    "menuHighlights": ["item1", "item2", "item3", "item4"],
    "dietaryConsiderations": ["string"],
    "beveragePairings": ["string"]
  },
  "budgetDistribution": [
    {"category": "string", "suggestedAmount": number, "percentage": number, "rationale": "string"}
  ],
  "planningTimeline": [
    {"stage": "string", "timeframe": "string", "tasks": ["task1", "task2"]}
  ],
  "vendorChecklist": [
    {"category": "string", "priority": "Essential", "questionsToAsk": ["question1", "question2"]}
  ],
  "entertainmentAndActivities": [
    {"name": "string", "description": "string", "suitableFor": "string"}
  ],
  "personalizedRecommendations": [
    {"title": "string", "category": "Cost Saving", "advice": "string"}
  ]
}`;

  // Call Gemini API (using gemini-2.5-flash or gemini-1.5-flash)
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Gemini API responded with status ${res.status}:`, errorBody);
    return null;
  }

  const json = await res.json();
  const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  try {
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const data = JSON.parse(cleaned);

    const planId = `plan-${Date.now()}`;
    const aiPlan: AIEventPlan = {
      id: planId,
      eventId: '',
      concept: data.concept || `${input.eventName} master plan.`,
      tagline: data.tagline || 'Every celebration deserves a perfect plan.',
      theme: data.theme || {
        name: `${input.theme} Celebration`,
        description: 'Cohesive, warm aesthetic.',
        colorPalette: ['#C85A32', '#D4AF37', '#1C1917', '#FAF8F5'],
        styleNotes: ['Warm ambient lighting', 'Natural botanicals'],
      },
      decorationIdeas: data.decorationIdeas || [],
      cateringSuggestions: data.cateringSuggestions || {
        cuisineStyle: 'Festive Gourmet',
        menuHighlights: [],
        dietaryConsiderations: [],
        beveragePairings: [],
      },
      budgetDistribution: data.budgetDistribution || [],
      planningTimeline: data.planningTimeline || [],
      vendorChecklist: data.vendorChecklist || [],
      entertainmentAndActivities: data.entertainmentAndActivities || [],
      personalizedRecommendations: data.personalizedRecommendations || [],
      createdAt: new Date().toISOString(),
    };

    return formatFullPayload(input, aiPlan);
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', err);
    return null;
  }
}

export function generateContextualFallbackPlan(input: PlanGenerationInput): GeneratedFullEventPayload {
  const isWedding = input.eventType === 'Wedding';
  const isBirthday = input.eventType === 'Birthday';
  const isCommunity = input.eventType === 'Community';

  const budget = Number(input.totalBudget) || 50000;
  const guestCount = Number(input.guestCount) || 50;
  const city = input.location || 'Local';

  // Budget allocations based on event type
  let distribution: BudgetDistributionItem[] = [];
  if (isWedding) {
    distribution = [
      { category: 'Venue', percentage: 32, suggestedAmount: Math.round(budget * 0.32), rationale: 'Main wedding lawn/palace ballroom rental & hospitality suites.' },
      { category: 'Catering', percentage: 30, suggestedAmount: Math.round(budget * 0.30), rationale: `Multi-course celebratory feast for ${guestCount} guests.` },
      { category: 'Decoration', percentage: 18, suggestedAmount: Math.round(budget * 0.18), rationale: 'Mandap, floral installations, stage lighting, and entrance arches.' },
      { category: 'Photography', percentage: 10, suggestedAmount: Math.round(budget * 0.10), rationale: 'Candid photographer, cinematic film, and pre-wedding portraits.' },
      { category: 'Entertainment', percentage: 5, suggestedAmount: Math.round(budget * 0.05), rationale: 'Live folk instrumentalists, DJ setup, and sound system.' },
      { category: 'Logistics', percentage: 5, suggestedAmount: Math.round(budget * 0.05), rationale: 'Guest airport/hotel transit and luggage coordination.' },
    ];
  } else if (isBirthday) {
    distribution = [
      { category: 'Catering', percentage: 40, suggestedAmount: Math.round(budget * 0.40), rationale: `Gourmet live counters, artisanal appetizers, and custom birthday cake.` },
      { category: 'Venue', percentage: 20, suggestedAmount: Math.round(budget * 0.20), rationale: 'Charming rooftop garden, bistro, or party terrace booking.' },
      { category: 'Decoration', percentage: 18, suggestedAmount: Math.round(budget * 0.18), rationale: 'Fairy lights, balloon garland / botanical arch, and personalized backdrop.' },
      { category: 'Entertainment', percentage: 14, suggestedAmount: Math.round(budget * 0.14), rationale: 'Live acoustic singer or party host with interactive games.' },
      { category: 'Miscellaneous', percentage: 8, suggestedAmount: Math.round(budget * 0.08), rationale: 'Curated return favors and photography keepsakes.' },
    ];
  } else {
    // Community
    distribution = [
      { category: 'Decoration', percentage: 28, suggestedAmount: Math.round(budget * 0.28), rationale: 'Clay diyas, marigold torans, bamboo stage framing, and festive lighting.' },
      { category: 'Catering', percentage: 25, suggestedAmount: Math.round(budget * 0.25), rationale: `Community sweet boxes, chai & snack stalls for ${guestCount} community members.` },
      { category: 'Entertainment', percentage: 20, suggestedAmount: Math.round(budget * 0.20), rationale: 'Sound staging, wireless mics, cultural performer honors, and competition prizes.' },
      { category: 'Logistics', percentage: 15, suggestedAmount: Math.round(budget * 0.15), rationale: 'Eco-waste disposal stations, security, marquee canopies, and first aid.' },
      { category: 'Miscellaneous', percentage: 12, suggestedAmount: Math.round(budget * 0.12), rationale: 'Permits, volunteer kits, and contingency reserve.' },
    ];
  }

  // Adjust distribution so the sum is exact to input.totalBudget
  const sum = distribution.reduce((acc, curr) => acc + curr.suggestedAmount, 0);
  const diff = budget - sum;
  if (distribution.length > 0 && diff !== 0) {
    distribution[0].suggestedAmount += diff;
  }

  // Concept & styling
  let concept = '';
  let tagline = '';
  let themeName = '';
  let themeDesc = '';
  let colorPalette: string[] = [];
  let styleNotes: string[] = [];

  if (isWedding) {
    concept = `A magnificent celebration in ${city} marrying timeless cultural traditions with modern comfort. Every detail honors familial legacy while giving ${guestCount} guests an unforgettable royal hospitality experience.`;
    tagline = 'Where sacred traditions meet timeless elegance.';
    themeName = input.theme === 'Modern' ? 'Contemporary Heritage Chic' : 'Royal Imperial Traditions';
    themeDesc = 'A harmonious blend of warm terracotta surfaces, antique brass lanterns, natural jasmine garlands, and rich ceremonial silks.';
    colorPalette = ['#C85A32', '#D4AF37', '#9E2A2B', '#FFFDF9'];
    styleNotes = [
      'Warm candlelight and hanging brass urlis with floating rose petals',
      'Sandstone pedestals flanking the aisle with fragrant rajnigandha vines',
      'Low royal baithak lounge corners with hand-woven silk zari cushions'
    ];
  } else if (isBirthday) {
    concept = `A celebratory gathering in ${city} designed around warm ambiance, laughter, and effortless hospitality. Tailored for ${guestCount} close friends and family with sparkling lights and artisanal food.`;
    tagline = 'Laughter, warm lights, and cherished memories.';
    themeName = input.theme === 'Minimal' ? 'Urban Minimalist Glow' : 'Botanical Garden Glow';
    themeDesc = 'Cozy ambient fairy lights, warm earthy terracotta pottery, fresh eucalyptus sprigs, and handcrafted wooden table settings.';
    colorPalette = ['#C85A32', '#D4AF37', '#2E5038', '#FAF8F5'];
    styleNotes = [
      'Hanging warm-white Edison bulbs and micro-fairy canopies',
      'Rustic timber high-tables paired with hand-calligraphed menu tags',
      'Custom wooden keepsake photo arch with instant polaroids'
    ];
  } else {
    concept = `An inclusive community festival in ${city} celebrating local culture, neighborhood camaraderie, and eco-friendly festivities with zero single-use plastics for ${guestCount} attendees.`;
    tagline = 'Coming together to illuminate community bonds.';
    themeName = 'Eco-Vibrant Utsav';
    themeDesc = 'Natural clay diyas, locally farmed marigolds, organic rice-flour rangolis, and colorful festive cloth buntings.';
    colorPalette = ['#C85A32', '#D4AF37', '#B89222', '#2D5A27'];
    styleNotes = [
      'Pathway flanked by hand-pressed earthenware oil lamps',
      'Grand collaborative community rangoli centerpiece',
      'Upcycled fabric torans and cloth pennants hung between trees'
    ];
  }

  const aiPlan: AIEventPlan = {
    id: `plan-${Date.now()}`,
    eventId: '',
    concept,
    tagline,
    theme: {
      name: themeName,
      description: themeDesc,
      colorPalette,
      styleNotes,
    },
    decorationIdeas: [
      {
        title: isWedding ? 'Aisle of Fragrant Rajnigandha & Brass Urlis' : 'Warm Fairy-Light Canopy',
        description: isWedding
          ? 'Deep brass urlis filled with water, floating tea candles and fresh crimson rose petals along the ceremonial pathway.'
          : 'Suspended warm-white micro-LED light grid creating an intimate, magical starlit atmosphere.',
        placement: 'Main entrance & guest pathway',
      },
      {
        title: isWedding ? 'Handcrafted Floral Mandap with Marigold Torans' : 'Botanical Polaroid Keepsake Wall',
        description: isWedding
          ? 'An open canopy supported by wooden pillars draped in yellow and saffron marigolds, ensuring clear visibility for all guests.'
          : 'A wooden pallet photo frame with natural greenery where guests clip instant polaroid pictures with personal written notes.',
        placement: isWedding ? 'Central ceremonial stage' : 'Welcome greeting zone',
      },
      {
        title: 'Artisanal Terracotta Table Accents',
        description: 'Miniature clay planters containing live succulents, flanked by beaten brass tea-light holders.',
        placement: 'Guest dining & cocktail tables',
      },
    ],
    cateringSuggestions: {
      cuisineStyle: isWedding
        ? 'Royal Indian Heritage Feast & Regional Live Stalls'
        : isBirthday
        ? 'Artisanal Tapas, Live Sliders & Dessert Bar'
        : 'Community Festive Street Delicacies & Kulhad Chai',
      menuHighlights: isWedding
        ? ['Live Chaat Cart with Sev Puri & Pani Puri shots', 'Paneer Kundan Kalia & Dal Makhani Dum Pukht', 'Live Jalebi & Rabdi Station', 'Cold Spiced Thandai in terracotta cups']
        : isBirthday
        ? ['Gourmet Paneer & Chicken Sliders', 'Avocado & Pomegranate Crostini', 'Two-Tier Custom Celebration Cake', 'Sparkling Botanical Fruit Mocktails']
        : ['Hot Fafda, Jalebi & Papaya Sambharo', 'Assorted Festive Mithai Platters', 'Masala Chai & Filter Coffee in Kulhads', 'Piping Hot Samosas & Mint Chutney'],
      dietaryConsiderations: ['Dedicated Pure-Veg and Jain preparation stations', 'Clear gluten-free and allergen labeling'],
      beveragePairings: ['Saffron-infused Badam Drink', 'Fresh Lemongrass Iced Tea'],
    },
    budgetDistribution: distribution,
    planningTimeline: [
      {
        stage: 'Milestone 1: Foundations',
        timeframe: '4-6 Weeks Before',
        tasks: ['Lock the venue contract and verify deposit', 'Finalize initial guest count and send digital invitations', 'Review primary vendor quotes'],
      },
      {
        stage: 'Milestone 2: Experience Design',
        timeframe: '2-3 Weeks Before',
        tasks: ['Conduct menu tasting and finalize food service timings', 'Approve decoration 3D sketches or floral moodboards', 'Lock sound and playlist preferences'],
      },
      {
        stage: 'Milestone 3: Final Countdown',
        timeframe: '3-5 Days Before',
        tasks: ['Confirm final RSVP headcount with caterer', 'Conduct power and AV equipment check at venue', 'Assemble welcome signage and return favors'],
      },
      {
        stage: 'Milestone 4: Celebration Day',
        timeframe: 'Event Day',
        tasks: ['Venue setup walkthrough 3 hours prior to guest arrival', 'Final soundcheck and ambient lighting test', 'Host and family welcome moments'],
      },
    ],
    vendorChecklist: [
      {
        category: 'Venue',
        priority: 'Essential',
        questionsToAsk: ['What is the sound curfew policy?', 'Is generator power backup included in the rental?'],
      },
      {
        category: 'Catering',
        priority: 'Essential',
        questionsToAsk: ['Do you provide service staff and warming chaffing dishes?', 'What is your waste disposal process?'],
      },
      {
        category: 'Decoration',
        priority: 'Essential',
        questionsToAsk: ['Are floral installations done fresh on the morning of the event?', 'What time is venue teardown required?'],
      },
      {
        category: 'Entertainment',
        priority: 'Recommended',
        questionsToAsk: ['Do you bring your own PA system and mixing desk?', 'Can we share a mandatory must-play and do-not-play list?'],
      },
    ],
    entertainmentAndActivities: [
      {
        name: isWedding ? 'Heritage Folk Troupe & Manganiyar Welcoming' : isBirthday ? 'Golden Hour Unplugged Acoustic Set' : 'Community Cultural Showcase & Rangoli Art',
        description: isWedding
          ? 'Soulful Rajasthani or regional folk vocalists greeting arriving guests with authentic instruments.'
          : isBirthday
          ? 'A 90-minute live guitar and vocal performance featuring indie and classic favorites.'
          : 'Interactive neighborhood stage with performances by local youth and senior citizens.',
        suitableFor: 'All guests',
      },
      {
        name: 'The Celebration Guestbook & Polaroid Wall',
        description: 'Guests snap instant portraits, write warm heartfelt messages, and peg them onto a keepsake memory twine.',
        suitableFor: 'Interactive keepsake',
      },
    ],
    personalizedRecommendations: [
      {
        title: 'Optimized Golden Hour Timing',
        category: 'Location Tip',
        advice: `In ${city}, aim for guest arrival 45 minutes prior to sunset to take full advantage of natural golden light for photography.`,
      },
      {
        title: 'Smart Beverage Pre-Batching',
        category: 'Cost Saving',
        advice: 'Utilize twin 5-liter glass beverage dispensers for signature mocktails rather than individual packaged cans to reduce costs by 35%.',
      },
      {
        title: 'Eco-Friendly Favors',
        category: 'Theme',
        advice: 'Gift guests miniature terracotta potted succulents or plantable seed paper tags that double as seating placecards.',
      },
    ],
    createdAt: new Date().toISOString(),
  };

  return formatFullPayload(input, aiPlan);
}

function formatFullPayload(input: PlanGenerationInput, aiPlan: AIEventPlan): GeneratedFullEventPayload {
  // Convert budget distribution into realistic suggested expenses
  const suggestedExpenses: Array<Omit<ExpenseItem, 'id' | 'eventId'>> = aiPlan.budgetDistribution.map((b) => ({
    category: b.category,
    description: `${b.category} allocation for ${input.eventName}`,
    plannedAmount: b.suggestedAmount,
    actualAmount: 0,
    paidAmount: 0,
    status: 'Planned',
    date: new Date().toISOString().split('T')[0],
  }));

  // Convert timeline into actionable tasks with calculated due dates
  const eventDateObj = new Date(input.eventDate);
  const now = new Date();
  const diffDays = Math.max(1, Math.round((eventDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const suggestedTasks: Array<Omit<TaskItem, 'id' | 'eventId'>> = [];
  aiPlan.planningTimeline.forEach((stage, sIdx) => {
    stage.tasks.forEach((taskTitle, tIdx) => {
      // Offset backwards from event date
      const daysBack = Math.max(1, Math.round(diffDays * (0.8 - sIdx * 0.25)));
      const taskDueDate = new Date(eventDateObj.getTime() - daysBack * 24 * 60 * 60 * 1000);
      const safeDueDate = taskDueDate > now ? taskDueDate.toISOString().split('T')[0] : now.toISOString().split('T')[0];

      suggestedTasks.push({
        title: taskTitle,
        description: `Part of ${stage.stage} (${stage.timeframe})`,
        dueDate: safeDueDate,
        priority: sIdx === 0 || tIdx === 0 ? 'High' : 'Medium',
        status: 'Pending',
        category: sIdx === 0 ? 'Venue' : sIdx === 1 ? 'Catering' : 'Logistics',
        daysBeforeEvent: daysBack,
      });
    });
  });

  // Convert vendor checklist into actionable vendor items
  const suggestedVendors: Array<Omit<VendorItem, 'id' | 'eventId'>> = aiPlan.vendorChecklist.map((v) => {
    const matchedBudget = aiPlan.budgetDistribution.find((b) => b.category.toLowerCase() === v.category.toLowerCase());
    return {
      name: `${v.category} Specialist (${input.location || 'Local'})`,
      category: v.category,
      contact: {
        phone: '+91 98XXX XXXXX',
        email: `inquiries@${v.category.toLowerCase().replace(/\s+/g, '')}-events.in`,
        contactPerson: 'Lead Coordinator',
      },
      estimatedCost: matchedBudget ? matchedBudget.suggestedAmount : Math.round(input.totalBudget * 0.15),
      bookingStatus: 'Not contacted',
      notes: `Key questions: ${v.questionsToAsk.join(' | ')}`,
      deliverables: v.questionsToAsk,
    };
  });

  // Recommendations
  const suggestedRecommendations: RecommendationItem[] = aiPlan.personalizedRecommendations.map((r, idx) => ({
    id: `rec-gen-${idx + 1}`,
    category: (r.category as any) || 'Cost Saving',
    title: r.title,
    description: r.advice,
    budgetImpact: r.category.includes('Cost') ? 'High Savings' : 'Cost Neutral',
    tags: [input.eventType, input.theme, 'AI Recommended'],
  }));

  return {
    aiPlan,
    suggestedExpenses,
    suggestedTasks,
    suggestedVendors,
    suggestedRecommendations,
  };
}

