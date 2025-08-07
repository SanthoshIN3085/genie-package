// ai response

export const aiCampaignName = "Smart loans made simple";
export const aiEventName = "Loan applicants";
export const aiCampaignDescription =
  "Tailored loan messaging highlighting benefits and an easy application process to meet individual financial needs.";

export const aiTargetList1 = "Loan applicants";
export const aiTargetList2 = "Personal loan applicants";
export const aiTargetList3 = "Loan eligibility inquiries";

export const aiPrompt1 = "Genrate a segment targeting loan seekers!";
export const aiPrompt2 =
  "Create a campaign promoting loan offers that yield high ROI";
export const aiPrompt3 = "Provide reports of my campaigns over the last month";
export const aiPrompt4 =
  "Fixed deposit interest page active. Push limited-time rates!";

export const aiAudienceResponse1 =
  "Should I include users who have recently interacted with loan-related content, applications, or campaigns?";
export const aiAudienceResponse2 =
  "Got it! Would you like to prioritize high-intent users, like those who revisited loan pages multiple times?";
export const aiAudienceResponse3 = `Done! The segment now includes actively interested loan seekers. Generate now?`;
export const aiAudienceResponse4 = `Here are the segments tailored to your requirements:`;

export const aiCommunicationResponse1 =
  "Should we personalize it based on loan types and highlight a simplified application process?";
export const aiCommunicationResponse2 =
  'Got it! Would you like to add a call-to-action, such as "Apply Now" or "Check Your Eligibility"?';
export const aiCommunicationResponse3 = `All set! The campaign is ready with tailored loan messaging and a seamless application journey. Launch now?`;
export const aiCommunicationResponse4 = `Communication ready for execution.`;

export const isAudience = [
  "Analyzing Requirements..",
  "Applying Filters..",
  "Validating Data..",
  "Generating List..",
  "Finalizing Segment..",
  "Here are the segments tailored to your requirements:",
];

export const isCommunication = [
  "Analyzing target audience..",
  "Optimizing channels..",
  "Generating communication content..",
  "Finalizing setup..",
  "Communication ready for execution.",
];

export const isAnalytics = [
  "Analyzing data across all communications..",
  "Compiling reach, engagement, conversion rates, and revenue..",
  "Optimizing performance insights..",
  "Here you go!",
];
export const analyticsListCard = [
  {
    heading: "Total reach",
    audienceCount: "12",
    potentialCount: 768250,
    reachPercentage: 75,
    description: "60% of the total target audience",
    smallText: "",
  },
  {
    heading: "Total engagement",
    audienceCount: "3.5",
    potentialCount: 1020500,
    reachPercentage: 80,
    description: "29% average engagement rate across all communications",
    smallText: "Interactions",
  },
  {
    heading: "Total conversion",
    audienceCount: "800",
    potentialCount: 895700,
    reachPercentage: 85,
    description: "6.7% overall conversion rate",
    smallText: "Conversions",
    targetListId: null,
  },
  {
    heading: "Total revenue",
    audienceCount: "25",
    reachPercentage: 85,
    description: "Based on conversions and average order value",
    totalAudience: "Seg. audience",
    additionalInfo: "Attributes count: 15",
    smallText: "",
  },
];
export const targetListCardNew = [
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
export const communicationListNew = [
  {
    id: 1,
    name: aiCampaignName,
    audienceCount: "155",
    smallText: "Conversions",
    reachRate: 45,
    summary: aiCampaignDescription,
    totalCount: 768250,
  },
];

export const aiAudience = [
  {
    message: aiAudienceResponse1,
    time: "",
    responseData: { dataRepresentation: 0, responseData: [] },
  },
  {
    message: aiAudienceResponse2,
    time: "",
    responseData: { dataRepresentation: 0, responseData: [] },
  },
  {
    message: aiAudienceResponse3,
    time: "",
    responseData: { dataRepresentation: 0, responseData: [] },
  },
  {
    message: aiAudienceResponse4,
    time: "",
    responseData: {
      dataRepresentation: 1,
      responseData: targetListCardNew,
    },
  },
];

export const aiCommunication = [
  {
    message: aiCommunicationResponse1,
    time: "",
    responseData: { dataRepresentation: 0, responseData: [] },
  },
  {
    message: aiCommunicationResponse2,
    time: "",
    responseData: { dataRepresentation: 0, responseData: [] },
  },
  {
    message: aiCommunicationResponse3,
    time: "",
    responseData: { dataRepresentation: 0, responseData: [] },
  },
  {
    message: aiCommunicationResponse4,
    time: "",
    responseData: {
      dataRepresentation: 1,
      responseData: communicationListNew,
    },
  },
];

export const promptGallery = [
  {
    id: 1,
    heading: "Credit card loan offers",
    description: "Account applications up 30% promote exclusive offers now!",
    Created_by: "Sophia Hale",
    Created_date: "Sun, 25 May, 2025",
    Module: "Audience",
    isFavorite: false,
  },
  {
    id: 2,
    heading: "Home loan offers",
    description: "Customers browsing loan options. Promote quick approvals!",
    Created_by: "Michelle Endo",
    Created_date: "Mon, 19 May, 2025",
    Module: "Audience",
    isFavorite: true,
  },
  {
    id: 3,
    heading: "Car loan options",
    description: "Fixed deposit interest page active. Push limited-time rates!",
    Created_by: "Ryan Ong",
    Created_date: "Tue, 22 Apr, 2025",
    Module: "Audience",
    isFavorite: true,
  },
  {
    id: 4,
    heading: "Education loan offers",
    description: "Fund your education with flexible loans!",
    Created_by: "Lisa Adams",
    Created_date: "Tue, 15 Apr, 2025",
    Module: "Audience",
    isFavorite: false,
  },
  {
    id: 5,
    heading: "Personal loan deals",
    description: "Instant approval on personal loans!",
    Created_by: "Alex Min",
    Created_date: "Sun, 06 Apr, 2025",
    Module: "Audience",
    isFavorite: false,
  },
  {
    id: 6,
    heading: "Travel loan offers",
    description: "Explore the world with easy financing!",
    Created_by: "Michael White",
    Created_date: "Wed, 07 May, 2025",
    Module: "Audience",
    isFavorite: false,
  },
];

export const myVariables = {
  "--bg-color": "#f5f7fc",
  "--head-band-color": "#00006e",
  "--primary-blue-color": "#0000ff", //Main Heading, icons, save btn
  "--secondary-blue-color": "#0043ff", // #004fdf; //Tab, border-top line, text box active lines, Reach bg
  "--tertiary-blue-color": "#f0f8ff", //Odd/Even bg color
  "--quaternary-blue-color": "#c2cfe3", // box border color
  "--submit-btn": "#005534",
  "--submit-btn-hover": "#026c43",
  "--menu-active": "#fd2d32", // Menu active
};
