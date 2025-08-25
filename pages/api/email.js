export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { order } = req.body;
  if (!order) return res.status(400).json({ error: 'order required' });

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn('RESEND_API_KEY not set');
    return res.status(200).json({ success: false, reason: 'resend not configured' });
  }

  const html = `
    <h2>Terima kasih sudah berbelanja di Arins Market</h2>
    <p>Order ID: <b>${order.orderId}</b></p>
    <p>Produk: ${order.product}</p>
    <p>Harga: Rp ${Number(order.price).toLocaleString('id-ID')}</p>
    <p>Status: <b>${order.status}</b></p>
    <p>Live Chat: <a href="${process.env.NEXT_PUBLIC_DOMAIN || 'https://xxxx.xx'}${order.chat_url}">Klik disini</a></p>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Arins Market <no-reply@arinsmarket.com>',
        to: order.email,
        subject: `Struk Pembayaran - ${order.orderId}`,
        html
      })
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error', err);
    res.status(500).json({ error: err.message });
  }
}
