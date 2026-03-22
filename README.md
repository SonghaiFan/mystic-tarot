# Frank Tarot | AI Tarot Reading

# 命运塔罗 | AI 塔罗占卜

<div align="center">
  <img src="docs/teaser.png" alt="Frank Tarot teaser" width="100%" />
  <p><em>A minimal, beautifully designed AI tarot reading app with voice guidance and a full collection of tarot spreads.</em></p>
</div>

Frank Tarot is a minimal, beautifully designed AI tarot reading app built with React, Vite, and Google Gemini. It combines guided card selection, spoken readings, and a full collection of tarot spreads in a clean and immersive interface.

The app supports English and Simplified Chinese, adapts across desktop and mobile, and is structured as a static site that can be deployed to GitHub Pages.

命运塔罗是一个极简且注重审美的 AI 塔罗应用，基于 React、Vite 和 Google Gemini 构建。它把引导式抽牌、语音播报和完整的塔罗牌阵集合放进一个干净、沉浸的界面里。

应用同时适配桌面端和移动端，并以静态站点方式构建，适合部署到 GitHub Pages。

## Live Site

https://songhaifan.github.io/frank-tarot/

## Highlights

- Minimal and aesthetic interface designed for a calm tarot reading experience
- AI-generated tarot readings shaped by the selected spread, card positions, and upright or reversed orientation
- Voice guidance with ambient audio and generated speech for the final reading
- A full collection of tarot spreads, including single-card, three-card, clarity, relationship, and other themed layouts
- Bilingual interface with English and Simplified Chinese content
- Responsive presentation designed for both mobile and desktop use

## Tech Stack

- React 19
- Vite 7
- TypeScript
- Tailwind CSS 4
- Motion
- Google GenAI SDK
- i18next

## Project Structure

```text
src/
  app/                  App shell, layout, and global UI
  features/tarot/       Tarot spreads, cards, reading flow, Gemini services
  i18n/                 Localization setup and translations
public/
  audio/                Ritual and fallback audio assets
  images/cards/         Card artwork
  og/                   Social preview assets
scripts/
  export_ground_truth.py
  rectify_cards.py
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/SonghaiFan/frank-tarot.git
cd frank-tarot
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

### Run Locally

```bash
npm run dev
```

The app runs on `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Deployment Notes

This project is configured for GitHub Pages and currently uses:

- Vite base path: `/frank-tarot/`
- Canonical site URL: `https://songhaifan.github.io/frank-tarot/`

If you deploy under a different repository name or custom domain, update the base path and public metadata accordingly.

## How It Works

1. The seeker enters a question or leaves it open for general guidance.
2. The app selects or predicts an appropriate spread.
3. Cards are drawn from spread-specific pools and can appear upright or reversed.
4. Gemini generates a synthesized reading based on spread context and card meaning hints.
5. The reading can be spoken aloud and printed from the browser.

## License

MIT
