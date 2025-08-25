export async function sendDiscord(order, status) {
  const webhook = process.env.DISCORD_WEBHOOK || (typeof window === 'undefined' ? require('../config/keys').DISCORD_WEBHOOK : null);
  if (!webhook) return;
  const color = status === 'PENDING' ? 3447003 : 5763719;
  const embed = {
    embeds: [
      {
        title: status === 'PENDING' ? '🟡 Order Baru' : '🟢 Pembayaran Berhasil',
        color,
        fields: [
          { name: 'Order ID', value: order.orderId, inline: false },
          { name: 'Produk', value: String(order.product), inline: true },
          { name: 'Email', value: String(order.email), inline: true },
          { name: 'Harga', value: `Rp ${Number(order.price).toLocaleString('id-ID')}`, inline: false },
          { name: 'Chat', value: `${process.env.DOMAIN || 'https://xxxx.xx'}${order.chat_url}`, inline: false }
        ],
        footer: { text: 'Arins Market' }
      }
    ]
  };

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(embed)
  }).catch(err => console.error('Discord webhook failed', err));
}
