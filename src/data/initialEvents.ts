import { EventItem } from '@/types';

export const initialEvents: EventItem[] = [
  {
    id: 'evt-mumbai-birthday',
    title: 'Garden Glow Birthday',
    eventType: 'Birthday',
    eventDate: '2026-11-20',
    location: 'Bandra West, Mumbai',
    guestCount: 40,
    totalBudget: 25000,
    theme: 'Modern',
    preferences: 'Outdoor garden party, warm fairy lights, acoustic live music, artisanal finger foods, minimal plastic.',
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-11-01T12:00:00Z',
    aiPlan: {
      id: 'plan-mumbai-birthday',
      eventId: 'evt-mumbai-birthday',
      concept: 'An enchanting evening garden celebration under gentle twilight and sparkling fairy lights, blending cozy acoustic warmth with gourmet grazing platters and heartfelt camaraderie.',
      tagline: 'Warm amber glow, intimate acoustic melodies, and garden warmth.',
      theme: {
        name: 'Botanical Garden Glow',
        description: 'Lush greenery illuminated by warm incandescent Edison bulbs, fairy light canopies, earthen terracotta planters, and rustic timber seating.',
        colorPalette: ['#C85A32', '#D4AF37', '#2D5A27', '#FAF8F5'],
        styleNotes: [
          'Hanging glass baubles with micro-LEDs from overhead branches',
          'Rustic low picnic tables with embroidered floor cushions',
          'Jute runners with fresh eucalyptus sprigs and marigold accents'
        ]
      },
      decorationIdeas: [
        {
          title: 'Warm Fairy-Light Canopy',
          description: 'A grid of 200m warm-white micro-fairy lights suspended across the pergola creating a starry sky effect over the seating area.',
          placement: 'Central lawn pergola'
        },
        {
          title: 'Garden-Themed Photo Corner',
          description: 'A wooden pallet archway draped with macramé, monstera leaves, fairy lights, and a custom wooden name plaque.',
          placement: 'Entry walkway'
        },
        {
          title: 'Terracotta Table Centerpieces',
          description: 'Handcrafted miniature terracotta pots with live succulents and brass tealight holders.',
          placement: 'Guest dining & cocktail tables'
        }
      ],
      cateringSuggestions: {
        cuisineStyle: 'Artisanal Indian Street & Mediterranean Grazing Platter',
        menuHighlights: [
          'Truffle Mushroom Bruschetta & Avocado Sev Puri Shots',
          'Mini Paneer Tikka Sliders with Mint Chutney Emulsion',
          'Falafel Cups with Beetroot Hummus',
          'Custom Two-Tier Pistachio Rose Milk Birthday Cake',
          'Artisanal Spiced Cold Brew & Hibiscus Coolers'
        ],
        dietaryConsiderations: ['100% Vegetarian options', 'Gluten-free flatbread substitutions available'],
        beveragePairings: ['Sparkling Botanical Lemonade', 'Virgin Passionfruit Mojitos']
      },
      budgetDistribution: [
        {
          category: 'Catering',
          suggestedAmount: 10000,
          percentage: 40,
          rationale: 'Includes grazing boards, live sliders, dessert bar and welcome drinks for 40 guests.'
        },
        {
          category: 'Decoration',
          suggestedAmount: 5000,
          percentage: 20,
          rationale: 'Fairy lights rental, photo corner wooden frame, botanical greens and candles.'
        },
        {
          category: 'Entertainment',
          suggestedAmount: 4000,
          percentage: 16,
          rationale: 'Solo acoustic guitarist for a 2-hour sunset set plus portable sound setup.'
        },
        {
          category: 'Venue',
          suggestedAmount: 4000,
          percentage: 16,
          rationale: 'Half-day private community garden/terrace rental booking fee.'
        },
        {
          category: 'Miscellaneous',
          suggestedAmount: 2000,
          percentage: 8,
          rationale: 'Contingency for ice, extra disposables, and return gift packaging.'
        }
      ],
      planningTimeline: [
        {
          stage: '3 Weeks Out',
          timeframe: 'Day -21',
          tasks: ['Lock garden terrace reservation', 'Send digital RSVP invites via WhatsApp', 'Book acoustic guitarist']
        },
        {
          stage: '10 Days Out',
          timeframe: 'Day -10',
          tasks: ['Confirm menu items with caterer', 'Order custom birthday cake', 'Source fairy light rentals']
        },
        {
          stage: '3 Days Out',
          timeframe: 'Day -3',
          tasks: ['Collect final RSVP headcount', 'Create Spotify backup playlist', 'Purchase drink mixers and ice']
        },
        {
          stage: 'Celebration Day',
          timeframe: 'Event Day',
          tasks: ['Lawn setup and light testing by 3:00 PM', 'Cake delivery by 5:00 PM', 'Guest arrival at 6:30 PM']
        }
      ],
      vendorChecklist: [
        {
          category: 'Venue',
          priority: 'Essential',
          questionsToAsk: ['Is open flame/candles permitted?', 'Is there a reliable power point for audio equipment?']
        },
        {
          category: 'Catering',
          priority: 'Essential',
          questionsToAsk: ['Do you supply your own warming trays and serving staff?', 'Can cake be stored in chiller?']
        },
        {
          category: 'Entertainment',
          priority: 'Recommended',
          questionsToAsk: ['Do you bring your own amplifier and microphone?', 'What is your setup duration?']
        }
      ],
      entertainmentAndActivities: [
        {
          name: 'Golden Hour Acoustic Live Set',
          description: 'A 90-minute unplugged acoustic performance playing indie and soft Hindi classics during sunset.',
          suitableFor: 'All guests'
        },
        {
          name: 'The Nostalgia Polaroids Corner',
          description: 'Guests snap instant polaroid photos and pin them with personal birthday wishes onto a string twine board.',
          suitableFor: 'Interactive keepsake'
        },
        {
          name: 'Trivia: How Well Do You Know the Birthday Host?',
          description: 'A quick 10-question mobile or card trivia game with quirky custom prizes.',
          suitableFor: 'Ice breaker'
        }
      ],
      personalizedRecommendations: [
        {
          title: 'Sunset Timing Advantage',
          category: 'Location Tip',
          advice: 'Plan guest arrival for 5:45 PM in Bandra to capture the coastal twilight golden hour before the fairy lights take over.'
        },
        {
          title: 'Pre-batched Signature Mocktail',
          category: 'Cost Saving',
          advice: 'Instead of individual beverage cans, set up two large vintage glass drink dispensers for iced tea and hibiscus spritz to save ~₹1,200.'
        },
        {
          title: 'Plantable Seed Favors',
          category: 'Decor',
          advice: 'Gift guests mini marigold seed cards that match the garden theme for under ₹25 per person.'
        }
      ],
      createdAt: '2026-10-25T10:15:00Z'
    },
    expenses: [
      {
        id: 'exp-bday-1',
        eventId: 'evt-mumbai-birthday',
        category: 'Catering',
        description: 'Grazing boards, sliders & cocktail snacks',
        plannedAmount: 10000,
        actualAmount: 9800,
        paidAmount: 5000,
        status: 'Partially Paid',
        date: '2026-10-28'
      },
      {
        id: 'exp-bday-2',
        eventId: 'evt-mumbai-birthday',
        category: 'Venue',
        description: 'Garden terrace advance deposit',
        plannedAmount: 4000,
        actualAmount: 4000,
        paidAmount: 4000,
        status: 'Paid',
        date: '2026-10-26'
      },
      {
        id: 'exp-bday-3',
        eventId: 'evt-mumbai-birthday',
        category: 'Decoration',
        description: 'Fairy lights, wooden arch & terracotta pots',
        plannedAmount: 5000,
        actualAmount: 5200,
        paidAmount: 2500,
        status: 'Partially Paid',
        date: '2026-10-29'
      },
      {
        id: 'exp-bday-4',
        eventId: 'evt-mumbai-birthday',
        category: 'Entertainment',
        description: 'Acoustic singer duo fee',
        plannedAmount: 4000,
        actualAmount: 3800,
        paidAmount: 2000,
        status: 'Partially Paid',
        date: '2026-10-30'
      },
      {
        id: 'exp-bday-5',
        eventId: 'evt-mumbai-birthday',
        category: 'Miscellaneous',
        description: 'Two-tier Pistachio Birthday Cake',
        plannedAmount: 2000,
        actualAmount: 2200,
        paidAmount: 2200,
        status: 'Paid',
        date: '2026-10-31'
      }
    ],
    tasks: [
      {
        id: 'tsk-bday-1',
        eventId: 'evt-mumbai-birthday',
        title: 'Confirm garden terrace booking and pay deposit',
        description: 'Secure the rooftop lawn overlooking Pali Hill for 4:00 PM to 10:30 PM.',
        dueDate: '2026-10-27',
        priority: 'High',
        status: 'Completed',
        category: 'Venue',
        daysBeforeEvent: 24
      },
      {
        id: 'tsk-bday-2',
        eventId: 'evt-mumbai-birthday',
        title: 'Taste test and finalize custom pistachio cake',
        description: 'Verify eggless preparation and confirm delivery at 5:00 PM on event day.',
        dueDate: '2026-11-05',
        priority: 'Medium',
        status: 'Pending',
        category: 'Catering',
        daysBeforeEvent: 15
      },
      {
        id: 'tsk-bday-3',
        eventId: 'evt-mumbai-birthday',
        title: 'Pick up fairy lights & extension reels rental',
        description: 'Collect 200m warm-white lights and check all bulbs work with power tester.',
        dueDate: '2026-11-18',
        priority: 'High',
        status: 'Pending',
        category: 'Decoration',
        daysBeforeEvent: 2
      },
      {
        id: 'tsk-bday-4',
        eventId: 'evt-mumbai-birthday',
        title: 'Send digital WhatsApp countdown reminder to guests',
        description: 'Include Google Maps pin and suggest warm casual / garden cocktail dress code.',
        dueDate: '2026-11-15',
        priority: 'Low',
        status: 'Pending',
        category: 'Logistics',
        daysBeforeEvent: 5
      }
    ],
    vendors: [
      {
        id: 'ven-bday-1',
        eventId: 'evt-mumbai-birthday',
        name: 'The Secret Verandah',
        category: 'Venue',
        contact: {
          phone: '+91 98201 44521',
          email: 'events@secretverandah.in',
          contactPerson: 'Karan Shah'
        },
        estimatedCost: 4000,
        actualCost: 4000,
        bookingStatus: 'Confirmed',
        notes: 'Includes power backup and 8 wooden patio tables with garden chairs.'
      },
      {
        id: 'ven-bday-2',
        eventId: 'evt-mumbai-birthday',
        name: 'Artisan Bites Mumbai',
        category: 'Catering',
        contact: {
          phone: '+91 98199 87654',
          email: 'chefalok@artisanbites.com',
          contactPerson: 'Chef Alok Sen'
        },
        estimatedCost: 10000,
        actualCost: 9800,
        bookingStatus: 'Confirmed',
        notes: 'Delivering live sliders and 4 distinct warm tapas stations.'
      },
      {
        id: 'ven-bday-3',
        eventId: 'evt-mumbai-birthday',
        name: 'Acoustic Breeze Duet (Rohan & Meera)',
        category: 'Entertainment',
        contact: {
          phone: '+91 99300 12345',
          email: 'rohan.acoustic@gmail.com',
          contactPerson: 'Rohan Joshi'
        },
        estimatedCost: 4000,
        actualCost: 3800,
        bookingStatus: 'Confirmed',
        notes: 'Guitar + vocals, 2x 45 min sets with 15 min break in between.'
      },
      {
        id: 'ven-bday-4',
        eventId: 'evt-mumbai-birthday',
        name: 'Glow Lights & Prop Rentals',
        category: 'Decoration',
        contact: {
          phone: '+91 97690 99881',
          contactPerson: 'Vikram Electricals'
        },
        estimatedCost: 5000,
        actualCost: 5200,
        bookingStatus: 'Negotiating',
        notes: 'Needs to confirm ladder access for canopy installation by 2:00 PM.'
      }
    ],
    recommendations: [
      {
        id: 'rec-bday-1',
        category: 'Theme',
        title: 'Botanical Warm Glow Theme',
        description: 'Using warm amber fairy bulbs with natural terracotta tones compliments Mumbai evening breezes effortlessly.',
        budgetImpact: 'Cost Neutral',
        tags: ['Lighting', 'Outdoor', 'Aesthetic']
      },
      {
        id: 'rec-bday-2',
        category: 'Food',
        title: 'Live Slider & Skewer Stations',
        description: 'Interactive handheld bites keep 40 guests mingling fluidly rather than sitting rigidly at dining tables.',
        budgetImpact: 'Medium',
        tags: ['Catering', 'Interactive']
      },
      {
        id: 'rec-bday-3',
        category: 'Cost Saving',
        title: 'DIY Vintage Drink Dispensers',
        description: 'Pre-batch signature mocktails in twin 5-liter glass dispensers instead of buying single-serve cans to save ~₹1,500.',
        budgetImpact: 'High Savings',
        tags: ['Beverages', 'Budget Hack']
      }
    ]
  },
  {
    id: 'evt-jaipur-wedding',
    title: 'Royal Rajputana Wedding',
    eventType: 'Wedding',
    eventDate: '2026-12-14',
    location: 'Kukas, Jaipur, Rajasthan',
    guestCount: 350,
    totalBudget: 1800000,
    theme: 'Traditional',
    preferences: 'Grand heritage palace courtyard, royal marigold floral installations, Rajasthani folk musicians, royal thali dinner, regal fireworks display.',
    createdAt: '2026-10-10T09:00:00Z',
    updatedAt: '2026-11-01T15:00:00Z',
    aiPlan: {
      id: 'plan-jaipur-wedding',
      eventId: 'evt-jaipur-wedding',
      concept: 'A majestic Rajputana heritage celebration honoring timeless desert royalty, marked by brass mashaals, fragrant marigold cascades, soulful Manganiyar melodies, and aristocratic Rajput hospitality.',
      tagline: 'Timeless royal splendor beneath the starlit Aravalli hills.',
      theme: {
        name: 'Regal Rajputana Courtyard',
        description: 'Carved sandstone motifs, deep saffron marigold torans, warm brass lanterns, and rich crimson-and-gold zardozi drapes.',
        colorPalette: ['#C85A32', '#9E2A2B', '#D4AF37', '#FFFBF0'],
        styleNotes: [
          'Grand entrance lined with burning copper urns (mashaals) and rose petal shower',
          'Baradari mandap draped in yellow and orange Indian marigolds overlooking marble steps',
          'Low royal baithak seating with velvet bolsters and hand-block-printed floor spreads'
        ]
      },
      decorationIdeas: [
        {
          title: 'Marigold & Rajnigandha Mandap',
          description: 'A 4-pillar sandstone gazebo wrapped tightly in thousands of fresh marigold strands and fragrant tuberose.',
          placement: 'Central stepwell courtyard'
        },
        {
          title: 'Brass Mashaal Pathway',
          description: 'Flambeau torches stationed every 10 paces illuminating the fortress driveway.',
          placement: 'Fortress entrance driveway'
        },
        {
          title: 'Sheesh Mahal Photo Gallery',
          description: 'Mirror-mosaic backdrop with vintage Rajput portraits and royal jharokhas for couple portraits.',
          placement: 'Reception foyer'
        }
      ],
      cateringSuggestions: {
        cuisineStyle: 'Traditional Rajasthani Royal Feast & North Indian Gourmet',
        menuHighlights: [
          'Dal Baati Churma with 4 varieties of churma (Rose, Dry Fruit, Besan)',
          'Laal Maas & Junglee Murgh (or royal Govind Gatte & Ker Sangri for veg)',
          'Ghevar live counter with Rabdi & saffron drizzle',
          'Jodhpuri Mirchi Vada & Poha cocktail appetisers',
          'Cold Spiced Thandai & Rose Sharbats served in clay kulhads'
        ],
        dietaryConsiderations: ['Dedicated Pure-Veg and Jain preparation kitchens'],
        beveragePairings: ['Saffron Badam Milk', 'Jaljeera Shikanji']
      },
      budgetDistribution: [
        {
          category: 'Venue',
          suggestedAmount: 600000,
          percentage: 33.3,
          rationale: 'Heritage fort courtyard rental for 2 days including room accommodation for primary family.'
        },
        {
          category: 'Catering',
          suggestedAmount: 550000,
          percentage: 30.5,
          rationale: 'Comprehensive multi-meal royal spread for 350 guests across Hi-Tea, Dinner, and late night.'
        },
        {
          category: 'Decoration',
          suggestedAmount: 300000,
          percentage: 16.7,
          rationale: 'Heritage florals, mandap styling, royal lighting, carpets and furniture setup.'
        },
        {
          category: 'Photography',
          suggestedAmount: 180000,
          percentage: 10,
          rationale: '3-camera team, drone cinematography, cinematic wedding teaser, and heirloom photobooks.'
        },
        {
          category: 'Entertainment',
          suggestedAmount: 100000,
          percentage: 5.5,
          rationale: 'Manganiyar folk troupe, Shehnai players for entry, and sound engineering.'
        },
        {
          category: 'Logistics',
          suggestedAmount: 70000,
          percentage: 4,
          rationale: 'Guest AC shuttle buses from Jaipur airport to Kukas resort.'
        }
      ],
      planningTimeline: [
        {
          stage: '6 Months Out',
          timeframe: 'Day -180',
          tasks: ['Lock heritage palace venue contract', 'Book wedding photography crew']
        },
        {
          stage: '3 Months Out',
          timeframe: 'Day -90',
          tasks: ['Finalize catering menu tasting in Jaipur', 'Approve floral decor renderings for Mandap']
        },
        {
          stage: '1 Month Out',
          timeframe: 'Day -30',
          tasks: ['Confirm guest arrival flight schedules for Kukas shuttle', 'Finalize Manganiyar troupe song list']
        },
        {
          stage: 'Event Day',
          timeframe: 'Wedding Day',
          tasks: ['Baraat assembly with traditional dhol at 4:30 PM', 'Mandap pheras at 6:15 PM sunset', 'Royal feast opens at 8:00 PM']
        }
      ],
      vendorChecklist: [
        {
          category: 'Venue',
          priority: 'Essential',
          questionsToAsk: ['Are sound curfew extensions permitted past 10 PM?', 'What is power generator capacity?']
        },
        {
          category: 'Catering',
          priority: 'Essential',
          questionsToAsk: ['Can local organic halwais use palace kitchens?', 'What is waste management policy?']
        }
      ],
      entertainmentAndActivities: [
        {
          name: 'Heritage Manganiyar Folk Symphony',
          description: 'Renowned Rajasthani folk vocalists and khartal masters welcoming guests at the palace steps.',
          suitableFor: 'Grand entry'
        },
        {
          name: 'Live Lac Bangle Making Counter',
          description: 'Jaipuri artisans crafting customized colored bangles on the spot for female wedding guests.',
          suitableFor: 'Guest engagement'
        }
      ],
      personalizedRecommendations: [
        {
          title: 'Direct Airport Charter Transfers',
          category: 'Location Tip',
          advice: 'Coordinate shared tempo travelers from Jaipur Airport to Kukas every 90 minutes to save 40% over individual taxi bills.'
        },
        {
          title: 'Seasonal Winter Marigold Sourcing',
          category: 'Cost Saving',
          advice: 'Procure marigold flowers directly from the Phool Mandi near Chhoti Chaupar at dawn rather than through decor markup.'
        }
      ],
      createdAt: '2026-10-10T09:30:00Z'
    },
    expenses: [
      {
        id: 'exp-jpr-1',
        eventId: 'evt-jaipur-wedding',
        category: 'Venue',
        description: 'Heritage Fort advance token deposit',
        plannedAmount: 600000,
        actualAmount: 600000,
        paidAmount: 300000,
        status: 'Partially Paid',
        date: '2026-10-12'
      },
      {
        id: 'exp-jpr-2',
        eventId: 'evt-jaipur-wedding',
        category: 'Catering',
        description: 'Royal Thali catering contract advance',
        plannedAmount: 550000,
        actualAmount: 540000,
        paidAmount: 200000,
        status: 'Partially Paid',
        date: '2026-10-15'
      },
      {
        id: 'exp-jpr-3',
        eventId: 'evt-jaipur-wedding',
        category: 'Photography',
        description: 'Cinematic photography & drone team booking',
        plannedAmount: 180000,
        actualAmount: 180000,
        paidAmount: 90000,
        status: 'Partially Paid',
        date: '2026-10-18'
      },
      {
        id: 'exp-jpr-4',
        eventId: 'evt-jaipur-wedding',
        category: 'Decoration',
        description: 'Mandap marigold & floral design advance',
        plannedAmount: 300000,
        actualAmount: 310000,
        paidAmount: 150000,
        status: 'Partially Paid',
        date: '2026-10-22'
      }
    ],
    tasks: [
      {
        id: 'tsk-jpr-1',
        eventId: 'evt-jaipur-wedding',
        title: 'Complete food tasting with royal catering chef',
        description: 'Verify Ker Sangri spices and sample sweet rabdi consistency.',
        dueDate: '2026-11-10',
        priority: 'High',
        status: 'Completed',
        category: 'Catering',
        daysBeforeEvent: 34
      },
      {
        id: 'tsk-jpr-2',
        eventId: 'evt-jaipur-wedding',
        title: 'Approve final Mandap floral 3D mockups',
        description: 'Check floral hanging height so sacred fire smoke disperses naturally.',
        dueDate: '2026-11-25',
        priority: 'High',
        status: 'In Progress',
        category: 'Decoration',
        daysBeforeEvent: 19
      },
      {
        id: 'tsk-jpr-3',
        eventId: 'evt-jaipur-wedding',
        title: 'Finalize guest flight manifest for Kukas shuttle bus',
        description: 'Group arriving guests into 3 arrival windows at Jaipur Terminal 2.',
        dueDate: '2026-12-05',
        priority: 'Medium',
        status: 'Pending',
        category: 'Logistics',
        daysBeforeEvent: 9
      }
    ],
    vendors: [
      {
        id: 'ven-jpr-1',
        eventId: 'evt-jaipur-wedding',
        name: 'Fort Kukas Palace & Courtyards',
        category: 'Venue',
        contact: {
          phone: '+91 141 228 9000',
          email: 'weddings@fortkukas.com',
          contactPerson: 'Mahipal Singh'
        },
        estimatedCost: 600000,
        actualCost: 600000,
        bookingStatus: 'Confirmed',
        notes: 'Includes 25 heritage deluxe suites for bridal party and courtyard.'
      },
      {
        id: 'ven-jpr-2',
        eventId: 'evt-jaipur-wedding',
        name: 'Marwar Heritage Caterers',
        category: 'Catering',
        contact: {
          phone: '+91 94140 33411',
          contactPerson: 'Maharaj Ratanlal'
        },
        estimatedCost: 550000,
        actualCost: 540000,
        bookingStatus: 'Confirmed',
        notes: 'Provides brass thalis, traditional turbaned waitstaff, and authentic firewood cooking.'
      },
      {
        id: 'ven-jpr-3',
        eventId: 'evt-jaipur-wedding',
        name: 'Aravalli Lens Studios',
        category: 'Photography',
        contact: {
          phone: '+91 98290 77123',
          email: 'shoot@aravallilens.com',
          contactPerson: 'Deepak Rathore'
        },
        estimatedCost: 180000,
        actualCost: 180000,
        bookingStatus: 'Confirmed',
        notes: 'Includes pre-wedding shoot in Amber fort plus two days full wedding coverage.'
      }
    ],
    recommendations: [
      {
        id: 'rec-jpr-1',
        category: 'Decor',
        title: 'Night Mashaal Illumination',
        description: 'Replace modern halogen floodlights with traditional kerosene/brass mashaals for deep authenticity and striking photos.',
        budgetImpact: 'Cost Neutral',
        tags: ['Heritage', 'Photography']
      },
      {
        id: 'rec-jpr-2',
        category: 'Entertainment',
        title: 'Sunset Khartal & Dholak Performance',
        description: 'Schedule the folk troupe during the 45-minute golden hour between sunset and dinner.',
        budgetImpact: 'Low',
        tags: ['Folk', 'Music']
      }
    ]
  },
  {
    id: 'evt-blr-diwali',
    title: 'Utsav Community Diwali Mela',
    eventType: 'Community',
    eventDate: '2026-11-08',
    location: 'Koramangala Clubhouse Grounds, Bengaluru',
    guestCount: 500,
    totalBudget: 250000,
    theme: 'Traditional',
    preferences: 'Neighborhood festival, 1000 clay diyas, rangoli competition, artisanal handicraft flea stalls, zero single-use plastic, community food stalls.',
    createdAt: '2026-10-15T14:00:00Z',
    updatedAt: '2026-11-01T16:00:00Z',
    aiPlan: {
      id: 'plan-blr-diwali',
      eventId: 'evt-blr-diwali',
      concept: 'A vibrant community-led Diwali carnival fostering neighborly bonds through eco-friendly clay diyas, inter-generational rangoli art, local home-chef food stalls, and an open-air cultural showcase.',
      tagline: 'Lighting up homes, celebrating community togetherness.',
      theme: {
        name: 'Eco-Illumination Utsav',
        description: 'Earth-friendly festive decor using terracotta, marigold garlands, solar fairy strands, and vibrant rice-flour rangolis.',
        colorPalette: ['#C85A32', '#D4AF37', '#B89222', '#2D5A27'],
        styleNotes: [
          'Pathway illuminated with hand-pressed natural clay diyas using sesame oil',
          'Community mandala rangoli created collectively by neighborhood residents',
          'Upcycled fabric torans and cloth pennants hung between trees'
        ]
      },
      decorationIdeas: [
        {
          title: 'The Great Community Diya Wall',
          description: 'A 5-tier bamboo display shelf accommodating 1,000 clay diyas lit simultaneously at dusk.',
          placement: 'Central clubhouse lawn'
        },
        {
          title: 'Recycled Fabric Toran Bunting',
          description: 'Festive cloth buntings handcrafted by local senior citizens using leftover festive textile scraps.',
          placement: 'Market stall perimeter'
        }
      ],
      cateringSuggestions: {
        cuisineStyle: 'Community Home-Chef Stalls & Festive Street Delicacies',
        menuHighlights: [
          'Hot Jalebi & Fafda with Raw Papaya Sambharo',
          'Mysore Pak, Badam Halwa & Gulab Jamun live dessert stall',
          'Dahi Bhalla & Chana Chaat cups',
          'Filter Coffee & Masala Chai on tap in clay kulhads'
        ],
        dietaryConsiderations: ['Strictly eco-friendly banana leaf plates and areca nut bowls'],
        beveragePairings: ['Masala Chai', 'Tender Coconut Water']
      },
      budgetDistribution: [
        {
          category: 'Decoration',
          suggestedAmount: 70000,
          percentage: 28,
          rationale: '1,000 clay diyas, sesame oil, bamboo display, marigold garlands, and LED lighting.'
        },
        {
          category: 'Entertainment',
          suggestedAmount: 50000,
          percentage: 20,
          rationale: 'Sound system, microphones, stage lighting, and prizes for rangoli and youth performances.'
        },
        {
          category: 'Catering',
          suggestedAmount: 60000,
          percentage: 24,
          rationale: 'Subsidized community sweets distribution, chai/coffee stations, and hospitality.'
        },
        {
          category: 'Logistics',
          suggestedAmount: 40000,
          percentage: 16,
          rationale: 'Waste segregation bins, cleaning crew, security guards, and fire safety equipment.'
        },
        {
          category: 'Miscellaneous',
          suggestedAmount: 30000,
          percentage: 12,
          rationale: 'Permission permits, volunteer t-shirts, and first aid booth.'
        }
      ],
      planningTimeline: [
        {
          stage: '4 Weeks Out',
          timeframe: 'Day -28',
          tasks: ['Obtain RWA community grounds permission', 'Invite home-chefs for food stall registration']
        },
        {
          stage: '2 Weeks Out',
          timeframe: 'Day -14',
          tasks: ['Bulk order 1,000 clay diyas from local potters', 'Finalize stage sound rental']
        },
        {
          stage: 'Event Day',
          timeframe: 'Diwali Day',
          tasks: ['Rangoli competition kicks off at 3:00 PM', 'Diya lighting ceremony at 6:00 PM dusk', 'Music and cultural program 6:30 PM - 9:30 PM']
        }
      ],
      vendorChecklist: [
        {
          category: 'Decoration',
          priority: 'Essential',
          questionsToAsk: ['Are clay diyas locally sourced and chemical-free?']
        },
        {
          category: 'Logistics',
          priority: 'Essential',
          questionsToAsk: ['Do you provide dry vs wet waste segregation teams?']
        }
      ],
      entertainmentAndActivities: [
        {
          name: 'Inter-Block Rangoli Championship',
          description: 'Blocks compete in teams of 4 using organic color powders and flower petals.',
          suitableFor: 'Families & youth'
        },
        {
          name: 'The 1,000 Diya Lighting Moment',
          description: 'All 500 residents light a diya simultaneously at 6:15 PM while the community choir sings.',
          suitableFor: 'All attendees'
        }
      ],
      personalizedRecommendations: [
        {
          title: 'Direct Potter Sourcing in Pottery Town',
          category: 'Cost Saving',
          advice: 'Buy the 1,000 diyas directly from Bengaluru Pottery Town to save 60% compared to retail stores.'
        },
        {
          title: 'Areca Palm Leaf Dinnerware',
          category: 'Food',
          advice: 'Use locally made Karnataka areca palm dinnerware to adhere to the zero-plastic promise seamlessly.'
        }
      ],
      createdAt: '2026-10-15T14:30:00Z'
    },
    expenses: [
      {
        id: 'exp-blr-1',
        eventId: 'evt-blr-diwali',
        category: 'Decoration',
        description: '1,000 clay diyas, sesame oil & cotton wicks',
        plannedAmount: 35000,
        actualAmount: 32000,
        paidAmount: 32000,
        status: 'Paid',
        date: '2026-10-20'
      },
      {
        id: 'exp-blr-2',
        eventId: 'evt-blr-diwali',
        category: 'Entertainment',
        description: 'PA audio system, stage monitors & mixer rental',
        plannedAmount: 50000,
        actualAmount: 48000,
        paidAmount: 25000,
        status: 'Partially Paid',
        date: '2026-10-22'
      },
      {
        id: 'exp-blr-3',
        eventId: 'evt-blr-diwali',
        category: 'Catering',
        description: 'Community jalebi & chai hospitality stations',
        plannedAmount: 60000,
        actualAmount: 62000,
        paidAmount: 30000,
        status: 'Partially Paid',
        date: '2026-10-25'
      }
    ],
    tasks: [
      {
        id: 'tsk-blr-1',
        eventId: 'evt-blr-diwali',
        title: 'Inspect fire extinguishers & security clearance',
        description: 'Place 4 water and CO2 fire extinguishers near diya lighting zones.',
        dueDate: '2026-11-04',
        priority: 'High',
        status: 'Pending',
        category: 'Logistics',
        daysBeforeEvent: 4
      },
      {
        id: 'tsk-blr-2',
        eventId: 'evt-blr-diwali',
        title: 'Distribute volunteer badges and stall map',
        description: 'Brief 25 youth volunteers on entry queue management.',
        dueDate: '2026-11-06',
        priority: 'Medium',
        status: 'Pending',
        category: 'Logistics',
        daysBeforeEvent: 2
      }
    ],
    vendors: [
      {
        id: 'ven-blr-1',
        eventId: 'evt-blr-diwali',
        name: 'Bengaluru Heritage Potter Co-op',
        category: 'Decoration',
        contact: {
          phone: '+91 80 2549 1122',
          contactPerson: 'Murugan Potter'
        },
        estimatedCost: 35000,
        actualCost: 32000,
        bookingStatus: 'Confirmed',
        notes: 'Supplied 1,000 deep clay oil diyas with safe non-drip bases.'
      },
      {
        id: 'ven-blr-2',
        eventId: 'evt-blr-diwali',
        name: 'Vibrant Sound & Light Staging',
        category: 'Entertainment',
        contact: {
          phone: '+91 98450 67890',
          contactPerson: 'Karthik Rao'
        },
        estimatedCost: 50000,
        actualCost: 48000,
        bookingStatus: 'Confirmed',
        notes: 'Supplying 2 wireless lapel mics, 4 corded vocal mics, and warm par can stage lights.'
      }
    ],
    recommendations: [
      {
        id: 'rec-blr-1',
        category: 'Cost Saving',
        title: 'Community Potluck Stall Hybrid',
        description: 'Sponsor the cooking gas and stall tables for resident home-chefs in exchange for fixed affordable pricing for attendees.',
        budgetImpact: 'High Savings',
        tags: ['Community', 'Food']
      }
    ]
  }
];
