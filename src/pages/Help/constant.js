// File: src/constants.js
export const HELP_SECTIONS = {
    HOME: 'home',
    FAQ: 'faq',
    RELEASE_NOTES: 'release-notes',
    KEYBOARD_SHORTCUTS: 'keyboard-shortcuts',
};

export const FAQ_DATA = [
    {
        id: 1,
        title: 'Create segment',
        list: [
            {
                content: 'Fusce nibh ante, aliquet sit do nibh, accumsan tempor neque.',
                details:
                    'Fusce nibh ante, aliquet sit do nibh accumsan tempor neque. Aliquam erat volutpat. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin ligula lacus in ante.',
            },
            {
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                details:
                    'Fusce nibh ante, aliquet sit do nibh accumsan tempor neque. Aliquam erat volutpat. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin ligula lacus in ante.',
            },
            {
                content: 'iverra ante consequat. Cras ac nisi ullamcorper, vestibulum augue eu, finibus nisi',
                details:
                    'Fusce nibh ante, aliquet sit do nibh accumsan tempor neque. Aliquam erat volutpat. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin ligula lacus in ante.',
            },
            {
                content: 'Nulla lacinia maximus malesuada. Sed vehicula finibus dapibus.',
                details:
                    'Fusce nibh ante, aliquet sit do nibh accumsan tempor neque. Aliquam erat volutpat. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin ligula lacus in ante.',
            },
            {
                content: 'Aenean sodales condimentum sem, quis dignissim ex blandit et. In mollis ligula elit.',
                details:
                    'Fusce nibh ante, aliquet sit do nibh accumsan tempor neque. Aliquam erat volutpat. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin ligula lacus in ante.',
            },
        ],
    },
    {
        id: 2,
        title: 'Communication creation',
        list: [
            {
                content: 'Suspendisse eget pariatur mauris. Integer lorem ligula, pharetra vehicula turpis non.',
                details:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla debitis quam consequuntur, fugiat animi temporibus facilis laboriosam natus aliquam dignissimos.',
            },
            {
                content: 'Suspendisse eget pariatur mauris. Integer lorem ligula, pharetra vehicula turpis non.',
                details:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla debitis quam consequuntur, fugiat animi temporibus facilis laboriosam natus aliquam dignissimos.',
            },
            {
                content: 'Suspendisse eget pariatur mauris. Integer lorem ligula, pharetra vehicula turpis non.',
                details:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla debitis quam consequuntur, fugiat animi temporibus facilis laboriosam natus aliquam dignissimos.',
            },
        ],
    },
];
export const FAQs = [
    {
        content: 'What is Genie by RESUL?',
        details: `Genie is your <span class='font-poppins-bold'>trusted AI assistant for real-time audience engagement</span> — designed to help you create, personalize, and maximize the impact of your communications, all from a single platform.`,
    },
    {
        content: 'How does Genie help me improve my campaigns?',
        details:
            'Genie assists you by analyzing customer data, suggesting tailored messages, optimizing delivery schedules, and automating routines — freeing up your team’s time while increasing engagement.',
    },
    {
        content: 'What kind of personalization can I do with Genie?',
        details: `Yes — you can <span class='font-poppins-bold'>design, execute, and track multichannel journeys</span> in a unified platform, ensuring a consistent and connected customer experience across all communication streams.`,
    },
    {
        content: 'Does Genie enable multichannel orchestration?',
        details:
            'Yes — you can design, execute, and track multichannel journeys in a unified platform, ensuring a consistent and connected customer experience across all communication streams.',
    },
    {
        content: 'Is Genie compliant with data regulations?',
        details:
            'Yes — Genie is designed to handle customer data safely and in compliance with regulations like GDPR, CCPA, and other data protection standards.',
    },
    {
        content: 'Do I need technical skills to use Genie?',
        details: `No — Genie is designed with marketers in mind, offering a simple and flexible platform that lets you <span class='font-poppins-bold'>build sophisticated campaigns with ease</span>.`,
    },
    {
        content: 'What kind of support is available if I need help?',
        details: `We provide extensive <span class='font-poppins-bold'>support via email, phone, and chat</span>, along with a comprehensive knowledge base of articles and guides.`,
    },
];
export const RELEASE_NOTES_DATA = [
    {
        id: 1,
        version: 'Lorem ipsum dolor sit amet',
        date: 'Mon, 17 Mar, 2025',
        summary: 'iverra ante consequat. Cras ac nisl ullamcorper, Vestibulum augue eu.',
        fixes: [
            {
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                description:
                    'Nunc eget erat in leo mattis pellentesque vitae quis purus. Vivamus consectetur ligula vitae ac sollicitudin interdum.',
            },
            {
                title: 'Curabitur vestibulum leo ac ipsum fringilla dictum.',
                description:
                    'Vivamus pharetra sem vitae orci gravida varius. Maecenas vehicula velit ductor ex sodales placerat ut ut elit. Fusce eu felis et odio ultrices convallis.',
            },
            {
                title: 'Curabitur eu sem vel justo malesuada condimentum.',
                description:
                    'Quisque porta metus vel tellus finibus egestas. Integer maximus est quis quam gravida accumsan.',
            },
        ],
    },
    {
        id: 2,
        version: 'iverra ante consequat.',
        date: 'Mon, 17 June, 2025',
        summary: 'iverra ante consequat. Cras ac nisl ullamcorper, Vestibulum augue eu.',
        fixes: [
            {
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                description:
                    'Nunc eget erat in leo mattis pellentesque vitae quis purus. Vivamus consectetur ligula vitae ac sollicitudin interdum.',
            },
            {
                title: 'Curabitur vestibulum leo ac ipsum fringilla dictum.',
                description:
                    'Vivamus pharetra sem vitae orci gravida varius. Maecenas vehicula velit ductor ex sodales placerat ut ut elit. Fusce eu felis et odio ultrices convallis.',
            },
            {
                title: 'Curabitur eu sem vel justo malesuada condimentum.',
                description:
                    'Quisque porta metus vel tellus finibus egestas. Integer maximus est quis quam gravida accumsan.',
            },
        ],
    },
    {
        id: 3,
        version: 'Cras ac nisi ullamcorper,',
        date: 'Mon, 20 Mar, 2025',
        summary: 'iverra ante consequat. Cras ac nisl ullamcorper, Vestibulum augue eu.',
        fixes: [
            {
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                description:
                    'Nunc eget erat in leo mattis pellentesque vitae quis purus. Vivamus consectetur ligula vitae ac sollicitudin interdum.',
            },
            {
                title: 'Curabitur vestibulum leo ac ipsum fringilla dictum.',
                description:
                    'Vivamus pharetra sem vitae orci gravida varius. Maecenas vehicula velit ductor ex sodales placerat ut ut elit. Fusce eu felis et odio ultrices convallis.',
            },
            {
                title: 'Curabitur eu sem vel justo malesuada condimentum.',
                description:
                    'Quisque porta metus vel tellus finibus egestas. Integer maximus est quis quam gravida accumsan.',
            },
        ],
    },
    {
        id: 4,
        version: 'Vestibulum augue eu.',
        date: 'Mon, 20 June, 2025',
        summary: 'iverra ante consequat. Cras ac nisl ullamcorper, Vestibulum augue eu.',
        fixes: [
            {
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                description:
                    'Nunc eget erat in leo mattis pellentesque vitae quis purus. Vivamus consectetur ligula vitae ac sollicitudin interdum.',
            },
            {
                title: 'Curabitur vestibulum leo ac ipsum fringilla dictum.',
                description:
                    'Vivamus pharetra sem vitae orci gravida varius. Maecenas vehicula velit ductor ex sodales placerat ut ut elit. Fusce eu felis et odio ultrices convallis.',
            },
            {
                title: 'Curabitur eu sem vel justo malesuada condimentum.',
                description:
                    'Quisque porta metus vel tellus finibus egestas. Integer maximus est quis quam gravida accumsan.',
            },
        ],
    },
];
export const RELEASE_NOTES = [
    {
        id: 1,
        version: '1.0.5',
        title: 'Communication Section (Journey Builder & Reports)',
        releaseDate: 'Mon, 02 June, 2025',
        whatsNew: [
            'The <span class=font-poppins-bold>Communication Section</span> now includes a powerful <span class=font-poppins-bold>Journey Builder</span> with branching, follow-up messages, and automated routines.',
            '<span class=font-poppins-bold>Comprehensive Reporting</span> lets you track delivery, engagement, conversions, and revenue.',
            "Allows marketers to maximize their communications' performance through data-informed decisions.",
        ],
        bugFixes: [
            'Fixed a bug causing delays when adding new nodes to journeys.',
            'Resolved report export format inaccuracies.',
        ],
        upcomingRelease: [
            'Support for custom metrics and dimensions.',
            'A/B testing within journeys.',
            'Collaborative team reviews for communications.',
        ],
    },
    {
        id: 2,
        version: '1.0.4',
        title: 'Conversation ID',
        releaseDate: 'Wed, 07 May, 2025',
        whatsNew: [
            'Each conversation is now assigned a <span class=font-poppins-bold>unique Conversation ID</span>.',
            'Easily search conversations by their IDs for faster follow-up or reuse.',
            'Helps team members collaborate more efficiently.',
        ],
        bugFixes: [
            'Fixed bug where IDs were duplicated under heavy load.',
            'Resolved inconsistencies after conversation merges.',
        ],
        upcomingRelease: [
            'Support for adding custom notes to conversations.',
            'Conversation-specific export to CSV or PDF.',
        ],
    },
    {
        id: 3,
        version: '1.0.3',
        title: 'Previous Prompts (90-Day Visibility)',
        releaseDate: 'Mon, 21 April, 2025',
        whatsNew: [
            'Access conversations for up to 90 days.',
            'Easily reuse previously constructed messages or flows.',
            'Collaborative team members can view and reuse conversations.',
        ],
        bugFixes: [
            'Fixed a bug that sometimes-displayed conversations with missing messages.',
            'Resolved pagination issues when retrieving large numbers of conversations.',
        ],
        upcomingRelease: ['Support for archiving conversations.', 'Collaborative comments and annotations.'],
    },
    {
        id: 4,
        version: '1.0.2',
        title: 'Updated Gallery',
        releaseDate: 'Tue, 20 Mar, 2025',
        whatsNew: [
            'All previously used assets (images, messages, promotions) are now available in the Gallery.',
            'Preview messages before adding them to communications.',
        ],
        bugFixes: [
            'Fixed pagination bug causing repeated media to appear.',
            'Resolved a bug that made previews load slowly.',
        ],
        upcomingRelease: ['Ability to search by keywords and tags.', 'Support for adding custom notes to each asset.'],
    },
    {
        id: 5,
        version: '1.0.1',
        title: 'Updated UI',
        releaseDate: 'Mon, 17 Mar, 2025',
        whatsNew: [
            'Redesigned and simplified UI for faster, more intuitive workflows.',
            'Enhanced menus and color scheme for a modern and clear experience.',
            'Improvement in platform load time.',
        ],
        bugFixes: ['Fixed minor UI glitches and overlapping menus.', 'Resolved pagination issues in customer lists.'],
        upcomingRelease: ['Support for custom color schemes.', 'User-specific dashboard customization.'],
    },
];

export const BETA_RELEASE_DATA = [
    {
        id: 1,
        version: 'Lorem ipsum dolor sit amet',
        date: 'Mon, 17 Mar, 2025',
        summary: 'iverra ante consequat. Cras ac nisl ullamcorper, Vestibulum augue eu.',
        fixes: [
            {
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                description:
                    'Nunc eget erat in leo mattis pellentesque vitae quis purus. Vivamus consectetur ligula vitae ac sollicitudin interdum.',
            },
            {
                title: 'Curabitur vestibulum leo ac ipsum fringilla dictum.',
                description:
                    'Vivamus pharetra sem vitae orci gravida varius. Maecenas vehicula velit ductor ex sodales placerat ut ut elit. Fusce eu felis et odio ultrices convallis.',
            },
            {
                title: 'Curabitur eu sem vel justo malesuada condimentum.',
                description:
                    'Quisque porta metus vel tellus finibus egestas. Integer maximus est quis quam gravida accumsan.',
            },
        ],
    },
    {
        id: 2,
        version: 'iverra ante consequat.',
        date: 'Mon, 17 June, 2025',
        summary: 'iverra ante consequat. Cras ac nisl ullamcorper, Vestibulum augue eu.',
        fixes: [
            {
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                description:
                    'Nunc eget erat in leo mattis pellentesque vitae quis purus. Vivamus consectetur ligula vitae ac sollicitudin interdum.',
            },
            {
                title: 'Curabitur vestibulum leo ac ipsum fringilla dictum.',
                description:
                    'Vivamus pharetra sem vitae orci gravida varius. Maecenas vehicula velit ductor ex sodales placerat ut ut elit. Fusce eu felis et odio ultrices convallis.',
            },
            {
                title: 'Curabitur eu sem vel justo malesuada condimentum.',
                description:
                    'Quisque porta metus vel tellus finibus egestas. Integer maximus est quis quam gravida accumsan.',
            },
        ],
    },
    {
        id: 3,
        version: 'Cras ac nisi ullamcorper,',
        date: 'Mon, 20 Mar, 2025',
        summary: 'iverra ante consequat. Cras ac nisl ullamcorper, Vestibulum augue eu.',
        fixes: [
            {
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                description:
                    'Nunc eget erat in leo mattis pellentesque vitae quis purus. Vivamus consectetur ligula vitae ac sollicitudin interdum.',
            },
            {
                title: 'Curabitur vestibulum leo ac ipsum fringilla dictum.',
                description:
                    'Vivamus pharetra sem vitae orci gravida varius. Maecenas vehicula velit ductor ex sodales placerat ut ut elit. Fusce eu felis et odio ultrices convallis.',
            },
            {
                title: 'Curabitur eu sem vel justo malesuada condimentum.',
                description:
                    'Quisque porta metus vel tellus finibus egestas. Integer maximus est quis quam gravida accumsan.',
            },
        ],
    },
    {
        id: 4,
        version: 'Vestibulum augue eu.',
        date: 'Mon, 20 June, 2025',
        summary: 'iverra ante consequat. Cras ac nisl ullamcorper, Vestibulum augue eu.',
        fixes: [
            {
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                description:
                    'Nunc eget erat in leo mattis pellentesque vitae quis purus. Vivamus consectetur ligula vitae ac sollicitudin interdum.',
            },
            {
                title: 'Curabitur vestibulum leo ac ipsum fringilla dictum.',
                description:
                    'Vivamus pharetra sem vitae orci gravida varius. Maecenas vehicula velit ductor ex sodales placerat ut ut elit. Fusce eu felis et odio ultrices convallis.',
            },
            {
                title: 'Curabitur eu sem vel justo malesuada condimentum.',
                description:
                    'Quisque porta metus vel tellus finibus egestas. Integer maximus est quis quam gravida accumsan.',
            },
        ],
    },
    {
        id: 5,
        version: 'Nulla lacinia maximus. ',
        date: 'Mon, 20 June, 2025',
        summary: 'iverra ante consequat. Cras ac nisl ullamcorper, Vestibulum augue eu.',
        fixes: [
            {
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                description:
                    'Nunc eget erat in leo mattis pellentesque vitae quis purus. Vivamus consectetur ligula vitae ac sollicitudin interdum.',
            },
            {
                title: 'Curabitur vestibulum leo ac ipsum fringilla dictum.',
                description:
                    'Vivamus pharetra sem vitae orci gravida varius. Maecenas vehicula velit ductor ex sodales placerat ut ut elit. Fusce eu felis et odio ultrices convallis.',
            },
            {
                title: 'Curabitur eu sem vel justo malesuada condimentum.',
                description:
                    'Quisque porta metus vel tellus finibus egestas. Integer maximus est quis quam gravida accumsan.',
            },
        ],
    },
];

// Animation variants
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.3,
            staggerChildren: 0.1,
        },
    },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 },
    },
};

export const slideVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5 },
    },
};

export const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const fixItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4 },
    },
};

const isMac = navigator?.platform?.includes('Mac');

const modifierKey = isMac ? '⌘' : 'Ctrl';
export const KEYBOARD_SHORTCUTS_DATA = [
    { action: 'New prompt', keys: [modifierKey, 'Alt', 'N'] },
    { action: 'Global search', keys: [modifierKey, 'Alt', 'S'] },
    { action: 'Expand/Collapse side pane', keys: [modifierKey, 'Alt', 'E'] },
    { action: 'Prompt gallery', keys: [modifierKey, 'Alt', 'G'] },
    { action: 'Previous prompt', keys: [modifierKey, 'Alt', 'P'] },
    { action: 'Exit Genie', keys: [modifierKey, 'Alt', 'C'] },
];
