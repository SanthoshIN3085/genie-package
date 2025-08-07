// Text Constants extracted from JSX files in src/pages directory
// This file contains all hardcoded text values for easy maintenance and internationalization

// ============================================================================
// ANALYTICS RESPONSE DATA (AnalyticsResponseData.jsx)
// ============================================================================
export const ANALYTICS_RESPONSE = {
  COMMUNICATION_PERFORMANCE_TITLE: "Communication Performance Summary for the Last Month (Consolidated):",
  PERFORMANCE_DESCRIPTION: "Last month's communications reached 60% of the target audience, with a 29% average engagement rate and a 6.7% conversion rate, generating $2.5 million in revenue. While performance is strong, refining targeting and engagement strategies can boost conversions and revenue further.",
  VIEW_ANALYTICS_BUTTON: "View analytics",
  WORKINGS_TOOLTIP: "Workings",
  LIKE_TOOLTIP: "Like",
  DISLIKE_TOOLTIP: "Dislike",
  SHARE_TOOLTIP: "share",
  COPIED_TOOLTIP: "Copied",
  COPY_TOOLTIP: "Copy",
  COPY_ID_TOOLTIP: "Copy ID",
  CHAT_ID_TOOLTIP: "Chat ID"
};

// ============================================================================
// WELCOME PAGE (Welcome.jsx)
// ============================================================================
export const WELCOME = {
  GREETING: "Hello Sophia,",
  SUBTITLE: "What can I do for you today?",
  ACTION_CARDS: {
    DATA_AUGMENT: "Data augment",
    CREATE_SEGMENT: "Create segment",
    COMMUNICATION_CREATION: "Communication creation",
    CONTENT_GENERATION: "Content generation",
    ROI_ANALYSIS: "ROI analysis"
  }
};

// ============================================================================
// GALLERY PROMPT (GalleryPrompt.jsx)
// ============================================================================
export const GALLERY_PROMPT = {
  TITLE: "Prompt gallery",
  SUBTITLE: "Smart Prompts, Smarter AI—Maximize Every Interaction.",
  TABS: {
    MY_TEMPLATES: "My prompts",
    TOP_TEMPLATES: "Top prompts",
    FAVORITE_PROMPTS: "Favorite prompts"
  },
  PROMPT_TEMPLATES: "Prompt templates"
};

// ============================================================================
// SIDE NAVIGATION (SideNav.jsx)
// ============================================================================
export const SIDE_NAV = {
  NAVIGATION_ITEMS: {
    PROMPT_GALLERY: "Prompt gallery",
    PREVIOUS_PROMPTS: "Previous prompts",
    TOKEN_USAGE: "Token usage",
    HELP: "Help",
    SETTINGS: "Settings"
  },
  NEW_PROMPT: "New prompt",
  NAV_IDS: {
    PROMPT_GALLERY: "promptgallery",
    PREVIOUS_PROMPTS: "previousprompts",
    NEW_PROMPT: "newprompt",
    CHAT_BOX: "chatbox",
    HELP: "help",
    SETTINGS: "settings",
    FAQ: "faq"
  },
  TOOLTIPS: {
    OPEN_SIDEBAR: "Open sidebar",
    CLOSE_SIDEBAR: "Close sidebar",
    EXPAND_SIDEBAR: "Expand sidebar",
    COLLAPSE_SIDEBAR: "Collapse sidebar"
  },
  TOKEN_USAGE_DISPLAY: {
    CURRENT_USAGE: "800,136 / 1,000,000",
    LIMIT_MESSAGE: "You're at 60% of your limit",
    VIEW_BUTTON: "View",
    UPGRADE_BUTTON: "Upgrade"
  },
  PREVIOUS_PROMPTS_DATA: {
    TODAY: {
      REPEAT_SNEAKER_BUYERS: "Repeat sneaker buyers",
      INACTIVE_APPAREL_BUYERS: "Inactive apparel buyers",
      ACTIVEWEAR_COLLECTION_LAUNCH: "Activewear collection launch"
    },
    YESTERDAY: {
      SEGMENT_CREATION: "Segment Creation",
      CUSTOMER_SEGMENT_GENERATION_VISIONPLUS: "Customer Segment Generation VISIONPLUS"
    },
    LAST_7_DAYS: {
      CUSTOMER_SEGMENT_GENERATION: "Customer Segment Generation",
      SEGMENT_LIST_CREATION: "Segment List Creation"
    },
    LAST_MONTH: {
      CUSTOMER_SEGMENT_CREATION_SPECIFIC_CRITERIA: "Customer Segment Creation with Specific Criteria",
      CUSTOMER_SEGMENT_GENERATION_AGE: "Customer Segment Generation Age"
    }
  },
  HELP_DROPDOWN: {
    FAQ: "FAQ",
    RELEASE_NOTES: "Release notes",
    KEYBOARD_SHORTCUTS: "Keyboard shortcuts"
  },
  SUBMENU_ACTIONS: {
    RENAME: "Rename",
    DELETE: "Delete",
    SHARE: "Share"
  },
  ALT_TEXTS: {
    TOGGLE: "Toggle",
    NEW_PROMPT: "New prompt"
  }
};

// ============================================================================
// WORKINGS (Workings.jsx)
// ============================================================================
export const WORKINGS = {
  THINKING_STATES: [
    "Thinking..",
    "Analyzing..",
    "Processing..",
    "Working.."
  ],
  WORKED_STATE: "Worked",
  WORKINGS_LOG_TITLE: "Workings Log",
  DOWNLOAD_TOOLTIP: "Download",
  COLLAPSE_TOOLTIP: "Collapse",
  EXPAND_TOOLTIP: "Expand",
  CLOSE_TOOLTIP: "Close",
  LOADING_ALT: "Loading",
  GENIE_STATUS: {
    COMPLETED: "completed",
    IS_WORKING: "is working"
  },
  WORKINGS_CONTENT: [
    "User input successfully captured",
    "Thinking",
    "Natural language components are scanned for action",
    "Analyzing",
    "Parsing has begun to identify the primary objective",
    "Intent analysis",
    "The assistant is matching the user's phrasing with known segmentation intents",
    "Creating new AI_List",
    "Attribute selection",
    "Analyzing attributes for segmentation",
    "Scrolling",
    "Attributes irrelevant to the objective have been flagged and excluded.",
    "→ Data Identification",
    "→ Attribute Mapping",
    "- [ ] Map attributes to internal systems (CRM)",
    "- [ ] Define data types and validation rules",
    "- [ ] Establish data freshness and update frequency",
    "- [ ] Assign ownership for each data domain",
    "- [ ] Mark sensitive and PII fields for encryption/compliance",
    "- [ ] Identify core customer profile attributes",
    "→ Customer Profile Data",
    "- [ ] Customer ID",
    "- [ ] Full Name",
    "- [ ] Date of Birth",
    "- [ ] Gender",
    "- [ ] Nationality",
    "- [ ] Marital Status",
    "- [ ] Contact Number",
    "- [ ] Email Address",
    "- [ ] Residential Address",
    "- [ ] Employment Status",
    "→ Account Information",
    "- [ ] Account Number",
    "- [ ] Account Type (Savings, Checking, Loan, etc.)",
    "- [ ] Account Opening Date",
    "- [ ] Account Status (Active, Dormant, Closed)",
    "- [ ] Current Balance",
    "- [ ] Overdraft Limit",
    "- [ ] Linked Products (Cards, Loans)",
    "→ Transaction History",
    "- [ ] Transaction ID",
    "- [ ] Transaction Type (Credit/Debit)",
    "- [ ] Transaction Amount",
    "- [ ] Transaction Date & Time",
    "- [ ] Merchant or Source",
    "- [ ] Channel Used (ATM, Mobile App, Branch, UPI)",
    "- [ ] Geo-location of Transaction",
    "→ KYC / Regulatory Compliance",
    "- [ ] KYC Completion Status",
    "- [ ] PAN / Tax ID",
    "- [ ] Government ID Type & Number",
    "- [ ] Address Proof Submitted",
    "- [ ] Video KYC Record (if applicable)",
    "- [ ] KYC Expiry or Review Date",
    "→ Credit & Risk Attributes",
    "- [ ] Credit Score",
    "- [ ] Credit Rating Band",
    "- [ ] Loan Repayment History",
    "- [ ] Total Outstanding Loans",
    "- [ ] Delinquency Flags",
    "- [ ] Income Bracket (self-reported or inferred)",
    "→ Fraud Monitoring Signals",
    "- [ ] Unusual Transaction Pattern Flag",
    "- [ ] High-Risk Country Access Alert",
    "- [ ] Multiple Failed Login Attempts",
    "- [ ] Blacklisted Device ID",
    "- [ ] Suspicious IP Login",
    "- [ ] AML Alert Triggered",
    "→ Behavioural & Digital Engagement",
    "- [ ] Mobile App Login Frequency",
    "- [ ] Last Login Timestamp",
    "- [ ] Product Browsing History",
    "- [ ] Device Type Used",
    "- [ ] Channel Preference (SMS, Email, WhatsApp)",
    "- [ ] Push Notification Opt-in Status",
    "Segmenting",
    "Shortlisted attributes are now queued for rule construction and condition building.",
    "Condition Framing",
    "The system is applying heuristics to define value-based, range-based, and state-based conditions as per data distribution",
    "Applying value",
    "Recalculating",
    "Updating potential audience",
    "Audience tuning",
    "Deduplication process complete — unique audience entities now stored in a temporary pool.",
    "Segment integrity validated and prepared for summary generation.",
    "Summarizing",
    "Behavioural summary",
    "Engagement frequency, purchase behaviour, time-based triggers, and key interactions are aggregated.",
    "Validating data, accuracy & completeness",
    "Updating list",
    "Segment mapping",
    "Mapping verified against earlier extraction sets for consistency.",
    "Finalizing segment",
    "Creating list in Audience > Target list > AI list",
    "Reporting & sending the readiness to the user",
    "Completed the current task"
  ],
  SECTION_HEADINGS: [
    "Thinking",
    "Analyzing",
    "Intent analysis",
    "Attribute selection",
    "Segmenting",
    "Summarizing",
    "Finalizing segment"
  ]
};

// ============================================================================
// HELP SECTION (Help/constant.js)
// ============================================================================
export const HELP = {
  FAQ: {
    TITLE: "FAQ",
    SUBTITLE: "How can I help you?",
    NO_RESULTS: "No FAQ items found matching your search.",
    ALT_TEXTS: {
      COLLAPSE: "Collapse",
      EXPAND: "Expand"
    },
    ITEMS: [
      {
        QUESTION: "What is Genie by RESUL?",
        ANSWER: "Genie is your trusted AI assistant for real-time audience engagement — designed to help you create, personalize, and maximize the impact of your communications, all from a single platform."
      },
      {
        QUESTION: "How does Genie help me improve my campaigns?",
        ANSWER: "Genie assists you by analyzing customer data, suggesting tailored messages, optimizing delivery schedules, and automating routines — freeing up your team's time while increasing engagement."
      },
      {
        QUESTION: "What kind of personalization can I do with Genie?",
        ANSWER: "Yes — you can design, execute, and track multichannel journeys in a unified platform, ensuring a consistent and connected customer experience across all communication streams."
      },
      {
        QUESTION: "Does Genie enable multichannel orchestration?",
        ANSWER: "Yes — you can design, execute, and track multichannel journeys in a unified platform, ensuring a consistent and connected customer experience across all communication streams."
      },
      {
        QUESTION: "Is Genie compliant with data regulations?",
        ANSWER: "Yes — Genie is designed to handle customer data safely and in compliance with regulations like GDPR, CCPA, and other data protection standards."
      },
      {
        QUESTION: "Do I need technical skills to use Genie?",
        ANSWER: "No — Genie is designed with marketers in mind, offering a simple and flexible platform that lets you build sophisticated campaigns with ease."
      },
      {
        QUESTION: "What kind of support is available if I need help?",
        ANSWER: "We provide extensive support via email, phone, and chat, along with a comprehensive knowledge base of articles and guides."
      }
    ]
  },
  KEYBOARD_SHORTCUTS: {
    TITLE: "Keyboard shortcuts",
    SUBTITLE: "For faster, more efficient access"
  },
  RELEASE_NOTES: {
    TITLE: "Release notes",
    SUBTITLE: "See what's happening",
    RELEASE_PREFIX: "Release",
    SECTIONS: {
      WHATS_NEW: "What's New",
      BUG_FIXES: "Bug Fixes",
      COMING_SOON: "Coming Soon"
    }
  },
  RELEASE_NOTES: [
    {
      VERSION: "1.0.5",
      TITLE: "Communication Section (Journey Builder & Reports)",
      RELEASE_DATE: "Mon, 02 June, 2025",
      WHATS_NEW: [
        "The Communication Section now includes a powerful Journey Builder with branching, follow-up messages, and automated routines.",
        "Comprehensive Reporting lets you track delivery, engagement, conversions, and revenue.",
        "Allows marketers to maximize their communications' performance through data-informed decisions."
      ],
      BUG_FIXES: [
        "Fixed a bug causing delays when adding new nodes to journeys.",
        "Resolved report export format inaccuracies."
      ],
      UPCOMING_RELEASE: [
        "Support for custom metrics and dimensions.",
        "A/B testing within journeys.",
        "Collaborative team reviews for communications."
      ]
    },
    {
      VERSION: "1.0.4",
      TITLE: "Conversation ID",
      RELEASE_DATE: "Wed, 07 May, 2025",
      WHATS_NEW: [
        "Each conversation is now assigned a unique Conversation ID.",
        "Easily search conversations by their IDs for faster follow-up or reuse.",
        "Helps team members collaborate more efficiently."
      ],
      BUG_FIXES: [
        "Fixed bug where IDs were duplicated under heavy load.",
        "Resolved inconsistencies after conversation merges."
      ],
      UPCOMING_RELEASE: [
        "Support for adding custom notes to conversations.",
        "Conversation-specific export to CSV or PDF."
      ]
    },
    {
      VERSION: "1.0.3",
      TITLE: "Previous Prompts (90-Day Visibility)",
      RELEASE_DATE: "Mon, 21 April, 2025",
      WHATS_NEW: [
        "Access conversations for up to 90 days.",
        "Easily reuse previously constructed messages or flows.",
        "Collaborative team members can view and reuse conversations."
      ],
      BUG_FIXES: [
        "Fixed a bug that sometimes-displayed conversations with missing messages.",
        "Resolved pagination issues when retrieving large numbers of conversations."
      ],
      UPCOMING_RELEASE: [
        "Support for archiving conversations.",
        "Collaborative comments and annotations."
      ]
    },
    {
      VERSION: "1.0.2",
      TITLE: "Updated Gallery",
      RELEASE_DATE: "Tue, 20 Mar, 2025",
      WHATS_NEW: [
        "All previously used assets (images, messages, promotions) are now available in the Gallery.",
        "Preview messages before adding them to communications."
      ],
      BUG_FIXES: [
        "Fixed pagination bug causing repeated media to appear.",
        "Resolved a bug that made previews load slowly."
      ],
      UPCOMING_RELEASE: [
        "Ability to search by keywords and tags.",
        "Support for adding custom notes to each asset."
      ]
    },
    {
      VERSION: "1.0.1",
      TITLE: "Updated UI",
      RELEASE_DATE: "Mon, 17 Mar, 2025",
      WHATS_NEW: [
        "Redesigned and simplified UI for faster, more intuitive workflows.",
        "Enhanced menus and color scheme for a modern and clear experience.",
        "Improvement in platform load time."
      ],
      BUG_FIXES: [
        "Fixed minor UI glitches and overlapping menus.",
        "Resolved pagination issues in customer lists."
      ],
      UPCOMING_RELEASE: [
        "Support for custom color schemes.",
        "User-specific dashboard customization."
      ]
    }
  ],
  KEYBOARD_SHORTCUTS: [
    { ACTION: "New prompt", KEYS: ["Ctrl", "Alt", "N"] },
    { ACTION: "Global search", KEYS: ["Ctrl", "Alt", "S"] },
    { ACTION: "Expand/Collapse side pane", KEYS: ["Ctrl", "Alt", "E"] },
    { ACTION: "Prompt gallery", KEYS: ["Ctrl", "Alt", "G"] },
    { ACTION: "Previous prompt", KEYS: ["Ctrl", "Alt", "P"] },
    { ACTION: "Exit Genie", KEYS: ["Ctrl", "Alt", "C"] }
  ]
};

// ============================================================================
// SETTINGS SECTION (Settings/constant.js)
// ============================================================================
export const SETTINGS = {
  BILLING_SIDEBAR: [
    { NAME: "Overview" },
    { NAME: "Payment methods" },
    { NAME: "Billing history" }
  ]
};

// ============================================================================
// MESSAGE COMPONENT (Message.jsx)
// ============================================================================
export const MESSAGE = {
  TOOLTIPS: {
    CHAT_ID: "Chat ID",
    COPY_ID: "Copy ID",
    COPIED_ID: "Copied",
    COPY: "Copy",
    COPIED: "Copied"
  },
  ALT_TEXTS: {
    COPY: "copy"
  },
  MESSAGE_TYPES: {
    USER: "user",
    GENIE: "genie"
  },
  GENERATE_CARDS: {
    AUDIENCE: "audience",
    COMMUNICATION: "communication"
  }
};

// ============================================================================
// RESPONSE DATA (ResponseData.jsx)
// ============================================================================
export const RESPONSE_DATA = {
  TOOLTIPS: {
    WORKINGS: "Workings",
    LIKE: "Like",
    DISLIKE: "Dislike",
    EDIT: "Edit"
  },
  ALT_TEXTS: {
    WORKINGS: "workings"
  },
  LABELS: {
    POTENTIAL_AUDIENCE: "Potential audience",
    PROJECTED_REACH: "Projected reach"
  },
  DROPDOWN_OPTIONS: [
    "Request for approval",
    "Insights",
    "Data augmentation"
  ]
};

// ============================================================================
// HOME PAGE (Home.jsx)
// ============================================================================
export const HOME = {
  NAV_ITEMS: {
    NEW_PROMPT: "newprompt",
    PROMPT_GALLERY: "promptgallery",
    PREVIOUS_PROMPTS: "previousprompts",
    SETTINGS: "settings",
    HELP: "help",
    CHAT_BOX: "chatbox"
  }
};

// ============================================================================
// COMMON UI TEXT
// ============================================================================
export const COMMON_UI = {
  BUTTONS: {
    VIEW: "View",
    UPGRADE: "Upgrade",
    RENAME: "Rename",
    DELETE: "Delete",
    SHARE: "Share"
  },
  TOOLTIPS: {
    WORKINGS: "Workings",
    LIKE: "Like",
    DISLIKE: "Dislike",
    SHARE: "share",
    COPY: "Copy",
    COPIED: "Copied",
    COPY_ID: "Copy ID",
    CHAT_ID: "Chat ID"
  },
  STATUS: {
    THINKING: "Thinking..",
    ANALYZING: "Analyzing..",
    PROCESSING: "Processing..",
    WORKING: "Working..",
    WORKED: "Worked"
  }
};



// ============================================================================
// PREVIOUS PROMPT (PreviousPrompt.jsx)
// ============================================================================
export const PREVIOUS_PROMPT = {
  MONTHS: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  DAYS: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  SHORT_MONTHS: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ],
  CATEGORIES: {
    TODAY: "Today",
    YESTERDAY: "Yesterday",
    LAST_WEEK: "Last week",
    TWO_WEEKS_AGO: "2 weeks ago",
    THREE_WEEKS_AGO: "3 weeks ago",
    LAST_MONTH: "Last month"
  },
  TOOLTIPS: {
    EXPAND: "Expand"
  },
  ALT_TEXTS: {
    EXPAND: "Expand"
  }
};

// ============================================================================
// EXPORT ALL CONSTANTS
// ============================================================================
export default {
  ANALYTICS_RESPONSE,
  WELCOME,
  GALLERY_PROMPT,
  SIDE_NAV,
  WORKINGS,
  HELP,
  SETTINGS,
  MESSAGE,
  RESPONSE_DATA,
  HOME,
  COMMON_UI,
  PREVIOUS_PROMPT
}; 