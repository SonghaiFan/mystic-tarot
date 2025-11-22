# Mystic Tarot | 命运塔罗

<div align="center">
  <p>
    <em>An immersive, AI-powered Tarot reading experience.</em>
  </p>
</div>

## ✨ Features

- **🔮 AI-Powered Readings**: Leverages Google's Gemini AI to provide deep, personalized interpretations of your Tarot spreads.
- **🌌 Immersive Atmosphere**: Features cosmic particle effects, ambient background music, and audio visualization for a mystical experience.
- **🃏 Multiple Spreads**: Choose between a focused **Single Card** reading or a comprehensive **3-Card Spread** (Past, Present, Future).
- **🎴 Major & Minor Arcana**: Option to include the full deck or focus solely on the Major Arcana for significant life events.
- **🗣️ Voice Synthesis**: Listen to your reading with integrated text-to-speech capabilities.
- **⚡ Modern Tech Stack**: Built with React 19, Vite, Tailwind CSS, and Framer Motion for smooth, responsive performance.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SonghaiFan/mystic-tarot.git
   cd mystic-tarot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## 🛠️ Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run preview`: Preview the production build locally.
- `npm run generate-audio`: Generate static audio assets (requires setup).
- `npm run download-cards`: Download Tarot card images.

## 🧩 Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📄 License

This project is licensed under the MIT License.
