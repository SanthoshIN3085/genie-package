# Genie - Modern React Application

A modern React application built with Vite, featuring a well-organized project structure and modern development tools.

## Features

- 🎨 Material-UI components with custom theme support
- 🌓 Dark/Light mode
- 📱 Responsive layout
- 🚦 React Router for navigation
- 💾 Redux for state management
- 🎯 SCSS modules with organized structure
- ⚡ Vite for fast development and building
- 🔊 Advanced voice recognition with audio feedback
- 🎵 Howler js for seamless audio management

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts, icons)
├── components/      # Reusable UI components
├── features/        # Feature-based modules
│   ├── VoiceRecognition/  # Voice input handling
│   └── Wakeup/           # Wakeup command detection
├── pages/          # Main pages/routes
├── routes/         # Route definitions
├── hooks/          # Custom React hooks
├── styles/         # SCSS styles
├── context/        # React Context providers
├── utils/          # Utility functions
├── config/         # App configuration
├── store/          # Redux store and slices
│   ├── slices/     # Redux Toolkit slices
│   └── store.js    # Store configuration
└── types/          # TypeScript types/interfaces
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 18
- Vite 5
- Material-UI 5
- React Router 6
- Redux Toolkit
- SASS
- ESLint
- Howler js - Audio management and playback
- react-speech-recognition - Voice input processing

## Audio Features

The application includes sophisticated audio management using Howler.js:

- **Wakeup Commands**: Always-listening voice activation system
- **Audio Feedback**: Contextual audio responses for user interactions
- **Seamless Integration**: Audio automatically pauses speech recognition during playback
- **Cross-browser Compatibility**: Consistent audio behavior across different browsers
- **Performance Optimized**: Preloaded audio instances for instant playback

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
