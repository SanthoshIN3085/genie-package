import { isMacBook13Inch, getUserDateTimeFormat } from "../utils/index";

const isRetail = false;

export const aiCampaignName = "Smart loans made simple";

export const aiTargetList1 = "Loan applicants";
export const aiTargetList2 = "Personal loan applicants";
export const aiTargetList3 = "Loan eligibility inquiries";

export const aiPrompt1 = "Genrate a segment targeting loan seekers!";
export const aiPrompt2 =
  "Create a campaign promoting loan offers that yield high ROI";
export const aiPrompt3 = "Provide reports of my campaigns over the last month";
export const aiPrompt4 =
  "Fixed deposit interest page active. Push limited-time rates!";

export const getRecommendedPrompts = (domain) => {
  return [aiPrompt1, aiPrompt2, aiPrompt3];
};
export const communicationListCard = (communicationName, domain) => {
  const aiCampaignDescription =
    "Tailored loan messaging highlighting benefits and an easy application process to meet individual financial needs.";

  return [
    {
      heading: communicationName,
      audienceCount: "76",
      potentialCount: 768250,
      reachPercentage: 75,
      description: aiCampaignDescription,
      totalAudience: "Seg. audience",
      smallText: "",
    },
  ];
};

export const targetListCard = (domain) => {
  return [
    {
      heading: aiTargetList1,
      audienceCount: "76",
      potentialCount: 2677048,
      reachPercentage: 75,
      description:
        "A well-defined segment with 75% reach, optimized for SMS and email, ensuring impact when sent at peak engagement times.",
      totalAudience: "Seg. audience",
      additionalInfo: "Attributes count : 15",
      smallText: "Conversions",
    },
    {
      heading: aiTargetList2,
      audienceCount: "1",
      potentialCount: 1020500,
      reachPercentage: 80,
      description:
        "An 80% reach segment, optimized for push notifications and email, delivering higher conversions at the best engagement time.",
      totalAudience: "Seg. audience",
      additionalInfo: "Attributes count : 15",
      smallText: "Interactions",
    },
    {
      heading: aiTargetList3,
      audienceCount: "85",
      potentialCount: 895700,
      reachPercentage: 85,
      description:
        "An 85% reach segment, optimized for WhatsApp and SMS, ensuring precise targeting and higher ROI at peak hours.",
      totalAudience: "Seg. audience",
      additionalInfo: "Attributes count : 15",
      smallText: "Conversions",
    },
  ];
};
export const targetListCardNew = (domain) => {
  return [
    {
      id: 1,
      listid: 363332,
      name: aiTargetList1,
      reachRate: 75,
      audienceCount: "76",
      smallText: "Conversions",
      summary:
        "A well-defined segment with 75% reach, optimized for SMS and email, ensuring impact when sent at peak engagement times.",
      totalCount: 2677048,
    },
    {
      id: 2,
      listid: 363332,
      name: aiTargetList2,
      reachRate: 80,
      audienceCount: "1",
      smallText: "",
      summary:
        "An 80% reach segment, optimized for push notifications and email, delivering higher conversions at the best engagement time.",
      totalCount: 1020500,
    },
    {
      id: 3,
      listid: 363332,
      name: aiTargetList3,
      audienceCount: "85",
      smallText: "Conversions",
      reachRate: 85,
      summary:
        "An 85% reach segment, optimized for WhatsApp and SMS, ensuring precise targeting and higher ROI at peak hours.",
      totalCount: 895700,
    },
  ];
};

export const communicationListNew = (communicationName, domain) => {
  return [
    {
      id: 1,
      name: aiCampaignName,
      audienceCount: "76",
      smallText: "Conversions",
      reachRate: 75,
      summary: aiCampaignDescription,
      totalCount: 768250,
    },
  ];
};

export const selectedChatMessagesAud1 = [
  {
    id: 1,
    user: [
      {
        text: "create a segment of repeat sneaker buyers for targeted campaigns",
        time: "Tue, 29 Apr, 2025 07:05",
      },
    ],
    genieAI: [
      {
        message:
          'Sure! Should we define "repeat buyers" based on their purchase history?',
        time: "Tue, 29 Apr, 2025 07:05",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },
  {
    id: 2,
    user: [
      {
        text: "Yes, include those who bought sneakers at least once in the last year.",
        time: "Tue, 29 Apr, 2025 07:06",
      },
    ],
    genieAI: [
      {
        message:
          "Got it! Your segment now includes sneaker buyers with at least one purchase in the past year. Ready to save?",
        time: "Tue, 29 Apr, 2025 07:06",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },

  {
    id: 3,
    user: [
      {
        text: "Yes proceed.",
        time: "Tue, 29 Apr, 2025 07:07",
      },
    ],
    genieAI: [
      {
        message: "Here are the segments tailored to your requirements:",
        time: "Tue, 29 Apr, 2025 07:07",
        responseData: {
          dataRepresentation: 1,
          analyzeMessages: [
            // { id: 1, text: 'Analyzing Requirements..' },
            // { id: 2, text: 'Applying Filters..' },
            // { id: 3, text: 'Validating Data..' },
            // { id: 4, text: 'Generating List..' },
            // { id: 5, text: 'Finalizing Segment..' },
            {
              id: 6,
              text: "Here are the segments tailored to your requirements:",
            },
          ],
          responseData: [
            {
              id: 1,
              listid: 363333,
              name: "Sneaker Enthusiasts",
              reachRate: 78,
              audienceCount: "88",
              smallText: "Conversions",
              summary:
                "This segment demonstrates high engagement potential, achieving 90% mobile reach and significant email penetration, offering a prime opportunity for targeted, multi-channel marketing campaigns.",
              totalCount: 144719,
            },
          ],
        },
      },
    ],
  },
];

export const selectedChatMessagesAud2 = [
  {
    id: 1,
    user: [
      {
        text: "Hey, create a segment of inactive apparel buyers for a re-engagement campaign.",
        time: "Tue, 29 Apr, 2025 07:05",
      },
    ],
    genieAI: [
      {
        message:
          'Sure! Should we define "inactive" based on the last purchase date?',
        time: "Tue, 29 Apr, 2025 07:05",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },
  {
    id: 2,
    user: [
      {
        text: "Yes, include those who haven’t bought any apparel in the last six months.",
        time: "Tue, 29 Apr, 2025 07:05",
      },
    ],
    genieAI: [
      {
        message:
          "Got it! Your segment now includes shoppers with no apparel purchases in the past six months. Ready to save?",
        time: "Tue, 29 Apr, 2025 07:06",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },

  {
    id: 3,
    user: [
      {
        text: "Yes proceed.",
        time: "Tue, 29 Apr, 2025 07:06",
      },
    ],
    genieAI: [
      {
        message: "Here are the segments tailored to your requirements:",
        time: "Tue, 29 Apr, 2025 07:06",
        responseData: {
          dataRepresentation: 1,
          analyzeMessages: [
            // { id: 1, text: 'Analyzing Requirements..' },
            // { id: 2, text: 'Applying Filters..' },
            // { id: 3, text: 'Validating Data..' },
            // { id: 4, text: 'Generating List..' },
            // { id: 5, text: 'Finalizing Segment..' },
            {
              id: 6,
              text: "Here are the segments tailored to your requirements:",
            },
          ],
          responseData: [
            {
              id: 1,
              listid: 363334,
              name: "Dormant Fashion Shoppers",
              reachRate: 73,
              audienceCount: "95",
              smallText: "Conversions",
              summary:
                "Rekindle interest with personalized discounts, new collection previews, and loyalty rewards.",
              totalCount: 144719,
            },
          ],
        },
      },
    ],
  },
];

export const selectedChatMessagesAud3 = [
  {
    id: 1,
    user: [
      {
        text: "Hey, create a segment for launching our new activewear collection.",
        time: "Tue, 29 Apr, 2025 07:05",
      },
    ],
    genieAI: [
      {
        message:
          "Sure! Should we target buyers who have purchased similar products before?",
        time: "Tue, 29 Apr, 2025 07:05",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },
  {
    id: 2,
    user: [
      {
        text: "Yes, include those who bought sportswear or athleisure in the last six months.",
        time: "Tue, 29 Apr, 2025 07:06",
      },
    ],
    genieAI: [
      {
        message: "Got it! Do you want to filter by location?",
        time: "Tue, 29 Apr, 2025 07:06",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },
  {
    id: 3,
    user: [
      {
        text: "Yes, include only buyers from metro cities.",
        time: "Tue, 29 Apr, 2025 07:07",
      },
    ],
    genieAI: [
      {
        message: "Noted! Should we also add an age range?",
        time: "Tue, 29 Apr, 2025 07:07",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },
  {
    id: 4,
    user: [
      {
        text: "Yes, target those aged 25-40.",
        time: "Tue, 29 Apr, 2025 07:07",
      },
    ],
    genieAI: [
      {
        message:
          "Done! The segment includes sportswear buyers from metro cities, aged 25-40. Ready to save?",
        time: "Tue, 29 Apr, 2025 07:07",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },

  {
    id: 5,
    user: [
      {
        text: "Yes proceed.",
        time: "Tue, 29 Apr, 2025 07:07",
      },
    ],
    genieAI: [
      {
        message: "Here are the segments tailored to your requirements:",
        time: "Tue, 29 Apr, 2025 07:07",
        responseData: {
          dataRepresentation: 1,
          analyzeMessages: [
            // { id: 1, text: 'Analyzing Requirements..' },
            // { id: 2, text: 'Applying Filters..' },
            // { id: 3, text: 'Validating Data..' },
            // { id: 4, text: 'Generating List..' },
            // { id: 5, text: 'Finalizing Segment..' },
            {
              id: 6,
              text: "Here are the segments tailored to your requirements:",
            },
          ],
          responseData: [
            {
              id: 1,
              listid: 363334,
              name: "Metro fit trendsetters",
              reachRate: 81,
              audienceCount: "95",
              smallText: "Conversions",
              summary:
                "Rekindle interest with personalized discounts, new collection previews, and loyalty rewards.",
              totalCount: 144719,
            },
          ],
        },
      },
    ],
  },
];

export const selectedChatMessagesCom1 = [
  {
    id: 1,
    user: [
      {
        text: "Hey Genie, create a campaign to bring back shoppers who haven’t purchased in a while.",
        time: "Tue, 29 Apr, 2025 07:05",
      },
    ],
    genieAI: [
      {
        message:
          'Sure! Should we define "lapsed" as those with no purchases in the last 90 days?',
        time: "Tue, 29 Apr, 2025 07:05",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },
  {
    id: 2,
    user: [
      {
        text: "Yes, and let’s send them a personalized offer.",
        time: "Tue, 29 Apr, 2025 07:06",
      },
    ],
    genieAI: [
      {
        message: "Done! Ready to launch?",
        time: "Tue, 29 Apr, 2025 07:06",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },

  {
    id: 3,
    user: [
      {
        text: "Yes proceed.",
        time: "Tue, 29 Apr, 2025 07:07",
      },
    ],
    genieAI: [
      {
        message: "Communication campaign created successfully!",
        isCommunication: true,
        time: "Tue, 29 Apr, 2025 07:07",
        responseData: {
          dataRepresentation: 1,
          analyzeMessages: [
            // { id: 1, text: 'Analyzing target audience..' },
            // { id: 2, text: 'Optimizing channels..' },
            // { id: 3, text: 'Generating communication content..' },
            // { id: 4, text: 'Finalizing setup..' },
            { id: 5, text: "Communication ready for execution." },
          ],
          responseData: [
            {
              id: 1,
              listid: 363333,
              name: "Reconnect & Reward",
              reachRate: 70,
              audienceCount: "85",
              smallText: "Conversions",
              summary:
                "Re-engage inactive buyers with personalized offers, reminding them of what they love and encouraging repeat purchases.",
              totalCount: 144719,
            },
          ],
        },
      },
    ],
  },
];

export const selectedChatMessagesCom2 = [
  {
    id: 1,
    user: [
      {
        text: "I need a campaign to promote a limited-time discount on jackets.",
        time: "Tue, 29 Apr, 2025 07:05",
      },
    ],
    genieAI: [
      {
        message:
          "Got it! Should we target past jacket buyers or all apparel shoppers?",
        time: "Tue, 29 Apr, 2025 07:05",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },
  {
    id: 2,
    user: [
      {
        text: "Let’s focus on those who bought jackets in the past year.",
        time: "Tue, 29 Apr, 2025 07:06",
      },
    ],
    genieAI: [
      {
        message: "Great! Ready to launch?",
        time: "Tue, 29 Apr, 2025 07:06",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },

  {
    id: 3,
    user: [
      {
        text: "Yes proceed.",
        time: "Tue, 29 Apr, 2025 07:07",
      },
    ],
    genieAI: [
      {
        message: "Communication campaign created successfully!",
        isCommunication: true,
        time: "Tue, 29 Apr, 2025 07:07",
        responseData: {
          dataRepresentation: 1,
          analyzeMessages: [
            // { id: 1, text: 'Analyzing target audience..' },
            // { id: 2, text: 'Optimizing channels..' },
            // { id: 3, text: 'Generating communication content..' },
            // { id: 4, text: 'Finalizing setup..' },
            { id: 5, text: "Communication ready for execution." },
          ],
          responseData: [
            {
              id: 1,
              listid: 363334,
              name: "Style Rush",
              reachRate: 80,
              audienceCount: "120",
              smallText: "Conversions",
              summary:
                "Drive urgency with time-limited discounts on trending apparel, boosting conversions among deal-seekers.",
              totalCount: 144719,
            },
          ],
        },
      },
    ],
  },
];

export const selectedChatMessagesCom3 = [
  {
    id: 1,
    user: [
      {
        text: "I want to create buzz for our new sneaker collection.",
        time: "Tue, 29 Apr, 2025 07:05",
      },
    ],
    genieAI: [
      {
        message: "Should we target sneaker buyers or a broader audience?",
        time: "Tue, 29 Apr, 2025 07:05",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },
  {
    id: 2,
    user: [
      {
        text: "Focus on active sneaker buyers from metro cities, aged 18-35.",
        time: "Tue, 29 Apr, 2025 07:06",
      },
    ],
    genieAI: [
      {
        message: "Done! Ready to go live?",
        time: "Tue, 29 Apr, 2025 07:06",
        responseData: {
          dataRepresentation: 0,
          responseData: [],
        },
      },
    ],
  },

  {
    id: 3,
    user: [
      {
        text: "Yes proceed.",
        time: "Tue, 29 Apr, 2025 07:07",
      },
    ],
    genieAI: [
      {
        message: "Communication campaign created successfully!",
        isCommunication: true,
        time: "Tue, 29 Apr, 2025 07:07",
        responseData: {
          dataRepresentation: 1,
          analyzeMessages: [
            // { id: 1, text: 'Analyzing target audience..' },
            // { id: 2, text: 'Optimizing channels..' },
            // { id: 3, text: 'Generating communication content..' },
            // { id: 4, text: 'Finalizing setup..' },
            { id: 5, text: "Communication ready for execution." },
          ],
          responseData: [
            {
              id: 1,
              listid: 363334,
              name: "Fresh kicks drop",
              reachRate: 78,
              audienceCount: "90",
              smallText: "Conversions",
              summary:
                "Target sneaker enthusiasts in metro cities, highlighting the latest designs and early-bird access for loyal customers.",
              totalCount: 144719,
            },
          ],
        },
      },
    ],
  },
];

export const selectedChatMessagesAnly1 = [
  {
    id: 1,
    user: [
      {
        text: "Casual Wear (T-Shirts) Performance Summary.",
        time: "Tue, 29 Apr, 2025 07:05",
      },
    ],
    isForAnaytics: true,
    headerText:
      "Communication Performance Summary for the Last Month (Consolidated):",
    footerText:
      "Casual wear promotions saw high engagement and conversion rates, suggesting strong interest. A/B testing for creatives and limited-time offers can further optimize results",
    genieAI: [
      {
        // message:
        //     'Confirming the creation of a segment for users with the following criteria: age equal to 20, gender including all possible values, and location within the specified metro cities. Consider refining the location criteria to specific metro cities or adding other relevant attributes for more precise segmentation.',
        time: "Tue, 29 Apr, 2025 07:05",
        responseData: {
          dataRepresentation: 1,
          analyzeMessages: [
            { id: 1, text: "Analyzing data across all communications.." },
            {
              id: 2,
              text: "Compiling reach, engagement, conversion rates, and revenue..",
            },
            { id: 3, text: "Optimizing performance insights.." },
            { id: 4, text: "Here you go!" },
          ],
          responseData: [
            {
              id: 1,
              listid: null,
              name: "Total reach",
              audienceCount: "9",
              isValMillion: true,
              summary: "60% of the target audience engaged",
              totalCount: 2677048,
              smallText: "",
            },
            {
              id: 2,
              listid: null,
              name: "Total engagement",
              audienceCount: "3.2",
              summary: "35% engagement rate across all t-shirt promotions",
              totalCount: 1020500,
              isValMillion: true,
              smallText: "",
            },
            {
              id: 3,
              listid: null,
              name: "Total conversion",
              audienceCount: "750",
              summary: "7% overall conversion rate",
              totalCount: 895700,
            },
            {
              id: 3,
              listid: null,
              name: "Total revenue generated",
              audienceCount: "20",
              summary:
                "Revenue based on strong conversions and average order value",
              totalCount: 895700,
              isValMillion: true,
              smallText: "",
            },
          ],
        },
      },
    ],
  },
];

export const selectedChatMessagesAnly2 = [
  {
    id: 1,
    user: [
      {
        text: "Summarize the performance of my past two months casual wear campaigns, particularly for t-shirts.",
        time: "Tue, 29 Apr, 2025 07:05",
      },
    ],
    isForAnaytics: true,
    footerText:
      'The campaign performed well but could benefit from increased personalization and urgency-based messaging (e.g., "Limited Stock Left!").',
    genieAI: [
      {
        // message:
        //     'Confirming the creation of a segment for users with the following criteria: age equal to 20, gender including all possible values, and location within the specified metro cities. Consider refining the location criteria to specific metro cities or adding other relevant attributes for more precise segmentation.',
        time: "Tue, 29 Apr, 2025 07:05",
        responseData: {
          dataRepresentation: 1,
          analyzeMessages: [
            { id: 1, text: "Analyzing data across all communications.." },
            {
              id: 2,
              text: "Compiling reach, engagement, conversion rates, and revenue..",
            },
            { id: 3, text: "Optimizing performance insights.." },
            { id: 4, text: "Here you go!" },
          ],
          responseData: [
            {
              id: 1,
              listid: null,
              name: "Total reach",
              audienceCount: "6.5",
              isValMillion: true,
              summary: "48% of the target audience engaged",
              totalCount: 2677048,
              smallText: "",
            },
            {
              id: 2,
              listid: null,
              name: "Total engagement",
              audienceCount: "2.5",
              summary: "28% engagement rate",
              totalCount: 1020500,
              isValMillion: true,
              smallText: "",
            },
            {
              id: 3,
              listid: null,
              name: "Total conversion",
              audienceCount: "540",
              summary: "6.5% conversion rate",
              totalCount: 895700,
            },
            {
              id: 3,
              listid: null,
              name: "Total revenue generated",
              audienceCount: "18",
              summary: "Revenue driven by high-ticket winter products",
              totalCount: 895700,
              isValMillion: true,
              smallText: "",
            },
          ],
        },
      },
    ],
  },
];

export const selectedChatMessagesAnly3 = [
  {
    id: 1,
    user: [
      {
        text: "Analyze the engagement and conversions from my last months formal wear marketing efforts.",
        time: "Tue, 29 Apr, 2025 07:05",
      },
    ],
    isForAnaytics: true,
    footerText:
      "Formal wear promotions yielded high conversions, likely due to well-targeted audiences. Retargeting past buyers with loyalty incentives could further boost sales",
    genieAI: [
      {
        // message:
        //     'Confirming the creation of a segment for users with the following criteria: age equal to 20, gender including all possible values, and location within the specified metro cities. Consider refining the location criteria to specific metro cities or adding other relevant attributes for more precise segmentation.',
        time: "Tue, 29 Apr, 2025 07:05",
        responseData: {
          dataRepresentation: 1,
          analyzeMessages: [
            { id: 1, text: "Analyzing data across all communications.." },
            {
              id: 2,
              text: "Compiling reach, engagement, conversion rates, and revenue..",
            },
            { id: 3, text: "Optimizing performance insights.." },
            { id: 4, text: "Here you go!" },
          ],
          responseData: [
            {
              id: 1,
              listid: null,
              name: "Total reach",
              audienceCount: "7",
              isValMillion: true,
              summary: "50% of the target audience engaged",
              totalCount: 2677048,
              smallText: "",
            },
            {
              id: 2,
              listid: null,
              name: "Total engagement",
              audienceCount: "2.7",
              summary: "30% engagement rate",
              totalCount: 1020500,
              isValMillion: true,
              smallText: "",
            },
            {
              id: 3,
              listid: null,
              name: "Total conversion",
              audienceCount: "680",
              summary: "6.8% conversion rate",
              totalCount: 895700,
            },
            {
              id: 3,
              listid: null,
              name: "Total revenue generated",
              audienceCount: "22",
              summary: "Revenue based on premium pricing and strong demand",
              totalCount: 895700,
              isValMillion: true,
              smallText: "",
            },
          ],
        },
      },
    ],
  },
];
export const handleFloatDate = (e, divRef) => {
  if (!divRef.current) return;

  const timeElements = divRef.current.querySelectorAll(".time");
  const floatingDate = divRef.current.querySelector(".floating-date");

  let nearestTime = null;
  let nearestOffset = Infinity;

  const containerTop = divRef.current.getBoundingClientRect().top + 60;

  timeElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const offset = Math.abs(rect.top - containerTop);

    if (offset < nearestOffset) {
      nearestOffset = offset;
      nearestTime = el;
    }
  });

  if (nearestTime) {
    const rawText = nearestTime.textContent.trim();
    const datePart = rawText.split(" ").slice(1, 4).join(" ").replace(",", "");
    const parsedDate = new Date(datePart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(parsedDate);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = today - targetDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    let label;
    if (diffDays === 0) {
      label = "Today";
    } else if (diffDays === 1) {
      label = "Yesterday";
    } else {
      label = getUserDateTimeFormat(parsedDate, "formatDate");
    }

    // Show the floating date
    if (floatingDate) {
      floatingDate.classList.remove("hide-date");
      floatingDate.classList.add("show-date");

      // Clear any existing timeout
      if (floatingDate.hideTimeout) {
        clearTimeout(floatingDate.hideTimeout);
      }

      // Set new timeout to hide after 2 seconds of no scrolling
      floatingDate.hideTimeout = setTimeout(() => {
        floatingDate.classList.remove("show-date");
        floatingDate.classList.add("hide-date");
      }, 1500);
    }

    return label;
  } else {
    console.warn("No .time element found");
    return null;
  }
};

export const getPositions = () => {
  const icon = document.querySelector(".workings-icon");
  const wrapper = document.querySelector(".working-wrapper");
  const workings = document.querySelector(".workings");
  const isMulticard = document.querySelector(".genie-card.singlecard");

  if (icon && wrapper) {
    const rect = icon.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const offset =
      screenWidth >= 1600
        ? 637
        : isMacBook13Inch()
        ? 402
        : isMulticard
        ? 637
        : 402;
    wrapper.style.right = `${screenWidth - rect.left - offset}px`;

    const iconCenterY = rect.top + rect.height / 2;
    const workingsRect = workings.getBoundingClientRect();
    const bottomValue = workingsRect.bottom - iconCenterY;
    workings.style.setProperty(
      "--workings-after-bottom",
      `${bottomValue - 8}px`
    );
  }

  const screenWidth = window.innerWidth;
  if (screenWidth >= 1600) {
    workings.style.setProperty("--workings-width", "580px");
  } else if (isMacBook13Inch()) {
    workings.style.setProperty("--workings-width", "345px");
  } else if (isMulticard) {
    workings.style.setProperty("--workings-width", "580px");
  } else {
    workings.style.setProperty("--workings-width", "345px");
  }
};

const generateKeyDate = (daysAgo = 7) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};
const date1 = generateKeyDate(7);
const date2 = generateKeyDate(14);

export const previousPromptsList = [
  {
    Today: [
      {
        spaceidname: "Repeat sneaker buyers",
        spaceid: 1,
      },
      {
        spaceidname: "Inactive apparel buyers",
        spaceid: 2,
      },
      {
        spaceidname: "Activewear collection launch",
        spaceid: 3,
      },
    ],
    Yesterday: [
      {
        spaceidname: "Segment Creation",
        spaceid: 1,
      },
    ],
    [date1]: [
      {
        spaceidname: "Customer Segment Generation",
        spaceid: 2,
      },
      {
        spaceidname: "Segment List Creation",
        spaceid: 1,
      },
    ],
    [date2]: [
      {
        spaceidname: "Customer Segment Creation with Specific Criteria",
        spaceid: 2,
      },
      {
        spaceidname: "Customer Segment Generation Age",
        spaceid: 1,
      },
    ],
  },
];
