# GeoLocator — AI-Powered Photo Geolocation

Upload a photo, pay **100 sats** via Lightning Network, and Gemini 2.5 Flash identifies the **top 3 most likely locations** the photo was taken.

## Stack

- **Next.js 16** (App Router)
- **@moneydevkit/nextjs** — Lightning Network checkout loop
- **Google Gemini 2.5 Flash** — geospatial-intelligence analysis
- **shadcn/ui** — component design
- **Vercel** — deployment

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd mdk
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

| Variable | Where to get it |
|---|---|
| `MDK_ACCESS_TOKEN` | [moneydevkit.com/dashboard](https://moneydevkit.com/dashboard) or `npx @moneydevkit/create` |
| `MDK_MNEMONIC` | Same as above |
| `GEMINI_API_KEY` | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |

### 3. Run locally

```bash
npm run dev
```

For local Lightning payments you need to expose your dev server:

```bash
ngrok http 3000
```

Then set your app URL in the [MDK dashboard](https://moneydevkit.com/dashboard) to `https://<your-ngrok-id>.ngrok-free.app`.

## Deploy to Vercel

```bash
vercel deploy
```

Add the three environment variables (`MDK_ACCESS_TOKEN`, `MDK_MNEMONIC`, `GEMINI_API_KEY`) in your Vercel project settings, then set your app URL in the MDK dashboard to your Vercel deployment URL.

## Privacy

Images are **never stored server-side**. The uploaded photo is held in `sessionStorage` for the duration of the checkout redirect and deleted from the browser immediately after the Gemini analysis completes.
