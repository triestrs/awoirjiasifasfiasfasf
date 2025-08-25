import { sendDiscord } from '../../utils/discord';
import keys from '../../config/keys';

export default async function handler(req, res) {
  const { orderId } = req.query;
  if (!orderId) return res.status(400).json({ error: 'orderId required' });

  try {
    const url = `https://restapi-v2.simplebot.my.id/orderkuota/cekstatus?apikey=${keys.API_KEY}&merchant=${keys.MERCHANT_ID}&keyorkut=${keys.KEY_ORKUT}&orderId=${orderId}`;
    const r = await fetch(url);
    const data = await r.json().catch(()=>({}));

    // Assume provider returns { status: 'PAID' } or similar.
    const isPaid = String(data.status || data.state || data.paid || '').toUpperCase() === 'PAID' || Boolean(data.paid);

    if (isPaid) {
      const order = {
        orderId,
        product: data.product || 'Sheckels',
        price: data.amount || data.total || 0,
        email: data.email || 'unknown',
        status: 'PAID',
        chat_url: `/chat/room_${orderId}`
      };
      // notify discord payment success
      await sendDiscord(order, 'PAID');

      // also trigger email sending via Resend endpoint (serverless)
      await fetch(`${process.env.NEXT_PUBLIC_DOMAIN || ''}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order })
      }).catch(()=>{});

      return res.status(200).json({ paid: true, chatLink: `${process.env.NEXT_PUBLIC_DOMAIN || 'https://xxxx.xx'}/chat/room_${orderId}` });
    }

    res.status(200).json({ paid: false, raw: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
