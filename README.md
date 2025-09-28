# Landing Page

A simple landing page built with the T3 Stack.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your landing page.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **ESLint & Prettier** - Code formatting and linting

## Project Structure

```
src/
├── app/
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Landing page
└── styles/
    └── globals.css   # Global styles
```

## Customization

- Edit `src/app/page.tsx` to modify the landing page content
- Update styles in `src/styles/globals.css` or use Tailwind classes
- Modify metadata in `src/app/layout.tsx`

## Deployment

This app can be deployed on any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted