import { sendDiscord } from '../../utils/discord';
import keys from '../../config/keys';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { product, price, email } = req.body;
  const orderId = `${keys.MERCHANT_ID}-${Date.now()}`;

  try {
    const qrisRes = await fetch('https://restapi-v2.simplebot.my.id/orderkuota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: keys.API_KEY,
        merchant: keys.MERCHANT_ID,
        amount: price,
        note: `${product} - ${email}`,
      })
    });

    const qrisData = await qrisRes.json().catch(()=>({}));

    const order = {
      orderId,
      product,
      price,
      email,
      qr_url: qrisData.qr_url || keys.QR_CODE,
      status: 'PENDING',
      verified: false,
      chat_url: `/chat/room_${orderId}`
    };

    // send discord pending
    await sendDiscord(order, 'PENDING');

    // respond with order data
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
