import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Checkout() {
  const router = useRouter();
  const { product, price } = router.query;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('PENDING');

  useEffect(() => {
    let iv;
    if (order && !order.verified) {
      iv = setInterval(async () => {
        const res = await fetch(`/api/status?orderId=${order.orderId}`);
        const data = await res.json();
        if (data.paid) {
          setOrder(prev => ({...prev, verified: true, status: 'PAID'}));
          setStatus('PAID');
          clearInterval(iv);
        }
      }, 8000);
    }
    return () => clearInterval(iv);
  }, [order]);

  const handleCheckout = async () => {
    if (!email) return alert('Masukkan email aktif');
    setLoading(true);
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, price, email })
    });
    const data = await res.json();
    setOrder(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <p className="mb-2">Produk: <strong>{product}</strong></p>
        <p className="mb-4">Harga: <strong>Rp {Number(price || 0).toLocaleString('id-ID')}</strong></p>

        <label className="block mb-2 font-semibold">Email Pembeli</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-4 py-2 rounded-md mb-4" placeholder="email@contoh.com" />

        {!order ? (
          <button onClick={handleCheckout} disabled={loading} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg">
            {loading ? 'Memproses...' : 'Bayar Sekarang'}
          </button>
        ) : (
          <div className="text-center">
            <h3 className="font-bold mb-2">Scan QRIS untuk Bayar</h3>
            {order.qr_url ? (
              <img src={order.qr_url} alt="QRIS" className="mx-auto mb-4 w-56 h-56 object-contain" />
            ) : (
              <div className="w-56 h-56 mx-auto mb-4 flex items-center justify-center bg-gray-100">QR Tidak Tersedia</div>
            )}
            <p className="text-sm text-gray-600">OrderID: {order.orderId}</p>
            <p className="text-sm text-gray-600">Status: {status}</p>
            {status === 'PAID' && (
              <a href={`${process.env.NEXT_PUBLIC_DOMAIN || 'https://xxxx.xx'}${order.chat_url}`} className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded">
                Buka Live Chat
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
