# Arins Market - Next.js (Vercel) — Roblox Sheckels Store

This project is a ready-to-deploy Next.js store for selling "Sheckels" with:
- QRIS generation via `restapi-v2.simplebot.my.id`
- Auto-check status endpoint
- Discord notifications (embed)
- Resend-powered email receipts (configure RESEND_API_KEY)
- Unique live-chat page per order: `/chat/room_ORDERID`

## Setup (Vercel)
1. Upload this project to a git repo or deploy the folder to Vercel.
2. Add environment variables in Vercel dashboard (or `.env.local` locally):
   - SIMPLEBOT_API_KEY (your SimpleBot API key)
   - MERCHANT_ID
   - KEY_ORKUT
   - RESEND_API_KEY (for email sending)
   - DISCORD_WEBHOOK (your Discord webhook URL)
   - DOMAIN (your public domain, e.g. https://arins.example)

3. `npm install` then `npm run dev` locally, or deploy to Vercel.

## Files included
- pages/index.js
- pages/checkout.js
- pages/chat/[room].js
- pages/api/order.js
- pages/api/status.js
- pages/api/email.js
- utils/discord.js
- config/keys.js (contains the keys you provided)
- README.md

⚠️ IMPORTANT:
- Replace `https://xxxx.xx` in the code with your actual chat domain (or set DOMAIN env var).
- Make sure the SimpleBot API accepts the payload shape used in `/api/order.js`; adjust if necessary.
